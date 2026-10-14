import { describe, expect, it } from "vitest";
import { GENERIC_ERROR_MESSAGE, mapRegisterError } from "./register-errors";

describe("mapRegisterError", () => {
  it("should map 409 to the email field by status, not by text (RN01)", () => {
    expect(mapRegisterError({ status: 409 })).toEqual([
      { field: "email", message: "Este e-mail já está cadastrado" },
    ]);
  });

  it("should map backend validation errors to fields with our own text", () => {
    const result = mapRegisterError({
      status: 400,
      validationErrors: [{ field: "birthDate" }, { field: "email" }],
    });

    expect(result).toEqual([
      { field: "birthDate", message: "Confira a data de nascimento" },
      { field: "email", message: "Confira o e-mail digitado" },
    ]);
  });

  it("should map a password DomainError code to the password field", () => {
    expect(
      mapRegisterError({ status: 400, code: "PASSWORD_MISSING_DIGIT" }),
    ).toEqual([
      {
        field: "password",
        message: "A senha precisa ter pelo menos um número",
      },
    ]);
  });

  it.each([
    { status: 500 },
    { status: 400, code: "SOMETHING_NEW" },
    { status: 400, validationErrors: [{ field: "unknown" }] },
  ])("should fall back to the generic message for %j", (error) => {
    expect(mapRegisterError(error)).toEqual([
      { field: "root", message: GENERIC_ERROR_MESSAGE },
    ]);
  });
});
