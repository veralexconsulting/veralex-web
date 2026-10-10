/**
 * Supavisor's shared pooler uses port 5432 for session mode and 6543 for
 * transaction mode. Vercel functions create short-lived concurrent workers,
 * so keep Supabase pooler URLs on the serverless-safe transaction port.
 * Direct database hosts and other PostgreSQL providers are left untouched.
 */
export function workspacePgConnectionString(connectionString) {
  const url = new URL(connectionString);
  if (url.hostname.endsWith('.pooler.supabase.com') && url.port === '5432') {
    url.port = '6543';
  }
  return url.toString();
}
