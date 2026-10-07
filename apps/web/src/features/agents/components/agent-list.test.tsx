import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgentList, type AgentListItem } from "./agent-list";

const agents: AgentListItem[] = [
  { id: "a1", name: "Support", slug: "support", description: "Answers tickets", status: "active", activeVersionId: "v1" },
  { id: "a2", name: "Research", slug: "research", description: null, status: "draft", activeVersionId: null },
];

describe("AgentList", () => {
  it("renders one row per agent with name, slug and status", () => {
    render(<AgentList agents={agents} />);
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]!).getByText("Support")).toBeInTheDocument();
    expect(within(rows[0]!).getByText("support")).toBeInTheDocument();
    expect(within(rows[0]!).getByText("Active")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("Draft")).toBeInTheDocument();
  });

  it("shows the description only when present", () => {
    render(<AgentList agents={agents} />);
    expect(screen.getByText("Answers tickets")).toBeInTheDocument();
    expect(screen.getAllByText(/Answers tickets/)).toHaveLength(1);
  });

  it("tells whether an agent has a published version", () => {
    render(<AgentList agents={agents} />);
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Not published")).toBeInTheDocument();
  });

  it("renders text content as text, never as markup", () => {
    render(
      <AgentList
        agents={[{ ...agents[1]!, name: "<img src=x onerror=alert(1)>", description: "<b>bold</b>" }]}
      />,
    );
    expect(document.querySelector("img")).toBeNull();
    expect(document.querySelector("b")).toBeNull();
    expect(screen.getByText("<img src=x onerror=alert(1)>")).toBeInTheDocument();
  });

  it("renders an empty state when there are no agents", () => {
    render(<AgentList agents={[]} />);
    expect(screen.getByText("No agents yet in this workspace.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });
});
