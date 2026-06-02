import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  function getFill(container: HTMLElement) {
    return container.firstElementChild?.firstElementChild as HTMLElement;
  }

  it("renders with correct width style", () => {
    const { container } = render(<ProgressBar percent={50} />);
    const fill = getFill(container);
    expect(fill.style.width).toBe("50%");
  });

  it("clamps percent to 0 minimum", () => {
    const { container } = render(<ProgressBar percent={-10} />);
    const fill = getFill(container);
    expect(fill.style.width).toBe("0%");
  });

  it("clamps percent to 100 maximum", () => {
    const { container } = render(<ProgressBar percent={150} />);
    const fill = getFill(container);
    expect(fill.style.width).toBe("100%");
  });

  it("applies green color at 70%", () => {
    const { container } = render(<ProgressBar percent={70} />);
    const fill = getFill(container);
    expect(fill.style.backgroundColor).toBe("rgb(0, 200, 150)");
  });

  it("applies amber color at 80%", () => {
    const { container } = render(<ProgressBar percent={80} />);
    const fill = getFill(container);
    expect(fill.style.backgroundColor).toBe("rgb(245, 166, 35)");
  });

  it("applies coral color at 90%", () => {
    const { container } = render(<ProgressBar percent={90} />);
    const fill = getFill(container);
    expect(fill.style.backgroundColor).toBe("rgb(255, 91, 91)");
  });

  it("accepts className prop", () => {
    const { container } = render(<ProgressBar percent={50} className="mb-4" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("mb-4");
  });
});
