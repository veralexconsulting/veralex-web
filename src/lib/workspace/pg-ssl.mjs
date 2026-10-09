export function workspacePgSsl(env = process.env) {
  const mode = env.DATABASE_SSL || 'require';
  if (mode === 'disable') return false;
  if (mode === 'require') return { rejectUnauthorized: false };
  if (mode === 'verify-full') {
    const ca = env.DATABASE_CA_CERT?.replace(/\\n/g, '\n');
    if (!ca) throw new Error('DATABASE_CA_CERT wajib diisi saat DATABASE_SSL=verify-full.');
    return { rejectUnauthorized: true, ca };
  }
  throw new Error('DATABASE_SSL harus disable, require, atau verify-full.');
}
