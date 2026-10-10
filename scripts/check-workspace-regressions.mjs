import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { invitationClaimDestination } from '../src/features/workspace/invitation-claim.ts';
import { isTransientAuthError } from '../src/lib/workspace/auth-errors.ts';
import { hasGoogleIdentity } from '../src/lib/workspace/identity.ts';

const claims = readFileSync('src/lib/workspace/claims.ts', 'utf8');
const operations = readFileSync('src/lib/workspace/operations.ts', 'utf8');
const middleware = readFileSync('src/middleware.ts', 'utf8');
const browserAuth = readFileSync('src/lib/workspace/browser.ts', 'utf8');
const authCallback = readFileSync('src/app/workspace/auth/callback/route.ts', 'utf8');
const adminLogin = readFileSync('src/features/workspace/client-pages.tsx', 'utf8');
const migration = readFileSync('supabase/migrations/202610100001_workspace_safe_admin_removals.sql', 'utf8');
const schema = readFileSync('supabase/migrations/202610090001_workspace_schema.sql', 'utf8');

test('Google-linked returning accounts are recognized even when email is the primary provider', () => {
  assert.equal(hasGoogleIdentity({ app_metadata: { provider: 'google' } }), true);
  assert.equal(hasGoogleIdentity({ app_metadata: { provider: 'email', providers: ['email', 'google'] } }), true);
  assert.equal(hasGoogleIdentity({ app_metadata: { provider: 'email' }, identities: [{ provider: 'google' }] }), true);
  assert.equal(hasGoogleIdentity({ app_metadata: { provider: 'email', providers: ['email'] }, identities: [] }), false);
});

test('multi-project access is keyed by immutable client user id without a one-project-per-client constraint', () => {
  assert.match(schema, /project_one_current_client_idx on public\.client_project_access\(project_id\) where revoked_at is null/);
  assert.match(schema, /client_project_access_user_idx on public\.client_project_access\(client_user_id, project_id\) where revoked_at is null/);
  assert.doesNotMatch(schema, /unique[^;]*client_project_access\(client_user_id\)/i);
  assert.match(claims, /insert into public\.client_project_access\(project_id,client_user_id\) values\(\$1,\$2\)/);
  assert.match(claims, /actor\.role==='admin'.*reason:'admin'/);
});

test('confirmed claim routes to its project and falls back to the portal if the id is unavailable', () => {
  const id = 'a806d5c2-1c58-4bc0-9e79-dbe4433d2200';
  assert.deepEqual(invitationClaimDestination({ state: 'claimed', projectId: id }), { path: `/portal/proyek/${id}`, claimed: true });
  assert.deepEqual(invitationClaimDestination({ state: 'claimed_owned' }), { path: '/portal?invitation=claimed', claimed: true });
  assert.equal(invitationClaimDestination({ state: 'claimed', projectId: 'not-a-project-id' }).path, '/portal?invitation=claimed');
  assert.equal(invitationClaimDestination({ state: 'claimed_other' }), null);
});

test('auth failures distinguish a missing session from transient verification failure', () => {
  assert.equal(isTransientAuthError(Object.assign(new Error('server unavailable'), { status: 503 })), true);
  assert.equal(isTransientAuthError(Object.assign(new Error('invalid JWT'), { status: 401 })), false);
  assert.equal(isTransientAuthError(new TypeError('fetch failed')), true);
  assert.equal(isTransientAuthError(new Error('Auth session missing')), false);
  assert.match(middleware, /NextResponse\.next\(\{request:req\}\)/);
  assert.match(middleware, /isTransientAuthError\(authResult\.error\)/);
});

test('admin and client sessions persist in the browser and OAuth callback redirect', () => {
  assert.match(browserAuth, /persistSession:\s*true/);
  assert.match(browserAuth, /autoRefreshToken:\s*true/);
  assert.match(browserAuth, /isSingleton:\s*true/);
  assert.match(authCallback, /authCookies\.set\(item\.name,item\)/);
  assert.match(authCallback, /response\.cookies\.set\(cookie\.name,cookie\.value,cookie\.options\)/);
  assert.match(adminLogin, /void recordLoginEvent\(\)\.catch\(\(\) => undefined\)/);
});

test('claim transaction serializes on project and invitation rows and preserves first claimant ownership', () => {
  assert.match(claims, /select id,status,deleted_at from public\.projects where id=\$1 for update/);
  assert.match(claims, /select \* from public\.project_access_links where token_hash=\$1 for update/);
  assert.match(claims, /link\.status==='claimed' \|\| owned/);
  assert.match(claims, /owned\?\.client_user_id===actor\.id \? \{state:'claimed_owned'/);
});

test('admin removals preserve relationships, block unresolved assignments, and revoke client invitations', () => {
  assert.match(operations, /update public\.projects set status='archived',deleted_at=now\(\),deleted_by=\$2/);
  assert.match(operations, /update public\.project_access_links set status='revoked'/);
  assert.match(operations, /p\.pic_user_id=\$1 or exists\(select 1 from public\.project_supporting_admins/);
  assert.match(operations, /updateUserById\(input\.id,\{ban_duration:'876000h'\}\)/);
  assert.match(operations, /update public\.clients set deleted_at=coalesce\(deleted_at,now\(\)\)/);
  assert.doesNotMatch(operations, /delete from public\.(projects|profiles)/i);
  assert.match(migration, /join public\.projects j on j\.id = a\.project_id[\s\S]*j\.deleted_at is null/);
});
