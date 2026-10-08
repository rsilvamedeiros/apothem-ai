import {
  addKnowledgeDocument,
  archiveKnowledgeBase,
  createKnowledgeBase,
  removeKnowledgeDocument,
  searchKnowledgeBase,
  type ApothemApiClient,
} from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import { KNOWLEDGE_LIMITS, type EvidenceView } from "./knowledge-model";

/**
 * Commands wrap API calls and translate every outcome into a fixed,
 * user-safe result. API error bodies are never forwarded to the UI.
 */
const UNREACHABLE = "apothem-api is unreachable. Try again shortly.";
const SIGN_IN_AGAIN = "You need to sign in again.";
const GENERIC = "Something went wrong. Try again shortly.";
const WORKSPACE_NOT_FOUND = "This workspace was not found.";
const BASE_NOT_FOUND = "This knowledge base was not found.";
const NO_PERMISSION = "You don't have permission to manage knowledge in this workspace.";

export type CommandResult = { kind: "done"; message: string } | { kind: "error"; message: string };
export type CreateBaseResult = { kind: "created"; knowledgeBaseId: string } | { kind: "error"; message: string };
export type SearchResult = { kind: "results"; results: EvidenceView[] } | { kind: "error"; message: string };

function reason(status: number, messages: Record<number, string>): string {
  if (status === 401) return SIGN_IN_AGAIN;
  return messages[status] ?? GENERIC;
}

async function guarded<T extends { kind: string }>(call: () => Promise<T>, onNetworkError: T): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (isNetworkError(error)) return onNetworkError;
    throw error;
  }
}

export async function createBaseCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  input: { name: string; description: string },
): Promise<CreateBaseResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) return { kind: "error", message: WORKSPACE_NOT_FOUND };

  const name = input.name.trim();
  const description = input.description.trim();
  if (name.length === 0) return { kind: "error", message: "Give the knowledge base a name." };
  if (name.length > KNOWLEDGE_LIMITS.name) {
    return { kind: "error", message: `Keep the name under ${KNOWLEDGE_LIMITS.name} characters.` };
  }
  if (description.length > KNOWLEDGE_LIMITS.description) {
    return { kind: "error", message: `Keep the description under ${KNOWLEDGE_LIMITS.description} characters.` };
  }

  return guarded<CreateBaseResult>(
    async () => {
      const { data, response } = await createKnowledgeBase(client, organizationId, workspaceId, {
        name,
        ...(description ? { description } : {}),
      });
      if (response.status < 300 && data?.id) return { kind: "created", knowledgeBaseId: data.id };
      return {
        kind: "error",
        message: reason(response.status, {
          400: "Some fields are invalid. Review the form and try again.",
          403: NO_PERMISSION,
          404: WORKSPACE_NOT_FOUND,
          409: "A knowledge base with this name already exists, or this workspace reached its limit of 20.",
        }),
      };
    },
    { kind: "error", message: UNREACHABLE },
  );
}

export async function archiveBaseCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
): Promise<CommandResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(knowledgeBaseId)) {
    return { kind: "error", message: BASE_NOT_FOUND };
  }

  return guarded<CommandResult>(
    async () => {
      const { response } = await archiveKnowledgeBase(client, organizationId, workspaceId, knowledgeBaseId);
      if (response.status < 300) return { kind: "done", message: "Archived. Agents no longer retrieve from this knowledge base." };
      return {
        kind: "error",
        message: reason(response.status, {
          403: NO_PERMISSION,
          404: BASE_NOT_FOUND,
          409: "This knowledge base is already archived.",
        }),
      };
    },
    { kind: "error", message: UNREACHABLE },
  );
}

export async function addDocumentCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  input: { title: string; content: string },
): Promise<CommandResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(knowledgeBaseId)) {
    return { kind: "error", message: BASE_NOT_FOUND };
  }

  const title = input.title.trim();
  const content = input.content.trim();
  if (title.length === 0) return { kind: "error", message: "Give the document a title." };
  if (title.length > KNOWLEDGE_LIMITS.title) {
    return { kind: "error", message: `Keep the title under ${KNOWLEDGE_LIMITS.title} characters.` };
  }
  if (content.length === 0) return { kind: "error", message: "Paste the text of the document." };
  if (content.length > KNOWLEDGE_LIMITS.content) {
    return { kind: "error", message: `Keep the text under ${KNOWLEDGE_LIMITS.content.toLocaleString("en-US")} characters.` };
  }

  return guarded<CommandResult>(
    async () => {
      const { data, response } = await addKnowledgeDocument(client, organizationId, workspaceId, knowledgeBaseId, { title, content });
      if (response.status < 300 && data) {
        return {
          kind: "done",
          message: data.replayed ? "This text is already in the knowledge base, so nothing was added." : "Document added. Agents can retrieve from it now.",
        };
      }
      return {
        kind: "error",
        message: reason(response.status, {
          400: "The document was rejected. Check the title and the text.",
          403: NO_PERMISSION,
          404: BASE_NOT_FOUND,
          409: "This knowledge base is archived or has reached its limit of 100 documents.",
        }),
      };
    },
    { kind: "error", message: UNREACHABLE },
  );
}

export async function removeDocumentCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  documentId: string,
): Promise<CommandResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(knowledgeBaseId) || !isUuid(documentId)) {
    return { kind: "error", message: "This document was not found." };
  }

  return guarded<CommandResult>(
    async () => {
      const { response } = await removeKnowledgeDocument(client, organizationId, workspaceId, knowledgeBaseId, documentId);
      if (response.status < 300) return { kind: "done", message: "Document removed. Agents can no longer retrieve from it." };
      return {
        kind: "error",
        message: reason(response.status, { 403: NO_PERMISSION, 404: "This document was not found." }),
      };
    },
    { kind: "error", message: UNREACHABLE },
  );
}

export async function searchCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  query: string,
): Promise<SearchResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(knowledgeBaseId)) {
    return { kind: "error", message: BASE_NOT_FOUND };
  }
  const text = query.trim();
  if (text.length === 0) return { kind: "error", message: "Type a question or a few words to search for." };
  if (text.length > KNOWLEDGE_LIMITS.query) {
    return { kind: "error", message: `Keep the search under ${KNOWLEDGE_LIMITS.query} characters.` };
  }

  return guarded<SearchResult>(
    async () => {
      const { data, response } = await searchKnowledgeBase(client, organizationId, workspaceId, knowledgeBaseId, { query: text });
      if (response.status < 300 && data) return { kind: "results", results: data.results as EvidenceView[] };
      return {
        kind: "error",
        message: reason(response.status, {
          400: "Use at least one word made of letters or numbers.",
          403: "You don't have permission to search this knowledge base.",
          404: BASE_NOT_FOUND,
          409: "This knowledge base is archived, so it cannot be searched.",
        }),
      };
    },
    { kind: "error", message: UNREACHABLE },
  );
}
