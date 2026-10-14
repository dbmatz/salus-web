import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { register } from "./auth.api";

describe("auth.api", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "http://localhost:3000");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("should POST name, birthDate, email and password to /auth/register", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.reject(new SyntaxError("empty body")),
    });
    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      name: "Maria Silva",
      birthDate: "1990-05-20",
      email: "maria@example.com",
      password: "Senha@123",
    };

    await expect(register(payload)).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:3000/auth/register");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual(payload);
  });
});
