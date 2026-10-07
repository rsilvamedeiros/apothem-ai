import { describe, expect, it } from "vitest";
import { describeAgentStatus } from "./agent-status";

describe("describeAgentStatus", () => {
  it.each([
    ["draft", "Draft", "neutral"],
    ["active", "Active", "success"],
    ["disabled", "Disabled", "warning"],
    ["archived", "Archived", "neutral"],
  ] as const)("maps %s to %s with tone %s", (status, label, tone) => {
    expect(describeAgentStatus(status)).toEqual({ label, tone });
  });

  it("falls back to a neutral label for an unknown status instead of throwing", () => {
    expect(describeAgentStatus("something-new" as never)).toEqual({
      label: "Unknown",
      tone: "neutral",
    });
  });
});
