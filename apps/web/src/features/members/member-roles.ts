/** Roles the API knows. Which of them an actor may grant is decided by apothem-api, not here. */
export const MEMBER_ROLES = ["owner", "admin", "builder", "operator", "auditor"] as const;

export type MemberRoleName = (typeof MEMBER_ROLES)[number];
