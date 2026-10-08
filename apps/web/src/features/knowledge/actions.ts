"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { getApiClient } from "@/lib/session";
import type { SearchPanelState } from "./components/search-panel";
import {
  addDocumentCommand,
  archiveBaseCommand,
  createBaseCommand,
  removeDocumentCommand,
  searchCommand,
} from "./knowledge-commands";

/**
 * Tenant and knowledge base ids come from the route (bound by the page),
 * never from form fields, and apothem-api re-checks membership on every call.
 */
function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

const listPath = (organizationId: string, workspaceId: string) => `/org/${organizationId}/workspace/${workspaceId}/knowledge`;

function refresh(organizationId: string, workspaceId: string, knowledgeBaseId: string): void {
  revalidatePath(listPath(organizationId, workspaceId));
  revalidatePath(`${listPath(organizationId, workspaceId)}/${knowledgeBaseId}`);
}

export async function createKnowledgeBaseAction(
  organizationId: string,
  workspaceId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await createBaseCommand(await getApiClient(), organizationId, workspaceId, {
    name: text(formData, "name"),
    description: text(formData, "description"),
  });
  if (result.kind === "created") {
    revalidatePath(listPath(organizationId, workspaceId));
    redirect(`${listPath(organizationId, workspaceId)}/${result.knowledgeBaseId}`);
  }
  return { ok: false, message: result.message };
}

export async function addDocumentAction(
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await addDocumentCommand(await getApiClient(), organizationId, workspaceId, knowledgeBaseId, {
    title: text(formData, "title"),
    content: text(formData, "content"),
  });
  if (result.kind === "done") refresh(organizationId, workspaceId, knowledgeBaseId);
  return { ok: result.kind === "done", message: result.message };
}

export async function removeDocumentAction(
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  documentId: string,
): Promise<ActionState> {
  const result = await removeDocumentCommand(await getApiClient(), organizationId, workspaceId, knowledgeBaseId, documentId);
  if (result.kind === "done") refresh(organizationId, workspaceId, knowledgeBaseId);
  return { ok: result.kind === "done", message: result.message };
}

export async function archiveKnowledgeBaseAction(
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
): Promise<ActionState> {
  const result = await archiveBaseCommand(await getApiClient(), organizationId, workspaceId, knowledgeBaseId);
  if (result.kind === "done") refresh(organizationId, workspaceId, knowledgeBaseId);
  return { ok: result.kind === "done", message: result.message };
}

/** A search changes nothing, so it revalidates nothing: the passages come back as the action state. */
export async function searchKnowledgeAction(
  organizationId: string,
  workspaceId: string,
  knowledgeBaseId: string,
  _previous: SearchPanelState,
  formData: FormData,
): Promise<SearchPanelState> {
  const query = text(formData, "query");
  const result = await searchCommand(await getApiClient(), organizationId, workspaceId, knowledgeBaseId, query);
  return result.kind === "results" ? { query, results: result.results } : { query, message: result.message };
}
