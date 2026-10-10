export interface InvitationClaimResponse {
  state: 'claimed' | 'claimed_owned' | 'claimed_other' | 'expired' | 'revoked' | 'invalid';
  projectId?: string;
}

const projectIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function invitationClaimDestination(result: InvitationClaimResponse): { path: string; claimed: boolean } | null {
  if (result.state !== 'claimed' && result.state !== 'claimed_owned') return null;
  if (result.projectId && projectIdPattern.test(result.projectId)) {
    return { path: `/portal/proyek/${result.projectId}`, claimed: true };
  }
  return { path: '/portal?invitation=claimed', claimed: true };
}
