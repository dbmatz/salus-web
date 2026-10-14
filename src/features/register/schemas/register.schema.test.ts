import { describe, expect, it } from "vitest";
import { registerSchema } from "./register.schema";

const validInput = {
  name: "Maria Silva",
  birthDate: "1990-05-20",
  email: "maria@example.com",
  password: "Senha@123",
};

function messagesFor(input: Record<string, unknown>, field: string) {
  const result = registerSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues
    .filter((issue) => issue.path[0] === field)
    .map((issue) => issue.message);
}

describe("registerSchema", () => {
  it("should accept valid data and keep birthDate as a YYYY-MM-DD string", () => {
    const result = registerSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data?.birthDate).toBe("1990-05-20");
  });

  it("should reject a name shorter than 2 characters", () => {
    expect(messagesFor({ ...validInput, name: " A " }, "name")).toHaveLength(1);
  });

  it("should reject a malformed email", () => {
    expect(
      messagesFor({ ...validInput, email: "maria@" }, "email"),
    ).toHaveLength(1);
  });

  it("should reject a birth date in the future", () => {
    const future = new Date();
    future.setUTCFullYear(future.getUTCFullYear() + 1);
    const birthDate = future.toISOString().slice(0, 10);

    expect(messagesFor({ ...validInput, birthDate }, "birthDate")).toEqual([
      "A data de nascimento não pode estar no futuro",
    ]);
  });

  it.each(["", "20/05/1990", "1990-5-2", "2024-02-31"])(
    "should reject invalid birth date %j",
    (birthDate) => {
      expect(
        messagesFor({ ...validInput, birthDate }, "birthDate"),
      ).not.toHaveLength(0);
    },
  );

  it.each([
    ["Ab@1", "A senha precisa ter pelo menos 8 caracteres"],
    ["Senha @123", "A senha não pode ter espaços"],
    ["senha@123", "A senha precisa ter pelo menos uma letra maiúscula"],
    ["SENHA@123", "A senha precisa ter pelo menos uma letra minúscula"],
    ["Senha@abc", "A senha precisa ter pelo menos um número"],
    [
      "Senha1234",
      "A senha precisa ter pelo menos um caractere especial, como ! @ # $ % ou ?",
    ],
  ])("should reject password %j with its own message", (password, message) => {
    expect(messagesFor({ ...validInput, password }, "password")).toContain(
      message,
    );
  });
});
