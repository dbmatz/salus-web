import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/api/client";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useRegister } from "../hooks/use-register";
import { GENERIC_ERROR_MESSAGE, mapRegisterError } from "../register-errors";
import { registerSchema, type RegisterFormInput } from "../schemas/register.schema";

const INPUT_CLASS = "h-11 text-base md:text-base";

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { name: "", birthDate: "", email: "", password: "" },
  });

  function onSubmit(values: RegisterFormInput) {
    mutate(values, {
      onSuccess,
      onError: (error) => {
        if (error instanceof ApiError) {
          for (const { field, message } of mapRegisterError(error)) {
            setError(field, { message });
          }
          return;
        }
        setError("root", { message: GENERIC_ERROR_MESSAGE });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-6">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Como podemos te chamar?</FieldLabel>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            className={INPUT_CLASS}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.birthDate}>
          <FieldLabel htmlFor="birthDate">Data de nascimento</FieldLabel>
          <Input
            id="birthDate"
            type="date"
            autoComplete="bday"
            className={INPUT_CLASS}
            aria-invalid={!!errors.birthDate}
            {...register("birthDate")}
          />
          <FieldError errors={[errors.birthDate]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={INPUT_CLASS}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`${INPUT_CLASS} pr-12`}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 size-11"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <FieldError errors={[errors.password]} />
        </Field>

        <FieldError errors={[errors.root]} />

        <Button type="submit" size="lg" className="h-11 text-base" disabled={isPending}>
          {isPending ? "Criando sua conta..." : "Criar minha conta"}
        </Button>
      </FieldGroup>
    </form>
  );
}
