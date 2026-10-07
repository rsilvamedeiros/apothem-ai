import { describe, expect, it } from "vitest";
import { describeApprovalStatus, describeRunError, describeRunStatus, formatDuration, formatToolName } from "./run-view";

describe("describeRunStatus", () => {
  it.each([
    ["queued", "Queued", "neutral"],
    ["running", "Running", "info"],
    ["waiting_approval", "Waiting for approval", "warning"],
    ["completed", "Completed", "success"],
    ["failed", "Failed", "danger"],
    ["cancelled", "Cancelled", "warning"],
  ] as const)("maps %s to %s (%s)", (status, label, tone) => {
    expect(describeRunStatus(status)).toEqual({ label, tone });
  });

  it("falls back safely for an unknown status", () => {
    expect(describeRunStatus("weird" as never)).toEqual({ label: "Unknown", tone: "neutral" });
    expect(describeRunStatus("toString" as never)).toEqual({ label: "Unknown", tone: "neutral" });
  });
});

describe("describeRunError", () => {
  it.each([
    "RUN_CONFIG_INVALID",
    "MODEL_POLICY_NO_ROUTE",
    "MODEL_PROVIDER_UNAVAILABLE",
    "MODEL_REQUEST_REJECTED",
    "RUN_BUDGET_EXCEEDED",
    "TOOL_NOT_BOUND",
    "TOOL_ARGUMENT_INVALID",
    "TOOL_LIMIT_EXCEEDED",
    "TOOL_EXECUTION_FAILED",
    "APPROVAL_REJECTED",
    "APPROVAL_EXPIRED",
    "APPROVAL_INVALIDATED",
    "RUN_INTERNAL_ERROR",
  ])("gives actionable guidance for %s", (code) => {
    const guidance = describeRunError(code);
    expect(guidance.title.length).toBeGreaterThan(0);
    expect(guidance.hint.length).toBeGreaterThan(10);
  });

  it("falls back to a generic message for unknown or missing codes without echoing them", () => {
    expect(describeRunError("SOMETHING_NEW<script>").title).toBe("The run failed");
    expect(JSON.stringify(describeRunError("SOMETHING_NEW<script>"))).not.toContain("script");
    expect(describeRunError(null).title).toBe("The run failed");
  });
});

describe("formatDuration", () => {
  it.each([
    [null, "—"],
    [0, "0 ms"],
    [250, "250 ms"],
    [1500, "1.5 s"],
    [60_000, "60 s"],
  ])("formats %s as %s", (ms, text) => {
    expect(formatDuration(ms)).toBe(text);
  });
});

describe("describeApprovalStatus", () => {
  it.each([
    ["pending", "Pending", "warning"],
    ["approved", "Approved", "success"],
    ["rejected", "Rejected", "danger"],
    ["expired", "Expired", "neutral"],
  ] as const)("maps %s", (status, label, tone) => {
    expect(describeApprovalStatus(status)).toEqual({ label, tone });
  });

  it("falls back safely", () => {
    expect(describeApprovalStatus("weird" as never)).toEqual({ label: "Unknown", tone: "neutral" });
  });
});

describe("formatToolName", () => {
  it("turns a catalog name into a readable label", () => {
    expect(formatToolName("create_note")).toBe("Create note");
    expect(formatToolName("get_current_time")).toBe("Get current time");
  });

  it("is safe for odd input", () => {
    expect(formatToolName("")).toBe("");
    expect(formatToolName("__proto__")).toBe("Proto");
  });
});
