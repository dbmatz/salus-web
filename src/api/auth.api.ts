import { apiClient } from "@/api/client";
import type { RegisterFormInput } from "@/features/register/schemas/register.schema";
import type { LoginFormInput } from "@/features/login/schemas/login.schema";

export type RegisterPayload = RegisterFormInput;
export type LoginPayload = LoginFormInput;

export function register(payload: RegisterPayload): Promise<void> {
  return apiClient.post<void>("/auth/register", payload);
}

export interface LoginResponse {
  token: string;
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/login", payload);
}
