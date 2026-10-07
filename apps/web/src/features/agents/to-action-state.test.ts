import { describe, expect, it } from "vitest";
import { changeStatusState, publishState, saveDraftState } from "./to-action-state";

describe("to-action-state", () => {
  it("maps save results", () => {
    expect(saveDraftState({ kind: "saved" })).toEqual({ ok: true, message: "Draft saved." });
    expect(saveDraftState({ kind: "error", message: "nope" })).toEqual({ ok: false, message: "nope" });
  });

  it("maps publish results with the version number", () => {
    expect(publishState({ kind: "published", versionNumber: 4 })).toEqual({ ok: true, message: "Published version 4." });
    expect(publishState({ kind: "error", message: "nope" })).toEqual({ ok: false, message: "nope" });
  });

  it("maps status change results per action", () => {
    expect(changeStatusState("disable", { kind: "done" })).toEqual({ ok: true, message: "Agent disabled." });
    expect(changeStatusState("archive", { kind: "done" })).toEqual({ ok: true, message: "Agent archived." });
    expect(changeStatusState("archive", { kind: "error", message: "nope" })).toEqual({ ok: false, message: "nope" });
  });
});
