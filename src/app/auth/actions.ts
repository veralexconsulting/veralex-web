'use server';

import { createActionClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AuthResult = {
    error?: string;
    success?: boolean;
};

export async function login(formData: FormData): Promise<AuthResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email dan password harus diisi.' };
    }

    const supabase = createActionClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('Invalid login credentials')) {
            return { error: 'Email atau password salah.' };
        }
        if (error.message.includes('Email not confirmed')) {
            return { error: 'Email belum diverifikasi. Karena pengaturan sebelumnya salah, silahkan buat akun baru dengan email lain.' };
        }
        return { error: error.message };
    }

    // Fetch role for redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Gagal mengambil data pengguna.' };
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role ?? 'client';

    if (role === 'admin') {
        redirect('/admin');
    } else {
        redirect('/dashboard');
    }
}

export async function register(formData: FormData): Promise<AuthResult> {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        return { error: 'Semua field wajib diisi.' };
    }

    if (fullName.trim().length < 2) {
        return { error: 'Nama lengkap minimal 2 karakter.' };
    }

    if (password.length < 6) {
        return { error: 'Password minimal 6 karakter.' };
    }

    if (password !== confirmPassword) {
        return { error: 'Konfirmasi password tidak cocok.' };
    }

    const supabase = createActionClient();

    // Sign up with Supabase Auth
    // Phone is included in metadata so the DB trigger can use it
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName.trim(),
                phone: phone,
            },
        },
    });

    if (error) {
        if (error.message.includes('already registered')) {
            return { error: 'Email sudah terdaftar. Silakan login.' };
        }
        if (error.message.includes('rate limit')) {
            return { error: 'Terlalu banyak percobaan daftar. Silakan coba lagi dalam beberapa menit.' };
        }
        return { error: error.message };
    }

    if (!data.user) {
        return { error: 'Gagal membuat akun.' };
    }

    // Try to create/update profile (trigger may have already created it)
    const { error: profileError } = await supabase
        .from('users')
        .upsert({
            id: data.user.id,
            email: email,
            full_name: fullName.trim(),
            phone: phone,
            role: 'client',
        }, { onConflict: 'id' });

    if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail - the trigger should have created it
    }

    redirect('/dashboard');
}

export async function logout(): Promise<void> {
    const supabase = createActionClient();
    await supabase.auth.signOut();
    redirect('/auth/login');
}
