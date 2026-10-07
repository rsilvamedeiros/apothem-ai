import { listAuditEvents, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";

export type AuditEventView = {
  id: string;
  workspaceId: string | null;
  actorPrincipalId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
};

export type LoadAuditEventsResult =
  | { kind: "ok"; events: AuditEventView[]; nextCursor: string | null }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

const MESSAGES: Record<number, string> = {
  400: "That page of events is no longer valid. Start again from the latest events.",
  401: "You need to sign in again.",
  403: "You do not have permission to view the audit log.",
  404: "This organization was not found.",
};

/** Never forwards API error bodies; messages are fixed per status. */
export async function loadAuditEvents(
  client: ApothemApiClient,
  organizationId: string,
  options: { cursor?: string },
): Promise<LoadAuditEventsResult> {
  if (!isUuid(organizationId)) {
    return { kind: "error", message: "This organization was not found." };
  }

  try {
    const { data, response } = await listAuditEvents(client, organizationId, {
      ...(options.cursor ? { cursor: options.cursor } : {}),
    });
    if (response.status >= 400 || !data) {
      return {
        kind: "error",
        message: MESSAGES[response.status] ?? "The audit log could not be loaded. Try again shortly.",
      };
    }
    return { kind: "ok", events: data.events as AuditEventView[], nextCursor: data.nextCursor };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
