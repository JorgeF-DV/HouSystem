import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlertBanner } from "../AlertBanner";

describe("AlertBanner", () => {
  it("renders children", () => {
    render(<AlertBanner>Mensaje de alerta</AlertBanner>);
    expect(screen.getByText("Mensaje de alerta")).toBeInTheDocument();
  });

  it("renders action button when actionLabel and onAction provided", () => {
    const onAction = vi.fn();
    render(
      <AlertBanner actionLabel="Ver más" onAction={onAction}>
        Alerta
      </AlertBanner>
    );
    const btn = screen.getByText("Ver más");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onAction).toHaveBeenCalled();
  });

  it("does not render action button when no actionLabel", () => {
    render(<AlertBanner>Alerta</AlertBanner>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
