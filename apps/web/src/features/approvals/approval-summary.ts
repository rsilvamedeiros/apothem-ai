const MAX_SHOWN = 99;

/** "7", or "99+" so a long queue never stretches the menu. */
export function formatPendingCount(pending: number): string {
  return pending > MAX_SHOWN ? `${MAX_SHOWN}+` : String(pending);
}

/** The spoken form of the badge, for screen readers and tooltips. */
export function describePending(pending: number): string {
  return pending === 1 ? "1 approval waiting for a person" : `${pending} approvals waiting for a person`;
}
