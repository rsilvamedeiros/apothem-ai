import type { ApothemApiClient } from "./client";

const BASES = "/v1/organizations/{organizationId}/workspaces/{workspaceId}/knowledge-bases" as const;
const BASE = `${BASES}/{knowledgeBaseId}` as const;

function workspaceParams(organizationId: string, workspaceId: string) {
  return { organizationId, workspaceId };
}

function baseParams(organizationId: string, workspaceId: string, knowledgeBaseId: string) {
  return { organizationId, workspaceId, knowledgeBaseId };
}

export async function listKnowledgeBases(client: ApothemApiClient, organizationId: string, workspaceId: string) {
  return client.GET(BASES, { params: { path: workspaceParams(organizationId, workspaceId) } });
}

export async function createKnowledgeBase(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  input: { name: string; description?: string },
) {
  return client.POST(BASES, { params: { path: workspaceParams(organizationId, workspaceId) }, body: input });
}

export async function getKnowledgeBase(client: ApothemApiClient, organizationId: string, workspaceId: string, knowledgeBaseId: string) {
  return client.GET(BASE, { params: { path: baseParams(organizationId, workspaceId, knowledgeBaseId) } });
}

/** An archived base stops being retrievable at once. */
export async function archiveKnowledgeBase(client: ApothemApiClient, organizationId: string, workspaceId: string, knowledgeBaseId: string) {
  return client.POST(`${BASE}/archive`, { params: { path: baseParams(organizationId, workspaceId, knowledgeBaseId) } });
}

/** Identical content already in the base comes back as the existing document (`replayed: true`). */
export async function addKnowledgeDocument(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  input: { title: string; content: string },
) {
  return client.POST(`${BASE}/documents`, {
    params: { path: baseParams(organizationId, workspaceId, knowledgeBaseId) },
    body: input,
  });
}

export async function listKnowledgeDocuments(client: ApothemApiClient, organizationId: string, workspaceId: string, knowledgeBaseId: string) {
  return client.GET(`${BASE}/documents`, { params: { path: baseParams(organizationId, workspaceId, knowledgeBaseId) } });
}

export async function removeKnowledgeDocument(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  documentId: string,
) {
  return client.DELETE(`${BASE}/documents/{documentId}`, {
    params: { path: { ...baseParams(organizationId, workspaceId, knowledgeBaseId), documentId } },
  });
}

/** Shows what an agent bound to this base would be given for the query. */
export async function searchKnowledgeBase(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  input: { query: string },
) {
  return client.POST(`${BASE}/search`, {
    params: { path: baseParams(organizationId, workspaceId, knowledgeBaseId) },
    body: input,
  });
}
