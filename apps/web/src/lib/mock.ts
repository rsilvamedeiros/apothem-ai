type Organization = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended" | "pending_deletion";
  createdAt: string;
  updatedAt: string;
};

type Workspace = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

const NOW = new Date().toISOString();

/**
 * Dev-only fixtures used when apothem-api is unreachable, so the workspace
 * shell can be reviewed visually without the API/database running. Never
 * used once a real API response (success or explicit error) is received.
 */
export function mockOrganization(organizationId: string): Organization {
  return {
    id: organizationId,
    name: "Demo Organization",
    slug: "demo-org",
    status: "active",
    createdAt: NOW,
    updatedAt: NOW,
  };
}

const MOCK_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

export function mockWorkspaces(organizationId: string): Workspace[] {
  return [
    {
      id: MOCK_WORKSPACE_ID,
      organizationId,
      name: "Support Operations",
      slug: "support-operations",
      status: "active",
      createdAt: NOW,
      updatedAt: NOW,
    },
  ];
}

export function mockWorkspace(organizationId: string, workspaceId: string): Workspace {
  const [fixture] = mockWorkspaces(organizationId);
  return { ...fixture, id: workspaceId };
}

/** True when `fetch` itself failed (e.g. apothem-api is not running). */
export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}
