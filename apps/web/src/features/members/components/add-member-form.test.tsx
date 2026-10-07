import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import { AddMemberForm } from "./add-member-form";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (result: ActionState) => vi.fn<Action>(async () => result);

describe("AddMemberForm", () => {
  it("renders a labelled email, a role select with every role and a submit button", () => {
    render(<AddMemberForm action={make({ ok: true })} />);
    expect(screen.getByLabelText("Email")).toBeRequired();
    const options = screen.getAllByRole("option").map((o) => o.textContent);
    expect(options).toEqual(["Owner", "Admin", "Builder", "Operator", "Auditor"]);
    expect(screen.getByRole("button", { name: "Add member" })).toBeEnabled();
  });

  it("defaults to the least privileged assignable role", () => {
    render(<AddMemberForm action={make({ ok: true })} />);
    expect(screen.getByLabelText("Role")).toHaveValue("auditor");
  });

  it("submits the email and the chosen role", async () => {
    const action = make({ ok: true, message: "Member added." });
    render(<AddMemberForm action={action} />);
    await userEvent.type(screen.getByLabelText("Email"), "new@example.com");
    await userEvent.selectOptions(screen.getByLabelText("Role"), "builder");
    await userEvent.click(screen.getByRole("button", { name: "Add member" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("email")).toBe("new@example.com");
    expect(form.get("role")).toBe("builder");
    expect(await screen.findByRole("status")).toHaveTextContent("Member added.");
  });

  it("clears the email after a successful add but keeps it after a failure", async () => {
    const ok = render(<AddMemberForm action={make({ ok: true, message: "Member added." })} />);
    await userEvent.type(screen.getByLabelText("Email"), "a@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Add member" }));
    await screen.findByRole("status");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    ok.unmount();

    render(<AddMemberForm action={make({ ok: false, message: "No active account found for that email." })} />);
    await userEvent.type(screen.getByLabelText("Email"), "b@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Add member" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No active account");
    expect(screen.getByLabelText("Email")).toHaveValue("b@example.com");
  });

  it("keeps the chosen role after a refused or successful submit, so the screen matches what is sent next", async () => {
    render(<AddMemberForm action={make({ ok: false, message: "Your role cannot add members with that role." })} />);
    await userEvent.selectOptions(screen.getByLabelText("Role"), "builder");
    await userEvent.type(screen.getByLabelText("Email"), "a@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Add member" }));
    await screen.findByRole("alert");
    expect(screen.getByLabelText("Role")).toHaveValue("builder");
  });
});
