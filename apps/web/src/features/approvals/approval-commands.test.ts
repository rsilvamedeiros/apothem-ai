import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { MAX_DECISION_REASON_LENGTH, decideApprovalCommand } from "./approval-commands";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const APPROVAL = "55555555-5555-4555-8555-555555555555";

type Seen = { body?: unknown; path?: string };
const client = (status: number, data?: unknown, seen: Seen[] = []) =>
  ({
    POST: async (path: string, init?: { body?: unknown }) => {
      seen.push({ path, body: init?.body });
      return { data, response: { status } };
    },
  }) as unknown as ApothemApiClient;

const decided = (status: string, runStatus: string) => ({
  approval: { id: APPROVAL, status },
  run: { id: "r1", status: runStatus },
});

describe("decideApprovalCommand", () => {
  it("approves and reports the resulting run status", async () => {
    const seen: Seen[] = [];
    const result = await decideApprovalCommand(client(200, decided("approved", "completed"), seen), ORG, WS, APPROVAL, "approve", "");
    expect(result).toEqual({ kind: "done", message: "Approved. The action was performed and the run completed." });
    expect(seen[0]?.body).toEqual({ decision: "approve" });
  });

  it("says when the run parked again waiting for another approval", async () => {
    const result = await decideApprovalCommand(client(200, decided("approved", "waiting_approval")), ORG, WS, APPROVAL, "approve", undefined);
    expect(result).toEqual({ kind: "done", message: "Approved. The agent now needs another approval." });
  });

  it("says when the approved action could not complete", async () => {
    const result = await decideApprovalCommand(client(200, decided("approved", "failed")), ORG, WS, APPROVAL, "approve", undefined);
    expect(result).toEqual({ kind: "done", message: "Approved, but the action could not be completed. See the run for details." });
  });

  it("rejects and sends the trimmed reason", async () => {
    const seen: Seen[] = [];
    const result = await decideApprovalCommand(client(200, decided("rejected", "failed"), seen), ORG, WS, APPROVAL, "reject", "  Wrong customer  ");
    expect(result).toEqual({ kind: "done", message: "Rejected. Nothing was done." });
    expect(seen[0]?.body).toEqual({ decision: "reject", reason: "Wrong customer" });
  });

  it("rejects an over-long reason without calling the API", async () => {
    const seen: Seen[] = [];
    const result = await decideApprovalCommand(client(200, undefined, seen), ORG, WS, APPROVAL, "reject", "x".repeat(MAX_DECISION_REASON_LENGTH + 1));
    expect(result).toEqual({ kind: "error", message: `Keep the reason under ${MAX_DECISION_REASON_LENGTH} characters.` });
    expect(seen).toHaveLength(0);
  });

  it("refuses malformed ids and unknown decisions before calling the API", async () => {
    const seen: Seen[] = [];
    expect(await decideApprovalCommand(client(200, undefined, seen), ORG, WS, "../x", "approve", "")).toEqual({
      kind: "error",
      message: "This approval was not found.",
    });
    expect(await decideApprovalCommand(client(200, undefined, seen), ORG, WS, APPROVAL, "maybe", "")).toEqual({
      kind: "error",
      message: "Choose approve or reject.",
    });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [401, "You need to sign in again."],
    [403, "You can't decide this approval. Only owners and admins can, and not their own request while another approver is available."],
    [404, "This approval was not found."],
    [409, "This approval can no longer be decided: it was already decided, expired, or the agent changed."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i", async (status, message) => {
    expect(await decideApprovalCommand(client(status), ORG, WS, APPROVAL, "approve", "")).toEqual({ kind: "error", message });
  });

  it("does not accept a success response without the decided approval", async () => {
    expect(await decideApprovalCommand(client(200, {}), ORG, WS, APPROVAL, "approve", "")).toMatchObject({ kind: "error" });
  });

  it("reports an unreachable API", async () => {
    const network = { POST: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await decideApprovalCommand(network, ORG, WS, APPROVAL, "approve", "")).toEqual({
      kind: "error",
      message: "apothem-api is unreachable. Try again shortly.",
    });
  });
});
