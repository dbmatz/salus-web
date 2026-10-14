import { getApiUrl } from "@/shared/lib/env";

interface ValidationIssue {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly validationErrors?: ValidationIssue[];
  readonly code?: string;

  constructor(
    status: number,
    message: string,
    validationErrors?: ValidationIssue[],
    code?: string,
  ) {
    super(message);
    this.status = status;
    this.validationErrors = validationErrors;
    this.code = code;
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "headers"> {
  token?: string;
  headers?: Record<string, string>;
}

interface ErrorResponseBody {
  message?: string;
  errors?: ValidationIssue[];
  code?: string;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const baseURL = getApiUrl();
  const { token, headers, ...rest } = options;

  const response = await fetch(`${baseURL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const body: ErrorResponseBody | null = await response
      .json()
      .catch(() => null);
    throw new ApiError(
      response.status,
      body?.message ?? "Erro inesperado ao comunicar com a API",
      body?.errors,
      body?.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  // Sucesso sem corpo (ex.: 201 do cadastro) não é erro: devolve undefined.
  return response.json().catch(() => undefined) as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
