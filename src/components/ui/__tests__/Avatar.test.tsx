import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "../Avatar";

describe("Avatar", () => {
  it("renders Jorge with correct initial", () => {
    render(<Avatar user="jorge" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders Lorena with correct initial", () => {
    render(<Avatar user="lorena" />);
    expect(screen.getByText("L")).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<Avatar user="jorge" size={48} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
  });
});
