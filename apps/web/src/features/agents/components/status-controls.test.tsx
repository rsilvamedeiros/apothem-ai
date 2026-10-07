import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusControls } from "./status-controls";
import type { ActionState } from "./action-state";

const makeAction = () =>
  vi.fn<(prev: ActionState, form: FormData) => Promise<ActionState>>(async () => ({ ok: true, message: "Done." }));

function setup(status: "draft" | "active" | "disabled" | "archived") {
  const actions = { publish: makeAction(), disable: makeAction(), archive: makeAction() };
  render(<StatusControls status={status} {...actions} />);
  return actions;
}

describe("StatusControls", () => {
  it("offers publish, disable and archive for an active agent", () => {
    setup("active");
    expect(screen.getByRole("button", { name: "Publish new version" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Disable" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Archive" })).toBeEnabled();
  });

  it("does not offer disable for an agent that is already disabled", () => {
    setup("disabled");
    expect(screen.queryByRole("button", { name: "Disable" })).toBeNull();
    expect(screen.getByRole("button", { name: "Publish new version" })).toBeEnabled();
  });

  it("offers nothing for an archived agent (terminal state)", () => {
    setup("archived");
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText(/archived/i)).toBeInTheDocument();
  });

  it("asks for confirmation before archiving", async () => {
    const actions = setup("active");
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(actions.archive).not.toHaveBeenCalled();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    expect(actions.archive).toHaveBeenCalledOnce();
  });

  it("can cancel the archive confirmation", async () => {
    const actions = setup("active");
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText(/cannot be undone/i)).toBeNull();
    expect(actions.archive).not.toHaveBeenCalled();
  });

  it("runs publish and announces the result", async () => {
    const actions = setup("draft");
    await userEvent.click(screen.getByRole("button", { name: "Publish new version" }));
    expect(actions.publish).toHaveBeenCalledOnce();
    expect(await screen.findByRole("status")).toHaveTextContent("Done.");
  });
});
