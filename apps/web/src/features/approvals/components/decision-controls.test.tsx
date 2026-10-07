import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import { DecisionControls } from "./decision-controls";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (state: ActionState) => vi.fn<Action>(async () => state);

describe("DecisionControls", () => {
  it("offers approve and reject with an optional, limited reason", () => {
    render(<DecisionControls action={make({ ok: true })} />);
    expect(screen.getByRole("button", { name: "Approve" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled();
    const reason = screen.getByLabelText(/Reason/);
    expect(reason).not.toBeRequired();
    expect(reason).toHaveAttribute("maxlength", "500");
  });

  it("submits approve with the typed reason", async () => {
    const action = make({ ok: true, message: "Approved." });
    render(<DecisionControls action={action} />);
    await userEvent.type(screen.getByLabelText(/Reason/), "Looks right");
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("decision")).toBe("approve");
    expect(form.get("reason")).toBe("Looks right");
    expect(await screen.findByRole("status")).toHaveTextContent("Approved.");
  });

  it("locks the buttons once a decision succeeded, so a second click cannot repeat it", async () => {
    render(<DecisionControls action={make({ ok: true, message: "Approved." })} />);
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    await screen.findByRole("status");
    expect(screen.getByRole("button", { name: "Approve" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reject" })).toBeDisabled();
  });

  it("keeps the buttons available after a refusal so the person can try again", async () => {
    render(<DecisionControls action={make({ ok: false, message: "nope" })} />);
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    await screen.findByRole("alert");
    expect(screen.getByRole("button", { name: "Approve" })).toBeEnabled();
  });

  it("submits reject when Reject is clicked", async () => {
    const action = make({ ok: true, message: "Rejected." });
    render(<DecisionControls action={action} />);
    await userEvent.click(screen.getByRole("button", { name: "Reject" }));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    expect(action.mock.calls[0]![1].get("decision")).toBe("reject");
  });

  it("announces a refusal as an alert", async () => {
    render(<DecisionControls action={make({ ok: false, message: "You can't decide this approval." })} />);
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("can't decide");
  });

  it("keeps the typed reason after a refusal", async () => {
    render(<DecisionControls action={make({ ok: false, message: "nope" })} />);
    await userEvent.type(screen.getByLabelText(/Reason/), "keep me");
    await userEvent.click(screen.getByRole("button", { name: "Reject" }));
    await screen.findByRole("alert");
    expect(screen.getByLabelText(/Reason/)).toHaveValue("keep me");
  });

  it("never lets the form carry ids or tenant fields", () => {
    render(<DecisionControls action={make({ ok: true })} />);
    expect(document.querySelector('[name="approvalId"]')).toBeNull();
    expect(document.querySelector('[name="organizationId"]')).toBeNull();
  });
});
