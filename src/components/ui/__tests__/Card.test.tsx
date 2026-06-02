import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Contenido</Card>);
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    const { container } = render(<Card loading>Contenido</Card>);
    expect(screen.queryByText("Contenido")).not.toBeInTheDocument();
    const skeletons = container.querySelectorAll(".shimmer");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("applies hover class when hover prop is true", () => {
    const { container } = render(<Card hover>Contenido</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("cursor-pointer");
  });
});
