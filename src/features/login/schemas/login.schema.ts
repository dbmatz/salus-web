import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Confira o e-mail digitado"),
  password: z.string().min(1, "Digite sua senha para entrar"),
});

export type LoginFormInput = z.infer<typeof loginSchema>;
