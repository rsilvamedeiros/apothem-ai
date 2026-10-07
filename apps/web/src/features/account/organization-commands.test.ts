import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { createOrganizationCommand, parseOrganizationForm } from "./organization-commands";

const ORG = "11111111-1111-4111-8111-111111111111";
const form = (entries: Record<string, string>) => new Map(Object.entries(entries));

describe("parseOrganizationForm", () => {
  it("derives the slug from the name", () => {
    expect(parseOrganizationForm(form({ name: " Acme Corp " }))).toEqual({
      ok: true,
      value: { name: "Acme Corp", slug: "acme-corp" },
    });
  });

  it("uses an explicit valid slug", () => {
    expect(parseOrganizationForm(form({ name: "Acme", slug: "acme-br" }))).toEqual({
      ok: true,
      value: { name: "Acme", slug: "acme-br" },
    });
  });

  it.each([
    ["empty name", { name: "" }, "Enter a name."],
    ["name too long", { name: "n".repeat(201) }, "Use at most 200 characters."],
    ["no usable slug", { name: "!!!" }, "Use letters or numbers in the name or enter a slug."],
    ["invalid slug", { name: "Acme", slug: "Bad Slug" }, "Use lowercase letters, numbers and single hyphens (up to 63 characters)."],
  ])("rejects %s", (_label, entries, message) => {
    expect(parseOrganizationForm(form(entries))).toEqual({ ok: false, message });
  });

  it("ignores unexpected fields and non-string values", () => {
    expect(parseOrganizationForm(form({ name: "A", id: "evil", organizationId: "evil" }))).toMatchObject({ ok: true });
    expect(parseOrganizationForm({ get: () => new Blob(["x"]) })).toMatchObject({ ok: false });
  });
});

describe("createOrganizationCommand", () => {
  const client = (status: number, data?: unknown, seen: unknown[] = []) =>
    ({
      POST: async (_path: string, init?: { body?: unknown }) => {
        seen.push(init?.body);
        return { data, response: { status } };
      },
    }) as unknown as ApothemApiClient;

  it("returns the new organization id and sends only name and slug", async () => {
    const seen: unknown[] = [];
    const result = await createOrganizationCommand(client(201, { id: ORG }, seen), { name: "Acme", slug: "acme" });
    expect(result).toEqual({ kind: "created", organizationId: ORG });
    expect(seen[0]).toEqual({ name: "Acme", slug: "acme" });
  });

  it.each([
    [409, "That name is already taken. Try a different name or slug."],
    [401, "You need to sign in again."],
    [400, "Some fields are invalid. Review the form and try again."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i", async (status, message) => {
    expect(await createOrganizationCommand(client(status), { name: "A", slug: "a" })).toEqual({ kind: "error", message });
  });

  it("does not accept a response without a valid id as success", async () => {
    expect(await createOrganizationCommand(client(201, {}), { name: "A", slug: "a" })).toMatchObject({ kind: "error" });
  });

  it("reports an unreachable API", async () => {
    const network = { POST: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await createOrganizationCommand(network, { name: "A", slug: "a" })).toEqual({
      kind: "error",
      message: "apothem-api is unreachable. Try again shortly.",
    });
  });
});
