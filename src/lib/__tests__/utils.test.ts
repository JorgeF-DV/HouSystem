import { describe, it, expect } from "vitest";
import { cn, formatCurrency, getProgressColor } from "../utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("returns empty string for all falsy", () => {
    expect(cn(false, undefined, null)).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats number as ARS currency", () => {
    const result = formatCurrency(150000);
    expect(result).toMatch(/\$|ARS/);
    expect(result).toContain("150");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toMatch(/0/);
  });
});

describe("getProgressColor", () => {
  it("returns green for percent <= 70", () => {
    expect(getProgressColor(0)).toBe("#00C896");
    expect(getProgressColor(50)).toBe("#00C896");
    expect(getProgressColor(70)).toBe("#00C896");
  });

  it("returns amber for percent 71-89", () => {
    expect(getProgressColor(71)).toBe("#F5A623");
    expect(getProgressColor(80)).toBe("#F5A623");
    expect(getProgressColor(89)).toBe("#F5A623");
  });

  it("returns coral for percent >= 90", () => {
    expect(getProgressColor(90)).toBe("#FF5B5B");
    expect(getProgressColor(100)).toBe("#FF5B5B");
  });
});
