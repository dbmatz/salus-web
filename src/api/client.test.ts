import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./client";

function mockFetchResponse(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return parsed JSON on success", async () => {
    vi.stubGlobal("fetch", mockFetchResponse(200, { id: "1", name: "Feliz" }));

    const result = await apiClient.get<{ id: string; name: string }>(
      "/emotions/1",
    );

    expect(result).toEqual({ id: "1", name: "Feliz" });
  });

  it("should attach Authorization header when token is provided", async () => {
    const fetchMock = mockFetchResponse(200, {});
    vi.stubGlobal("fetch", fetchMock);

    await apiClient.get("/emotions", { token: "abc123" });

    const [, config] = fetchMock.mock.calls[0];
    expect(config.headers.Authorization).toBe("Bearer abc123");
  });

  it("should throw ApiError with status and message on conflict (RN01)", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchResponse(409, {
        message: "DailyRecord already exists for this date.",
      }),
    );

    await expect(apiClient.post("/daily-records", {})).rejects.toMatchObject({
      status: 409,
      message: "DailyRecord already exists for this date.",
    });
  });

  it("should include validationErrors when the backend returns a Zod validation error", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchResponse(400, {
        message: "Validation failed.",
        errors: [{ field: "date", message: "Required" }],
      }),
    );

    await expect(apiClient.post("/daily-records", {})).rejects.toMatchObject({
      status: 400,
      validationErrors: [{ field: "date", message: "Required" }],
    });
  });

  it("should return undefined on 204 No Content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 204 }),
    );

    const result = await apiClient.delete("/emotions/1");

    expect(result).toBeUndefined();
  });
});
