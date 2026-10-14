---
name: architecture-principles-frontend
description: Como construir código no frontend do SALUS (salus-web) — ordem de criação de uma feature (schema Zod → função de API → hook TanStack Query → componente → rota), mapeamento de erro do backend para a UI, adição de componentes shadcn/ui, testes com Vitest, armadilhas de TypeScript já encontradas e checklist de pronto. Use sempre antes de criar, revisar ou alterar qualquer arquivo em src/ do salus-web, ao decidir em qual pasta algo deve morar ou antes de rodar comandos do shadcn/ui.
---

# Architecture Principles — SALUS Frontend (salus-web)

Esta skill responde **como construir**. Ela não repete o que já está no
`CLAUDE.md` do repositório (sempre carregado):

| Assunto | Onde está |
|---|---|
| Stack, comandos, estrutura de pastas | `CLAUDE.md`, seções 3 e 4 |
| Regras invioláveis (lista oficial) | `CLAUDE.md`, seção 5 |
| Formatos de erro do backend e códigos conhecidos | `CLAUDE.md`, seção 6 |
| Git (branch, commit, PR) | `CLAUDE.md`, seção 8 |
| Cor, texto, tom de voz, estados de tela | skill `salus-context` |

Aqui fica o passo a passo, os padrões de código e o porquê de cada regra.

---

## 1. Ordem de criação de uma feature

Construa **de baixo para cima**, na ordem de dependência. Cada peça só existe
para servir a próxima, e cada uma é validada antes da seguinte. Não pule
etapas. Cada passo abaixo costuma ser uma etapa de revisão (ver fluxo no
`CLAUDE.md`, seção 1).

```
schema (Zod) → função de API → hook (TanStack Query) → componente → rota
```

**Por que esse fluxo:** o componente nunca conhece rede (regra inviolável 1).
Assim ele fica livre de lógica de HTTP e o hook fica fácil de mockar em teste.

### 1.1 Schema (Zod) — `features/<nome>/schemas/<nome>.schema.ts`

Valida o formato bruto que vem do formulário.

**Regra de tipo — mantenha entrada e saída iguais sempre que possível:**

- **Caso comum (o campo não muda de tipo):** use `z.infer<typeof schema>` e
  **um único genérico** em `useForm<Schema>`.
- **O campo "precisaria" virar outro tipo** (`Date`, `number`): **evite
  `.transform()` e `z.coerce`**. Mantenha o tipo bruto (`string`) em toda a
  cadeia e faça a checagem dentro de um `.refine()`, criando um valor
  temporário só para comparar. Exemplo: `birthDate` continua
  `"YYYY-MM-DD"`, e o `.refine()` cria um `Date` apenas para verificar se não
  é data futura. Vantagens: o payload já sai no formato do backend, e você não
  precisa dos três genéricos do `useForm`.
- **Só quando a transformação for inevitável:** use
  `useForm<Input, Context, Output>`, com 1º genérico = `z.input<typeof schema>`
  e 3º = `z.output<typeof schema>`. Nunca anote à mão o parâmetro do
  `onSubmit`; deixe o TypeScript inferir pelo 3º genérico.

O tipo do payload (o que vai para o backend) é **derivado do schema** com
`Omit<>`/`Pick<>`, nunca redeclarado à mão (regra inviolável 10).

**Validar:** `schema.safeParse()` isolado, com casos válidos e inválidos,
antes de existir qualquer UI.

### 1.2 Função de API — `api/<dominio>.api.ts`

Uma função por endpoint, sempre via `apiClient` (nunca `fetch` direto):

```typescript
export function acaoRecurso(payload: Payload): Promise<Resposta> {
  return apiClient.post<Resposta>("/rota", payload);
}
```

- Tipo do parâmetro = tipo derivado do schema (passo 1.1).
- Tipo de retorno = formato da resposta de sucesso do backend.

**Validar:** teste com `fetch` mockado (`vi.stubGlobal`) confirmando que o
`body` enviado é exatamente o que o backend espera.

### 1.3 Hook — `features/<nome>/hooks/use<Acao>.ts`

Liga `useMutation`/`useQuery` à função de API. **Deliberadamente fino:** sem
regra de negócio e sem tratamento de erro específico. Quem decide o que
mostrar na tela é o componente.

```typescript
export function useAcao() {
  return useMutation({ mutationFn: acaoRecurso });
}
```

### 1.4 Componente — `features/<nome>/components/<Nome>.tsx`

Construa nesta ordem:

1. **Layout e campos**, sem lógica de submit. Valide visualmente em ~360px
   antes de seguir (mobile-first).
2. **Submit:** conecte o `handleSubmit` do React Hook Form.
3. **Erros da API:** mapeie para os campos certos (seção 2 abaixo).

Use os primitivos de `@/shared/components/ui/*`. Todo texto visível segue a
skill `salus-context`.

### 1.5 Rota — `routes/index.tsx`

