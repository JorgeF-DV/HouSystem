import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomSheet } from "../BottomSheet";

describe("BottomSheet", () => {
  it("renders title and children when open", () => {
    render(
      <BottomSheet open={true} onClose={() => {}} title="Mi panel">
        <p>Contenido</p>
      </BottomSheet>
    );
    expect(screen.getByText("Mi panel")).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("has dialog role when open", () => {
    render(
      <BottomSheet open={true} onClose={() => {}} title="Test">
        <p>Contenido</p>
      </BottomSheet>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("is hidden when closed via translate class", () => {
    const { container } = render(
      <BottomSheet open={false} onClose={() => {}} title="Mi panel">
        <p>Contenido</p>
      </BottomSheet>
    );
    const dialog = container.querySelector("[role='dialog']");
    expect(dialog?.className).toContain("translate-y-full");
  });
});
