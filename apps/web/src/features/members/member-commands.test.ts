import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import {
  addMemberCommand,
  changeMemberRoleCommand,
  revokeMemberCommand,
} from "./member-commands";

const ORG = "11111111-1111-4111-8111-111111111111";
const MEMBERSHIP = "44444444-4444-4444-8444-444444444444";

type Seen = { path?: string; body?: unknown };

function client(status: number, seen: Seen[] = []) {
  const handler = async (path: string, init?: { body?: unknown }) => {
    seen.push({ path, body: init?.body });
    return { data: {}, response: { status } };
  };
  return { POST: handler, PATCH: handler, GET: handler } as unknown as ApothemApiClient;
}

const throwing = (error: unknown) =>
  ({ POST: async () => { throw error; }, PATCH: async () => { throw error; } }) as unknown as ApothemApiClient;

describe("addMemberCommand", () => {
  it("sends a trimmed lowercase email and the role", async () => {
    const seen: Seen[] = [];
    const result = await addMemberCommand(client(201, seen), ORG, { email: "  New@Example.com ", role: "builder" });
    expect(result).toEqual({ kind: "done", message: "Member added." });
    expect(seen[0]?.body).toEqual({ email: "new@example.com", role: "builder" });
  });

  it.each(["", "not-an-email", "a@b", "a b@example.com"])("rejects the email %j without calling the API", async (email) => {
    const seen: Seen[] = [];
    const result = await addMemberCommand(client(201, seen), ORG, { email, role: "builder" });
    expect(result).toEqual({ kind: "error", message: "Enter a valid email address." });
    expect(seen).toHaveLength(0);
  });

  it("rejects an unknown role without calling the API", async () => {
    const seen: Seen[] = [];
    const result = await addMemberCommand(client(201, seen), ORG, { email: "a@example.com", role: "superadmin" });
    expect(result).toEqual({ kind: "error", message: "Choose a valid role." });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [403, "Your role cannot add members with that role."],
    [404, "No active account found for that email."],
    [409, "This account is already a member."],
    [401, "You need to sign in again."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i", async (status, message) => {
    expect(await addMemberCommand(client(status), ORG, { email: "a@example.com", role: "builder" })).toEqual({
      kind: "error",
      message,
    });
  });

  it("refuses a malformed organization id", async () => {
    const seen: Seen[] = [];
    const result = await addMemberCommand(client(201, seen), "../x", { email: "a@example.com", role: "builder" });
    expect(result).toEqual({ kind: "error", message: "This organization was not found." });
    expect(seen).toHaveLength(0);
  });

  it("reports an unreachable API", async () => {
    expect(await addMemberCommand(throwing(new TypeError("fetch failed")), ORG, { email: "a@example.com", role: "builder" })).toEqual({
      kind: "error",
      message: "apothem-api is unreachable. Try again shortly.",
    });
  });
});

describe("changeMemberRoleCommand", () => {
  it("patches the role", async () => {
    const seen: Seen[] = [];
    const result = await changeMemberRoleCommand(client(200, seen), ORG, MEMBERSHIP, "auditor");
    expect(result).toEqual({ kind: "done", message: "Role updated." });
    expect(seen[0]?.body).toEqual({ role: "auditor" });
  });

  it("validates ids and the role before calling", async () => {
    const seen: Seen[] = [];
    expect(await changeMemberRoleCommand(client(200, seen), ORG, "bad", "auditor")).toEqual({
      kind: "error",
      message: "This member was not found.",
    });
    expect(await changeMemberRoleCommand(client(200, seen), ORG, MEMBERSHIP, "toString")).toEqual({
      kind: "error",
      message: "Choose a valid role.",
    });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [403, "Your role cannot make this change."],
    [404, "This member was not found."],
    [409, "This change is not allowed. An organization must keep at least one active owner, and revoked members cannot be edited."],
  ])("maps HTTP %i", async (status, message) => {
    expect(await changeMemberRoleCommand(client(status), ORG, MEMBERSHIP, "auditor")).toEqual({ kind: "error", message });
  });
});

describe("revokeMemberCommand", () => {
  it("revokes and reports done", async () => {
    const seen: Seen[] = [];
    expect(await revokeMemberCommand(client(200, seen), ORG, MEMBERSHIP)).toEqual({ kind: "done", message: "Access revoked." });
    expect(seen[0]?.path).toContain("/revoke");
  });

  it.each([
    [403, "Your role cannot make this change."],
    [404, "This member was not found."],
    [409, "This change is not allowed. An organization must keep at least one active owner, and revoked members cannot be edited."],
  ])("maps HTTP %i", async (status, message) => {
    expect(await revokeMemberCommand(client(status), ORG, MEMBERSHIP)).toEqual({ kind: "error", message });
  });
});
