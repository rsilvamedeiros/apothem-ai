import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadTools } from "./load-tools";

const tool = { name: "create_note", description: "note", risk: "reversible_write", allowedApprovalModes: ["required", "auto"] };

const client = (status: number, data?: unknown) =>
  ({ GET: async () => ({ data, response: { status } }) }) as unknown as ApothemApiClient;

describe("loadTools", () => {
  it("returns the catalog", async () => {
    expect(await loadTools(client(200, { tools: [tool] }))).toEqual({ kind: "ok", tools: [tool] });
  });

  it("maps failures to a fixed message", async () => {
    expect(await loadTools(client(401))).toEqual({ kind: "error", message: "You need to sign in again." });
    expect(await loadTools(client(500))).toEqual({ kind: "error", message: "The tool catalog could not be loaded." });
  });

  it("reports an unreachable API and rethrows unexpected errors", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadTools(network)).toEqual({ kind: "error", message: "apothem-api is unreachable." });
    const broken = { GET: async () => { throw new RangeError("boom"); } } as unknown as ApothemApiClient;
    await expect(loadTools(broken)).rejects.toThrow("boom");
  });
});
