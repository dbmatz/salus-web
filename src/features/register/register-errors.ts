import type { RegisterFormInput } from "./schemas/register.schema";

type Field = keyof RegisterFormInput;

interface MappedError {
  field: Field | "root";
  message: string;
}

export const GENERIC_ERROR_MESSAGE =
  "Não foi possível concluir agora. Tente novamente em instantes";

// code do backend (DomainError) -> campo e texto próprio.
const ERRORS_BY_CODE: Record<string, MappedError> = {
  PASSWORD_TOO_SHORT: {
    field: "password",
    message: "A senha precisa ter pelo menos 8 caracteres",
  },
  PASSWORD_CONTAINS_WHITESPACE: {
    field: "password",
    message: "A senha não pode ter espaços",
  },
  PASSWORD_MISSING_UPPERCASE: {
    field: "password",
    message: "A senha precisa ter pelo menos uma letra maiúscula",
  },
  PASSWORD_MISSING_LOWERCASE: {
    field: "password",
    message: "A senha precisa ter pelo menos uma letra minúscula",
  },
  PASSWORD_MISSING_DIGIT: {
    field: "password",
    message: "A senha precisa ter pelo menos um número",
  },
  PASSWORD_MISSING_SPECIAL_CHARACTER: {
    field: "password",
    message:
      "A senha precisa ter pelo menos um caractere especial, como ! @ # $ % ou ?",
  },
};

// Texto próprio por campo para erros de validação do backend (Zod).
const MESSAGE_BY_FIELD: Record<Field, string> = {
  name: "Conte-nos como podemos te chamar",
  birthDate: "Confira a data de nascimento",
  email: "Confira o e-mail digitado",
  password: "Confira a senha digitada",
};

function isField(value: string): value is Field {
  return value in MESSAGE_BY_FIELD;
}

interface ApiErrorLike {
  status: number;
  code?: string;
  validationErrors?: { field: string }[];
}

// Devolve os erros a mostrar na tela. Nunca repassa o `message` do backend.
export function mapRegisterError(error: ApiErrorLike): MappedError[] {
  if (error.status === 409) {
    return [{ field: "email", message: "Este e-mail já está cadastrado" }];
  }

  if (error.validationErrors) {
    const mapped = error.validationErrors
      .filter(({ field }) => isField(field))
      .map(({ field }) => ({
        field: field as Field,
        message: MESSAGE_BY_FIELD[field as Field],
      }));
    if (mapped.length > 0) return mapped;
  }

  const byCode = error.code ? ERRORS_BY_CODE[error.code] : undefined;
  if (byCode) return [byCode];

  return [{ field: "root", message: GENERIC_ERROR_MESSAGE }];
}
