import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DraftEditor } from "./draft-editor";
import type { ActionState } from "./action-state";

const ok: ActionState = { ok: true, message: "Draft saved." };

describe("DraftEditor", () => {
  it("shows the current instructions", () => {
    render(<DraftEditor action={vi.fn(async () => ok)} initialInstructions="Be kind." disabled={false} />);
    expect(screen.getByLabelText("Instructions")).toHaveValue("Be kind.");
  });

  it("submits the edited instructions and announces success", async () => {
    const action = vi.fn<(prev: ActionState, form: FormData) => Promise<ActionState>>(async () => ok);
    render(<DraftEditor action={action} initialInstructions="" disabled={false} />);
    await userEvent.type(screen.getByLabelText("Instructions"), "Answer in Portuguese.");
    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    expect(action.mock.calls[0]![1].get("instructions")).toBe("Answer in Portuguese.");
    expect(await screen.findByRole("status")).toHaveTextContent("Draft saved.");
  });

  it("announces an error as an alert and keeps the text", async () => {
    render(
      <DraftEditor
        action={vi.fn(async () => ({ ok: false, message: "You don't have permission to edit this agent." }))}
        initialInstructions=""
        disabled={false}
      />,
    );
    await userEvent.type(screen.getByLabelText("Instructions"), "Keep");
    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("permission");
    expect(screen.getByLabelText("Instructions")).toHaveValue("Keep");
  });

  it("is read-only when editing is disabled", () => {
    render(<DraftEditor action={vi.fn(async () => ok)} initialInstructions="x" disabled />);
    expect(screen.getByLabelText("Instructions")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
  });

  it("limits the length to the API maximum", () => {
    render(<DraftEditor action={vi.fn(async () => ok)} initialInstructions="" disabled={false} />);
    expect(screen.getByLabelText("Instructions")).toHaveAttribute("maxlength", "50000");
  });
});
