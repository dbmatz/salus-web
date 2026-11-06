import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { ApiError } from "@/api/client";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { loginSchema, type LoginFormInput } from "@/features/login/schemas/login.schema";
import { useLogin } from "@/features/login/hooks/use-login";

const INPUT_CLASS = "h-11 text-base md:text-base";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const { mutate, isPending } = useLogin();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        defaultValues: { email: "", password: "" },
    });

    function onSubmit(values: LoginFormInput) {
        mutate(values, {
            onSuccess,
            onError: (error) => {
                if (error instanceof ApiError && error.status === 401) {
                    setError("root", { message: "E-mail ou senha incorretos" });
                    return;
                }
                setError("root", { message: "Erro ao tentar fazer login. Tente novamente mais tarde." });
            },
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="gap-6">
                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="você@email.com"
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
                            autoComplete="current-password"
                            placeholder="Digite sua senha"
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

                <Button type="submit" size="lg" className="h-12 text-base" disabled={isPending}>
                    {isPending ? "Entrando..." : "Entrar"}
                </Button>
            </FieldGroup>
        </form>
    );
}
