import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusPill } from "../StatusPill";

describe("StatusPill", () => {
  it("renders children text", () => {
    render(<StatusPill variant="positive">Al día</StatusPill>);
    expect(screen.getByText("Al día")).toBeInTheDocument();
  });

  it("applies positive variant classes", () => {
    const { container } = render(<StatusPill variant="positive">OK</StatusPill>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("text-green");
  });

  it("applies alerta variant classes", () => {
    const { container } = render(<StatusPill variant="alerta">Atención</StatusPill>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("text-amber");
  });

  it("applies critico variant classes", () => {
    const { container } = render(<StatusPill variant="critico">Crítico</StatusPill>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("text-coral");
  });
});
