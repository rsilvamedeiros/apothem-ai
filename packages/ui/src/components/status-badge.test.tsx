import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders its content", () => {
    render(<StatusBadge>Published</StatusBadge>);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("applies the neutral tone by default", () => {
    render(<StatusBadge>Draft</StatusBadge>);
    expect(screen.getByText("Draft")).toHaveClass("neutral");
  });

  it("applies the requested tone and keeps a custom class", () => {
    render(
      <StatusBadge tone="danger" className="extra">
        Disabled
      </StatusBadge>,
    );
    const badge = screen.getByText("Disabled");
    expect(badge).toHaveClass("danger", "extra");
  });
});
