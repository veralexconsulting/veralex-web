export class WorkspaceAuthUnavailableError extends Error {
  constructor() {
    super('Authentication could not be verified. Check your connection and try again.');
    this.name = 'WorkspaceAuthUnavailableError';
  }
}

export function isTransientAuthError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { status?: unknown; name?: unknown; message?: unknown };
  if (typeof candidate.status === 'number') return candidate.status >= 500 || candidate.status === 0;
  const name = typeof candidate.name === 'string' ? candidate.name : '';
  const message = typeof candidate.message === 'string' ? candidate.message : '';
  return /retryable|fetch|network|timeout|temporar/i.test(`${name} ${message}`);
}
