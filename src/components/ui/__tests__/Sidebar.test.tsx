import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) =>
    <a {...props}>{children}</a>,
}));

describe("Sidebar", () => {
  it("renders all nav items", () => {
    render(<Sidebar />);
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Finanzas")).toBeInTheDocument();
    expect(screen.getByText("Tareas")).toBeInTheDocument();
    expect(screen.getByText("Metas")).toBeInTheDocument();
    expect(screen.getByText("Planes")).toBeInTheDocument();
  });

  it("marks active link with aria-current", () => {
    render(<Sidebar />);
    expect(screen.getByText("Inicio").closest("a")).toHaveAttribute("aria-current", "page");
  });

  it("renders both avatars", () => {
    const { container } = render(<Sidebar />);
    const avatars = container.querySelectorAll("[role='img']");
    expect(avatars.length).toBe(2);
  });

  it("renders settings link", () => {
    render(<Sidebar />);
    expect(screen.getByText("Ajustes")).toBeInTheDocument();
  });
});
