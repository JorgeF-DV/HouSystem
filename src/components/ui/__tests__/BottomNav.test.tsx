import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomNav } from "../BottomNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/finanzas",
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) =>
    <a {...props}>{children}</a>,
}));

describe("BottomNav", () => {
  it("renders all nav items", () => {
    render(<BottomNav />);
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Finanzas")).toBeInTheDocument();
    expect(screen.getByText("Tareas")).toBeInTheDocument();
    expect(screen.getByText("Metas")).toBeInTheDocument();
    expect(screen.getByText("Planes")).toBeInTheDocument();
  });

  it("marks active link with aria-current", () => {
    render(<BottomNav />);
    expect(screen.getByText("Finanzas").closest("a")).toHaveAttribute("aria-current", "page");
  });

  it("does not mark inactive links with aria-current", () => {
    render(<BottomNav />);
    expect(screen.getByText("Inicio").closest("a")).not.toHaveAttribute("aria-current");
  });
});