Adicione a entrada no `createBrowserRouter`. Ao passar de uma rota, confira se
já existe fallback para `/` e para 404 (hoje é pendência, ver `CLAUDE.md`,
seção 9).

---

## 2. Mapeamento de erro do backend para a UI

Os três formatos de erro estão no `CLAUDE.md`, seção 6. Padrão de
implementação no componente (cada ramo termina com `return`; só o que não foi
reconhecido cai na mensagem genérica):

```typescript
// Tabela local da feature: code do backend → campo e texto próprio (pt-BR)
const ERROS_POR_CODE: Record<string, { field: keyof FormInput; message: string }> = {
  PASSWORD_TOO_SHORT: { field: "password", message: "A senha precisa ter pelo menos 8 caracteres" },
  // ...
};

onError: (error) => {
  if (error instanceof ApiError) {
    // 1. Conflito / não encontrado / não autorizado: decidir pelo status, nunca pelo texto
    if (error.status === 409) {
      setError("email", { message: "Este e-mail já está cadastrado" });
      return;
    }
    // 2. Erros de validação (Zod do backend): mapear pelo field, com texto próprio
    if (error.validationErrors) {
      error.validationErrors.forEach(({ field }) => {
        setError(field, { message: /* texto próprio para o campo, nunca o message cru */ });
      });
      return;
    }
    // 3. DomainError: mapear o code pela tabela local
    const mapeado = error.code ? ERROS_POR_CODE[error.code] : undefined;
    if (mapeado) {
      setError(mapeado.field, { message: mapeado.message });
      return;
    }
  }
  // 4. Qualquer outro caso
  setError("root", { message: "Não foi possível concluir agora. Tente novamente em instantes" });
};
```

- Cada feature mantém **sua própria tabela** `code → campo`. O backend nunca
  conhece nomes de campos de tela.
- O formulário continua preenchido depois do erro.

---

## 3. shadcn/ui — adicionar um componente

1. Rode `npx shadcn@latest add <componente>`, **sem** `--preset`/`--pointer`
   (essas flags, vindas do configurador do site, causaram bug de workspace).
2. Confira que o arquivo nasceu em `src/shared/components/ui/`, e não numa
   pasta `@` na raiz do projeto.
3. O componente é código copiado e editável, não dependência de pacote. Ajuste
   à vontade.

**Se o componente nascer no lugar errado:** o alias `@/*` precisa existir nos
**dois** tsconfig, sem `baseUrl` (o TypeScript 6 descontinuou `baseUrl`):

- `tsconfig.app.json` → `"paths": { "@/*": ["./src/*"] }`
- `tsconfig.json` (raiz) → o mesmo bloco. O CLI do shadcn só lê o arquivo
  raiz e não segue `references`.

---

## 4. Testes

- **Colocalizados:** `arquivo.ts` e `arquivo.test.ts` na mesma pasta
  (diferente do backend, que usa uma árvore `tests/` espelhada).
- **Código que usa `fetch`:** mock com `vi.stubGlobal("fetch", ...)`. Nunca
  bater na API real.
- **Variável de ambiente lida dentro de função:** `vi.stubEnv(...)` no
  `beforeEach`. Não depender de qual `.env` foi carregado.
- **Nome do teste = a regra que ele protege**, não a implementação. Ex.:
  `"should throw ApiError with status and message on conflict (RN01)"`.
- Teste de componente (React Testing Library) ainda não foi adotado; ver
  pendências no `CLAUDE.md`.

---

## 5. Armadilhas de TypeScript já encontradas

Como cumprir as regras invioláveis 5 e 7 do `CLAUDE.md`, e outras armadilhas:

- **`erasableSyntaxOnly` ativo:** em vez de
  `constructor(public campo: string)`, declare `campo: string;` na classe e
  atribua `this.campo = campo` no corpo do construtor.
- **`no-misused-spread` (Oxlint type-aware):** não espalhe um valor cujo tipo
  é união com array, como `HeadersInit`. Restrinja antes, ex.:
  `Omit<RequestInit, "headers"> & { headers?: Record<string, string> }`.
- **`z.coerce`/`.transform()` tornam o tipo de entrada `unknown`:** evite
  quando o formato de entrada já é conhecido (seção 1.1).
- **Erro de tipo só aparece no build:** `npm run dev` não roda `tsc`. Sempre
  rode `npm run build` antes de dizer que está pronto.

---

## 6. Checklist antes de considerar uma feature pronta

- [ ] Schema validado isoladamente, sem UI
- [ ] Função de API testada com `fetch` mockado
- [ ] Hook fino, sem regra de negócio nem tratamento de erro
- [ ] Componente conferido em ~360px antes de larguras maiores
- [ ] Nenhuma mensagem do backend exibida crua; textos em pt-BR, tom acolhedor
- [ ] Imports com `@/...`
- [ ] `npm run lint` limpo
- [ ] `npx vitest run` passando
- [ ] `npm run build` limpo (não só `npm run dev`)
- [ ] Seção "Estado atual" do `CLAUDE.md` atualizada
