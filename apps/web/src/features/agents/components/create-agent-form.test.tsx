import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateAgentForm, type CreateAgentFormState } from "./create-agent-form";

const idle: CreateAgentFormState = {};

describe("CreateAgentForm", () => {
  it("renders labelled fields with limits and a submit button", () => {
    render(<CreateAgentForm action={vi.fn(async () => idle)} />);
    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Name")).toHaveAttribute("maxlength", "200");
    expect(screen.getByLabelText(/Slug/)).toHaveAttribute("maxlength", "63");
    expect(screen.getByLabelText(/Description/)).toHaveAttribute("maxlength", "2000");
    expect(screen.getByRole("button", { name: "Create agent" })).toBeEnabled();
  });

  it("never renders tenant id fields", () => {
    render(<CreateAgentForm action={vi.fn(async () => idle)} />);
    expect(document.querySelector('[name="organizationId"]')).toBeNull();
    expect(document.querySelector('[name="workspaceId"]')).toBeNull();
  });

  it("submits the typed values to the action", async () => {
    const action = vi.fn<(prev: CreateAgentFormState, form: FormData) => Promise<CreateAgentFormState>>(async () => idle);
    render(<CreateAgentForm action={action} />);
    await userEvent.type(screen.getByLabelText("Name"), "Support Bot");
    await userEvent.click(screen.getByRole("button", { name: "Create agent" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("name")).toBe("Support Bot");
  });

  it("shows field errors next to their inputs and marks them invalid", async () => {
    const action = vi.fn(async () => ({ errors: { slug: "This slug is already used in this workspace." } }));
    render(<CreateAgentForm action={action} />);
    await userEvent.type(screen.getByLabelText("Name"), "A");
    await userEvent.click(screen.getByRole("button", { name: "Create agent" }));

    const slug = await screen.findByLabelText(/Slug/);
    await waitFor(() => expect(slug).toHaveAttribute("aria-invalid", "true"));
    expect(screen.getByText("This slug is already used in this workspace.")).toBeInTheDocument();
    expect(slug).toHaveAccessibleDescription("This slug is already used in this workspace.");
  });

  it("announces a general error as an alert", async () => {
    const action = vi.fn(async () => ({ message: "You need to sign in again." }));
    render(<CreateAgentForm action={action} />);
    await userEvent.type(screen.getByLabelText("Name"), "A");
    await userEvent.click(screen.getByRole("button", { name: "Create agent" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("You need to sign in again.");
  });

  it("keeps what the user typed after an error", async () => {
    const action = vi.fn(async () => ({ message: "boom" }));
    render(<CreateAgentForm action={action} />);
    await userEvent.type(screen.getByLabelText("Name"), "Keep me");
    await userEvent.click(screen.getByRole("button", { name: "Create agent" }));
    await screen.findByRole("alert");
    expect(screen.getByLabelText("Name")).toHaveValue("Keep me");
  });
});
