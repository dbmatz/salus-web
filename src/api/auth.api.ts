import { apiClient } from "@/api/client";
import type { RegisterFormInput } from "@/features/register/schemas/register.schema";

export type RegisterPayload = RegisterFormInput;

export function register(payload: RegisterPayload): Promise<void> {
  return apiClient.post<void>("/auth/register", payload);
}
