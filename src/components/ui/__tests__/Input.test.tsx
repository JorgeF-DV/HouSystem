import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../Input";

describe("Input", () => {
  it("renders label and input", () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<Input label="Email" id="email" placeholder="correo@ejemplo.com" />);
    expect(screen.getByPlaceholderText("correo@ejemplo.com")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input label="Email" id="email" error="Campo obligatorio" />);
    expect(screen.getByText("Campo obligatorio")).toBeInTheDocument();
  });

  it("applies error border when error is set", () => {
    const { container } = render(<Input label="Email" id="email" error="Error" />);
    const input = container.querySelector("input");
    expect(input?.className).toContain("border-coral");
  });

  it("does not show error when no error prop", () => {
    render(<Input label="Email" id="email" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
