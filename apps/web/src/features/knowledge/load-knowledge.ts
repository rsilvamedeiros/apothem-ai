import {
  getKnowledgeBase,
  listKnowledgeBases,
  listKnowledgeDocuments,
  type ApothemApiClient,
} from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import type { KnowledgeBaseView, KnowledgeDocumentView } from "./knowledge-model";

export type LoadKnowledgeBasesResult =
  | { kind: "ok"; bases: KnowledgeBaseView[] }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

export type LoadKnowledgeBaseResult =
  | { kind: "ok"; base: KnowledgeBaseView; documents: KnowledgeDocumentView[] }
  | { kind: "not_found" }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

const MESSAGES: Record<number, string> = {
  401: "You need to sign in again.",
  403: "You don't have access to knowledge in this workspace.",
  404: "This workspace was not found.",
};

/** Never forwards API error bodies. */
export async function loadKnowledgeBases(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
): Promise<LoadKnowledgeBasesResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) {
    return { kind: "error", message: MESSAGES[404]! };
  }

  try {
    const { data, response } = await listKnowledgeBases(client, organizationId, workspaceId);
    if (response.status >= 400 || !data) {
      return { kind: "error", message: MESSAGES[response.status] ?? "Knowledge bases could not be loaded. Try again shortly." };
    }
    return { kind: "ok", bases: data.knowledgeBases as KnowledgeBaseView[] };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}

export async function loadKnowledgeBase(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
): Promise<LoadKnowledgeBaseResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(knowledgeBaseId)) {
    return { kind: "not_found" };
  }

  try {
    const [baseResult, documentsResult] = await Promise.all([
      getKnowledgeBase(client, organizationId, workspaceId, knowledgeBaseId),
      listKnowledgeDocuments(client, organizationId, workspaceId, knowledgeBaseId),
    ]);

    const status = baseResult.response.status;
    if (status === 404) return { kind: "not_found" };
    if (status >= 400 || !baseResult.data) {
      return { kind: "error", message: MESSAGES[status] ?? "The knowledge base could not be loaded. Try again shortly." };
    }
    if (documentsResult.response.status >= 400 || !documentsResult.data) {
      return { kind: "error", message: "The documents could not be loaded. Try again shortly." };
    }
    return {
      kind: "ok",
      base: baseResult.data as KnowledgeBaseView,
      documents: documentsResult.data.documents as KnowledgeDocumentView[],
    };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
