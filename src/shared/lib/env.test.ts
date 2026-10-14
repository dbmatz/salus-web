import { afterEach, describe, expect, it, vi } from "vitest";
import { getApiUrl } from "./env";

describe("getApiUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return VITE_API_URL without a trailing slash", () => {
    vi.stubEnv("VITE_API_URL", "https://api.salus.example/");

    expect(getApiUrl()).toBe("https://api.salus.example");
  });

  it("should throw a clear error when VITE_API_URL has no protocol", () => {
    vi.stubEnv("VITE_API_URL", "localhost:3000");

    expect(() => getApiUrl()).toThrow(/VITE_API_URL/);
  });

  it("should throw when VITE_API_URL is missing", () => {
    vi.stubEnv("VITE_API_URL", undefined);

    expect(() => getApiUrl()).toThrow(/VITE_API_URL/);
  });
});
