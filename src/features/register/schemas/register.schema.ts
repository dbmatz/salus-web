import { z } from "zod";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  // Rejeita datas que o JS "corrige" sozinho, como 2024-02-31.
  return date.toISOString().startsWith(value) ? date : null;
}

// As regras de senha espelham, na mesma ordem, o Password do salus-api.
// Se o backend mudar, mude aqui junto.
const passwordSchema = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres")
  .refine((value) => !/\s/.test(value), "A senha não pode ter espaços")
  .refine(
    (value) => /[A-Z]/.test(value),
    "A senha precisa ter pelo menos uma letra maiúscula",
  )
  .refine(
    (value) => /[a-z]/.test(value),
    "A senha precisa ter pelo menos uma letra minúscula",
  )
  .refine(
    (value) => /[0-9]/.test(value),
    "A senha precisa ter pelo menos um número",
  )
  .refine(
    (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
    'A senha precisa ter pelo menos um caractere especial, como ! @ # $ % ou ?',
  );

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Conte-nos como podemos te chamar"),
  // A data viaja como "YYYY-MM-DD"; o Date abaixo existe só para comparar.
  birthDate: z
    .string()
    .min(1, "Informe sua data de nascimento")
    .refine(
      (value) => parseIsoDate(value) !== null,
      "Confira a data de nascimento",
    )
    .refine((value) => {
      const date = parseIsoDate(value);
      return date === null || date <= new Date();
    }, "A data de nascimento não pode estar no futuro"),
  email: z.email("Confira o e-mail digitado"),
  password: passwordSchema,
});

export type RegisterFormInput = z.infer<typeof registerSchema>;
