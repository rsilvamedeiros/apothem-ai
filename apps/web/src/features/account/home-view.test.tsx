import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import { HomeView } from "./home-view";
import type { LoadAccountResult } from "./load-account";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (result: ActionState = { ok: true }) => vi.fn<Action>(async () => result);

const ok = (organizations: { id: string; name: string; slug: string; role: never }[] = []): LoadAccountResult => ({
  kind: "ok",
  principal: { id: "p1", email: "alice@example.com", name: "Alice" },
  organizations,
});

describe("HomeView", () => {
  it("greets the signed-in account", () => {
    render(<HomeView result={ok()} createOrganization={make()} />);
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("lists organizations as links with the member role", () => {
    render(
      <HomeView
        result={ok([{ id: "11111111-1111-4111-8111-111111111111", name: "Acme", slug: "acme", role: "admin" as never }])}
        createOrganization={make()}
      />,
    );
    const link = screen.getByRole("link", { name: /Acme/ });
    expect(link).toHaveAttribute("href", "/org/11111111-1111-4111-8111-111111111111");
    expect(screen.getByText(/acme · Admin/)).toBeInTheDocument();
  });

  it("invites a brand new account to create its first organization", () => {
    render(<HomeView result={ok()} createOrganization={make()} />);
    expect(screen.getByText(/don.t belong to any organization/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create organization" })).toBeEnabled();
  });

  it("submits the organization name and surfaces the API refusal", async () => {
    const action = make({ ok: false, message: "That name is already taken. Try a different name or slug." });
    render(<HomeView result={ok()} createOrganization={action} />);
    await userEvent.type(screen.getByLabelText("Organization name"), "Acme");
    await userEvent.click(screen.getByRole("button", { name: "Create organization" }));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    expect(action.mock.calls[0]![1].get("name")).toBe("Acme");
    expect(await screen.findByRole("alert")).toHaveTextContent("already taken");
  });

  it("renders organization text as text, never markup", () => {
    render(
      <HomeView
        result={ok([{ id: "11111111-1111-4111-8111-111111111111", name: "<img src=x onerror=alert(1)>", slug: "x", role: "owner" as never }])}
        createOrganization={make()}
      />,
    );
    expect(document.querySelector("img")).toBeNull();
  });

  it.each([
    [{ kind: "error", message: "Your account could not be loaded. Try again shortly." } as const, "could not be loaded"],
    [{ kind: "unreachable" } as const, "unreachable"],
  ])("announces failures (%j) and hides the create form", (result, text) => {
    render(<HomeView result={result} createOrganization={make()} />);
    expect(within(screen.getByRole("alert")).getByText(new RegExp(text))).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create organization" })).toBeNull();
  });
});
