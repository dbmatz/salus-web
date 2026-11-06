import Login from "/login.svg";
import { Link, useNavigate } from "react-router";
import Logo from "/Logo.svg";
import { PrivacyNote } from "@/shared/components/privacy-note";
import { LoginForm } from "./login-form";



export function LoginPage() {
    const navigate = useNavigate();
    return (
        <div className="grid min-h-svh md:grid-cols-2">
            <aside className="hidden flex-col items-center justify-center gap-8 bg-secondary p-12 text-secondary-foreground md:flex">
                <img src={Login} alt="Login" />
            </aside>

            <div className="flex flex-col">
                <header className="mx-auto flex w-full max-w-lg h-16 items-center justify-between px-4">
                    <Link to="/" className="text-lg font-semibold tracking-tight text-primary">
                        <img src={Logo} alt="Salus" className="h-8 w-auto" />
                    </Link>
                </header>

                <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-8">
                    <section className="space-y-8">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold tracking-tight text-accent">
                                ENTRAR
                            </p>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Faça login para continuar
                            </h1>
                        </div>
                        <LoginForm onSuccess={() => navigate("/dashboard")} />
                        <PrivacyNote className="mt-6">
                            Seus registros são privados. Você decide o que compartilhar.
                        </PrivacyNote>
                        <div className="flex justify-center text-center gap-1 mt-6">
                            <p className="text-sm">Não possui conta?</p>
                            <p className="text-md font-semibold">
                                <Link to="/register" className="text-primary underline">
                                    Criar conta
                                </Link>
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}