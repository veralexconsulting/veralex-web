export interface WorkspaceAuthIdentity {
  provider?: string | null;
}

export interface WorkspaceAuthUserIdentity {
  app_metadata?: {
    provider?: string | null;
    providers?: string[] | null;
  } | null;
  identities?: WorkspaceAuthIdentity[] | null;
}

/**
 * Supabase's primary provider can be `email` when Google is a linked identity.
 * `getUser()` returns the verified identity list, so include it when deciding
 * whether this account has a Google identity for the client portal.
 */
export function hasGoogleIdentity(user: WorkspaceAuthUserIdentity): boolean {
  return user.app_metadata?.provider === 'google'
    || Boolean(user.app_metadata?.providers?.includes('google'))
    || Boolean(user.identities?.some(identity => identity.provider === 'google'));
}
