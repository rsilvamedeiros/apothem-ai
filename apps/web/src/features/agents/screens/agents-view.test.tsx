import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgentsView } from "./agents-view";

const agent = {
  id: "a1",
  name: "Support",
  slug: "support",
  description: null,
  status: "active" as const,
  activeVersionId: "v1",
};

describe("AgentsView", () => {
  it("lists agents on success", () => {
    render(<AgentsView result={{ kind: "ok", agents: [agent] }} allowDemo={false} basePath="/b" />);
    expect(screen.getByText("Support")).toBeInTheDocument();
  });

  it("shows the empty state when there are no agents", () => {
    render(<AgentsView result={{ kind: "ok", agents: [] }} allowDemo={false} basePath="/b" />);
    expect(screen.getByText("No agents yet in this workspace.")).toBeInTheDocument();
  });

  it("shows an accessible error message for a failed load", () => {
    render(<AgentsView result={{ kind: "error", message: "You need to sign in again." }} allowDemo={false} basePath="/b" />);
    expect(screen.getByRole("alert")).toHaveTextContent("You need to sign in again.");
  });

  it("explains that the API is unreachable instead of faking data in production", () => {
    render(<AgentsView result={{ kind: "unreachable" }} allowDemo={false} basePath="/b" />);
    expect(screen.getByRole("alert")).toHaveTextContent("apothem-api is unreachable");
    expect(screen.queryByText("Demo data")).toBeNull();
  });

  it("only offers demo mode in development when the API is unreachable", () => {
    render(<AgentsView result={{ kind: "unreachable" }} allowDemo basePath="/b" />);
    expect(screen.getByText(/Demo data/)).toBeInTheDocument();
  });

  it("links to the create flow", () => {
    render(<AgentsView result={{ kind: "ok", agents: [] }} allowDemo={false} basePath="/org/o/workspace/w/agents" />);
    expect(screen.getByRole("link", { name: "New agent" })).toHaveAttribute("href", "/org/o/workspace/w/agents/new");
  });

  it("still shows the use-case templates", () => {
    render(<AgentsView result={{ kind: "ok", agents: [] }} allowDemo={false} basePath="/b" />);
    expect(screen.getByText("Start from a use case")).toBeInTheDocument();
  });
});
