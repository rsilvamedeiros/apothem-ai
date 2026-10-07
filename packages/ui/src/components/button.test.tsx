import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a button element and handles clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders an anchor when href is provided", () => {
    render(<Button href="/docs">Docs</Button>);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("uses the primary variant by default and supports secondary", () => {
    render(
      <>
        <Button>One</Button>
        <Button variant="secondary">Two</Button>
      </>,
    );
    expect(screen.getByText("One")).toHaveClass("primary");
    expect(screen.getByText("Two")).toHaveClass("secondary");
  });
});
