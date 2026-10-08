import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import { AddDocumentForm } from "./add-document-form";
import { ArchiveBaseControls } from "./archive-base-controls";
import { CreateBaseForm } from "./create-base-form";
import { RemoveDocumentButton } from "./remove-document-button";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (state: ActionState) => vi.fn<Action>(async () => state);

describe("CreateBaseForm", () => {
  it("limits the fields and submits what was typed", async () => {
    const action = make({ ok: false });
    render(<CreateBaseForm action={action} />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("maxlength", "100");
    expect(screen.getByLabelText(/Description/)).toHaveAttribute("maxlength", "500");

    await userEvent.type(screen.getByLabelText("Name"), "Handbook");
    await userEvent.type(screen.getByLabelText(/Description/), "Policies");
    await userEvent.click(screen.getByRole("button", { name: "Create knowledge base" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("name")).toBe("Handbook");
    expect(form.get("description")).toBe("Policies");
  });

  it("announces a refusal and keeps what was typed", async () => {
    render(<CreateBaseForm action={make({ ok: false, message: "A knowledge base with this name already exists." })} />);
    await userEvent.type(screen.getByLabelText("Name"), "Handbook");
    await userEvent.click(screen.getByRole("button", { name: "Create knowledge base" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("already exists");
    expect(screen.getByLabelText("Name")).toHaveValue("Handbook");
  });

  it("never carries tenant fields", () => {
    render(<CreateBaseForm action={make({})} />);
    expect(document.querySelector('[name="workspaceId"]')).toBeNull();
    expect(document.querySelector('[name="organizationId"]')).toBeNull();
  });
});

describe("AddDocumentForm", () => {
  it("limits the fields, counts characters and submits the text", async () => {
    const action = make({ ok: true, message: "Document added." });
    render(<AddDocumentForm action={action} disabled={false} />);
    expect(screen.getByLabelText("Title")).toHaveAttribute("maxlength", "200");
    expect(screen.getByLabelText(/^Text/)).toHaveAttribute("maxlength", "100000");
    expect(screen.getByText(/^0 \/ 100,000 characters/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Title"), "Refund policy");
    await userEvent.type(screen.getByLabelText(/^Text/), "Five days.");
    expect(screen.getByText(/^10 \/ 100,000 characters/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Add document" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("title")).toBe("Refund policy");
    expect(form.get("content")).toBe("Five days.");
  });

  it("empties the form after the document was added", async () => {
    render(<AddDocumentForm action={make({ ok: true, message: "Document added." })} disabled={false} />);
    await userEvent.type(screen.getByLabelText("Title"), "Refund policy");
    await userEvent.type(screen.getByLabelText(/^Text/), "Five days.");
    await userEvent.click(screen.getByRole("button", { name: "Add document" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Document added.");
    await waitFor(() => expect(screen.getByLabelText("Title")).toHaveValue(""));
    expect(screen.getByLabelText(/^Text/)).toHaveValue("");
  });

  it("keeps the pasted text when the document was refused", async () => {
    render(<AddDocumentForm action={make({ ok: false, message: "The document was rejected." })} disabled={false} />);
    await userEvent.type(screen.getByLabelText("Title"), "Refund policy");
    await userEvent.type(screen.getByLabelText(/^Text/), "Five days.");
    await userEvent.click(screen.getByRole("button", { name: "Add document" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("rejected");
    expect(screen.getByLabelText("Title")).toHaveValue("Refund policy");
    expect(screen.getByLabelText(/^Text/)).toHaveValue("Five days.");
  });

  it("offers no form for an archived base", () => {
    render(<AddDocumentForm action={make({})} disabled />);
    expect(screen.queryByRole("button", { name: "Add document" })).toBeNull();
    expect(screen.getByText(/archived/)).toBeInTheDocument();
  });
});

describe("RemoveDocumentButton", () => {
  it("asks twice before removing and names the document", async () => {
    const action = make({ ok: true, message: "Document removed." });
    render(<RemoveDocumentButton action={action} title="Refund policy" />);
    await userEvent.click(screen.getByRole("button", { name: "Remove Refund policy" }));
    expect(screen.getByText(/Remove “Refund policy”\?/)).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Confirm remove" }));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    expect(await screen.findByRole("status")).toHaveTextContent("Document removed.");
  });

  it("lets the person back out", async () => {
    const action = make({ ok: true });
    render(<RemoveDocumentButton action={action} title="Refund policy" />);
    await userEvent.click(screen.getByRole("button", { name: "Remove Refund policy" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: "Remove Refund policy" })).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("announces a refusal", async () => {
    render(<RemoveDocumentButton action={make({ ok: false, message: "You don't have permission." })} title="Doc" />);
    await userEvent.click(screen.getByRole("button", { name: "Remove Doc" }));
    await userEvent.click(screen.getByRole("button", { name: "Confirm remove" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("permission");
  });
});

describe("ArchiveBaseControls", () => {
  it("explains the effect and asks for confirmation", async () => {
    const action = make({ ok: true, message: "Archived." });
    render(<ArchiveBaseControls action={action} archived={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(screen.getByText(/stops every agent from retrieving/)).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    expect(await screen.findByRole("status")).toHaveTextContent("Archived.");
  });

  it("lets the person cancel", async () => {
    render(<ArchiveBaseControls action={make({})} archived={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });

  it("shows only a note once archived", () => {
    render(<ArchiveBaseControls action={make({})} archived />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText(/Agents no longer retrieve from it/)).toBeInTheDocument();
  });

  it("announces a refusal", async () => {
    render(<ArchiveBaseControls action={make({ ok: false, message: "Already archived." })} archived={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    await userEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Already archived.");
  });
});
