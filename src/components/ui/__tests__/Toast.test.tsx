import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Toast } from "../Toast";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("renders message when visible", () => {
    render(<Toast message="Guardado" visible={true} onHide={() => {}} />);
    expect(screen.getByText("Guardado")).toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<Toast message="Guardado" visible={true} onHide={() => {}} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("calls onHide after duration", () => {
    const onHide = vi.fn();
    render(<Toast message="Guardado" visible={true} onHide={onHide} duration={2000} />);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it("does not call onHide before duration", () => {
    const onHide = vi.fn();
    render(<Toast message="Guardado" visible={true} onHide={onHide} duration={2000} />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onHide).not.toHaveBeenCalled();
  });
});
