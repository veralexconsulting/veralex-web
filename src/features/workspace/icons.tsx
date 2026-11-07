'use client';

/*
 * Sidebar icon set. Inline SVG with stroke 1.5, currentColor and a 20px box so the
 * glyphs render identically on every OS (the previous Unicode characters did not).
 */
export type WorkspaceIconName =
  | 'dashboard'
  | 'projects'
  | 'clients'
  | 'team'
  | 'history'
  | 'settings'
  | 'notifications'
  | 'account'
  | 'logout'
  | 'globe'
  | 'chevron';

const paths: Record<WorkspaceIconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  projects: (
    <>
      <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2h7A1.5 1.5 0 0 1 19 9.5v8A1.5 1.5 0 0 1 17.5 19h-13A1.5 1.5 0 0 1 3 17.5z" />
    </>
  ),
  clients: (
    <>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19.5c0-3.1 2.5-5.25 5.5-5.25s5.5 2.15 5.5 5.25" />
      <path d="M16 5.4a3.1 3.1 0 0 1 0 5.9" />
      <path d="M17.5 14.6c1.9.5 3.2 2.2 3.2 4.3" />
    </>
  ),
  team: (
    <>
      <circle cx="12" cy="7.5" r="3" />
      <path d="M5.5 20c0-3.4 2.9-5.75 6.5-5.75s6.5 2.35 6.5 5.75" />
    </>
  ),
  history: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3.2 2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.4a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1.37z" />
    </>
  ),
  notifications: (
    <>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="10" r="2.75" />
      <path d="M6.6 18.4a6.2 6.2 0 0 1 10.8 0" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4.5h2.5A1.5 1.5 0 0 1 19 6v12a1.5 1.5 0 0 1-1.5 1.5H15" />
      <path d="M10.5 8 6.5 12l4 4" />
      <path d="M6.5 12H15" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.4 3.4 5.4 3.4 8.5s-1.2 6.1-3.4 8.5c-2.2-2.4-3.4-5.4-3.4-8.5S9.8 5.9 12 3.5z" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
};

export function WorkspaceIcon({ name, className }: { name: WorkspaceIconName; className?: string }) {
  return (
    <svg
      className={className ? `ws-icon ${className}` : 'ws-icon'}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
