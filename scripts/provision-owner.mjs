import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import { workspacePgSsl } from '../src/lib/workspace/pg-ssl.mjs';

// Idempotent. Re-running never creates a second owner and never touches an
// unrelated account: it looks the identity up by its own hidden Auth email.
//
//   VERALEX_OWNER_AUTH_EMAIL=... VERALEX_OWNER_BOOTSTRAP_PASSWORD=... npm run owner:provision
//
// The password is read from the environment only. It is never a CLI argument,
// never written to a file, and never echoed.

const env = process.env;
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = env.DATABASE_URL;
const email = env.VERALEX_OWNER_AUTH_EMAIL?.trim().toLowerCase();
const password = env.VERALEX_OWNER_BOOTSTRAP_PASSWORD;
const allowWeak = env.VERALEX_OWNER_ALLOW_WEAK_BOOTSTRAP === '1';

if (!url || !serviceKey || !databaseUrl) throw new Error('Setel NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan DATABASE_URL.');
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Setel VERALEX_OWNER_AUTH_EMAIL ke alamat email internal yang tidak dapat dikirim (misalnya domain .invalid).');
if (password !== undefined) {
    const strong = password.length >= 12 && password.length <= 128 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
    if (!strong && !allowWeak) throw new Error('Kata sandi bootstrap harus minimal 12 karakter dengan huruf besar, kecil, dan angka. Jika benar-benar harus memakai kredensial awal yang lemah, setel VERALEX_OWNER_ALLOW_WEAK_BOOTSTRAP=1 — rotasi tetap dipaksa.');
}

const pool = new pg.Pool({ connectionString: databaseUrl, ssl: workspacePgSsl() });
const service = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function findByEmail() {
    for (let page = 1; page <= 20; page++) {
        const { data, error } = await service.auth.admin.listUsers({ page, perPage: 200 });
        if (error) throw new Error('Daftar pengguna Auth tidak dapat dibaca.');
        const found = data.users.find(user => user.email?.toLowerCase() === email);
        if (found) return found;
        if (data.users.length < 200) return undefined;
    }
    return undefined;
}

try {
    const existing = await findByEmail();
    let userId;
    let created = false;

    if (existing) {
        userId = existing.id;
        console.log('Akun proprietaris sudah ada. Tidak ada akun duplikat yang dibuat.');
        if (password === undefined) {
            console.log('VERALEX_OWNER_BOOTSTRAP_PASSWORD tidak diisi, kata sandi yang ada tidak diubah.');
        } else if (allowWeak) {
            await service.auth.admin.updateUserById(userId, { password });
            console.log('PERINGATAN: kata sandi lemah dipasang sebagai kredensial sementara. Rotasi dipaksa sebelum dashboard terbuka.');
        } else {
            const { error } = await service.auth.admin.updateUserById(userId, { password });
            if (error) throw new Error('Kata sandi belum dapat diperbarui.');
        }
    } else {
        if (password === undefined) throw new Error('Akun belum ada. Setel VERALEX_OWNER_BOOTSTRAP_PASSWORD untuk membuat akun pertama.');
        const options = {
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'VERALEX Owner' },
            app_metadata: { must_change_password: true },
        };
        const response = await service.auth.admin.createUser(options);
        if (response.error || !response.data.user) throw new Error('Akun proprietaris tidak dapat dibuat. Periksa konfigurasi Supabase Auth.');
        userId = response.data.user.id;
        created = true;
        if (allowWeak) console.log('PERINGATAN: kata sandi lemah dipasang sebagai kredensial sementara. Rotasi dipaksa sebelum dashboard terbuka.');
    }

    // active=false keeps the identity out of the admin workspace entirely:
    // requireWorkspaceAdmin and private.workspace_is_admin() both require active.
    // Only the VERALEX_OWNER_USER_ID match unlocks /aksesraffi.
    const profile = await pool.query(
        `insert into public.profiles(id,email,full_name,role,active,must_change_password)
         values($1,$2,'VERALEX Owner','admin',false,$3)
         on conflict(id) do update set email=excluded.email, role='admin', active=false`,
        [userId, email, password === undefined],
    );
    if (profile.error) throw new Error('Profil proprietaris tidak dapat disimpan.');
    // Re-running without a bootstrap password must never clear a rotation that
    // is still outstanding, so the flag is only forced on, never off.
    if (password !== undefined) await pool.query('update public.profiles set must_change_password=true where id=$1', [userId]);

    await pool.query("insert into public.audit_logs(actor_user_id,event_type,message) values($1,$2,$3)", [userId, created ? 'owner_provisioned' : 'owner_reprovisioned', 'Akun proprietaris analitik disiapkan.']);

    console.log(created ? 'Akun proprietaris dibuat.' : 'Akun proprietaris dipastikan aktif.');
    console.log('VERALEX_OWNER_USER_ID=' + userId);
    console.log(password === undefined ? 'Rotasi kata sandi tidak dipaksa (kredensial existing dipertahankan).' : 'Rotasi kata sandi dipaksa: pemilik harus menggantinya sebelum /aksesraffi terbuka.');
} finally {
    await pool.end();
}
