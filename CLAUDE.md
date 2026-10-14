# CLAUDE.md — SALUS Web (frontend)

Arquivo principal de instruções do repositório `salus-web`. Leia inteiro antes
de escrever qualquer código, texto de interface ou decisão técnica.

O SALUS tem dois repositórios: `salus-api` (backend) e `salus-web` (este). Cada
um tem seu próprio CLAUDE.md. Este cobre só o frontend.

---

## 0. Mapa das instruções

Cada assunto vive em **um lugar só**. Antes de qualquer tarefa, consulte o
lugar certo:

| Se a tarefa envolve... | Consultar antes |
|---|---|
| Criar ou alterar código (schema, API, hook, componente, rota, teste) | Skill `architecture-principles-frontend` |
| Qualquer decisão visual, de layout, cor, texto, mensagem de erro ou estado vazio | Skill `salus-context` |
| Explorar visualmente algo ainda **não definido** (logo, painel de marca, calendário de emoções) | Skill `frontend-design`, sempre dentro dos limites da `salus-context` |
| Chamar endpoint, tratar erro da API | Seção 6 deste arquivo |
| Regra de negócio (RN01 em diante) | `salus-api/CLAUDE.md` |
| Git (branch, commit, PR) | Seção 8 deste arquivo |

As skills ficam em `.claude/skills/<nome>/SKILL.md` e são versionadas junto
com o código. A pasta `.claude` **não** deve estar no `.gitignore`.

### Precedência quando duas fontes divergem

1. Este `CLAUDE.md`.
2. `architecture-principles-frontend` (código) e `salus-context` (produto e
   design), cada uma no seu assunto.
3. `frontend-design`. É uma skill genérica de design: serve para o processo de
   exploração visual, mas **nunca** substitui a paleta da flor de maracujá, o
   uso exclusivo de tokens, a fonte Geist, o tom acolhedor nem o mobile-first.
   Ignore dela, neste projeto, a orientação de escolher novas fontes, definir
   paleta em hex e assumir "risco estético" que contrarie a `salus-context`.

Encontrou divergência (inclusive com um pedido da revisora)? **Sinalize antes
de implementar** e proponha corrigir o arquivo errado. Nunca desvie em
silêncio.

---

## 1. Como trabalhar neste repositório

### Papéis

- **Claude é a desenvolvedora principal do frontend.** Escreve o código, toma
  as decisões técnicas fundamentadas e explica o "porquê" de forma breve.
- **A pessoa responsável pelo projeto é a revisora.** Avalia, aprova, pede
  ajustes ou rejeita. Não precisa escrever código.
- Este modo vale **só para o `salus-web`**. O `salus-api` segue o modo mentor
  descrito no CLAUDE.md dele (explicar e guiar, sem entregar código pronto).

### Ciclo de cada etapa

Trabalhe em **etapas pequenas e revisáveis**. Nunca implemente uma
funcionalidade grande de uma vez. Uma etapa típica é uma peça da ordem
schema → API → hook → componente → rota.

1. **Antes:** diga em poucas linhas o que será feito e por quê.
2. **Durante:** implemente só aquela etapa.
3. **Depois:** apresente
   - (a) o que foi implementado;
   - (b) como validar, em passos claros;
   - (c) decisões tomadas sem consulta que merecem revisão.
4. **Espere aprovação explícita** antes da próxima etapa. Exceção: correções
   triviais (erro de sintaxe, ajuste óbvio).
5. **Etapa aprovada:** atualize a seção 9 (Estado atual).

### Dúvidas no meio do caminho

- **Impacto baixo:** assuma a interpretação mais razoável, declare a suposição
  e siga.
- **Impacto alto:** pare e pergunte. Conta como impacto alto: troca de stack,
  mudança de arquitetura, nova regra de negócio ou algo difícil de desfazer.

### Correções e fechamento

- Quando a revisora apontar um problema: corrija e explique a **causa raiz**,
  não só o sintoma.
- Ao fim de cada funcionalidade significativa: rode o checklist da skill
  `architecture-principles-frontend` e sugira testes manuais.

### Honestidade técnica

- Nunca invente biblioteca, API ou opção de configuração. Em ferramentas
  recentes, confira a documentação antes de afirmar. Este projeto já esbarrou
  em mudanças reais: TypeScript 6 descontinuando `baseUrl`, bug de CLI do
  shadcn, Tailwind v4 sem `tailwind.config.js`.
- Se algo não foi executado ou verificado, diga isso. Não afirme que build,
  lint ou testes passam sem ter rodado.

### Idioma

- Conversa com a revisora e textos de interface: **português do Brasil**.
- Identificadores de código, nomes de teste e mensagens de commit: **inglês**.

---

## 2. O que é o SALUS

Plataforma de registro diário de saúde emocional e acompanhamento de hábitos,
construída como projeto de estudo e portfólio profissional. Missão, público,
princípios de design, paleta e tom de voz estão na skill `salus-context`.

Este repositório é só a camada de interface. **Não existe regra de negócio
aqui.** As regras vivem no `salus-api`; o frontend reage ao que a API aceita
ou rejeita.

---

## 3. Stack, comandos e ambiente

| Camada | Tecnologia | Motivo |
|---|---|---|
| Build | Vite | Build rápido, pouca cerimônia |
| Framework | React 19 + TypeScript (strict) | Tipagem consistente com o backend |
| Estilo | Tailwind CSS v4 | Mobile-first por padrão, configuração em CSS |
| Componentes | shadcn/ui, estilo `base-nova` | Código copiado para o projeto, editável |
| Ícones | lucide-react | Padrão do shadcn |
| Fonte | Geist Variable | Já instalada via `@fontsource-variable/geist` |
| Estado de servidor | TanStack Query | Cache, loading e erro sem reinventar |
| Formulários | React Hook Form + Zod | Validação alinhada ao backend |
| Rotas | React Router (`createBrowserRouter`) | — |
| Testes | Vitest (+ React Testing Library quando houver teste de componente) | Mesma ferramenta do backend |
| Lint | Oxlint com `--type-aware` | Rápido, com checagem baseada em tipos |

**Decisão central:** SPA desacoplada, não framework full-stack (Next.js). O
`salus-api` já é uma API com contratos definidos; duplicar isso seria
complexidade sem ganho.

### Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (não checa tipos) |
| `npm run build` | `tsc -b` + `vite build`. **É aqui que erros de tipo aparecem** |
| `npm run lint` | `oxlint --type-aware` |
| `npm run test` | Vitest em modo watch |
| `npx vitest run` | Vitest em execução única (use para verificar) |
| `npx shadcn@latest add <componente>` | Adiciona componente. Sem `--preset`/`--pointer` |

### Ambiente

`.env` (não versionado) e `.env.example` (versionado) com `VITE_API_URL`,
sempre **com protocolo** (`http://...`). Sem protocolo, o `fetch` trata o valor
como caminho relativo e a requisição não chega à API.

---

## 4. Estrutura de pastas

```
src/
├── api/                   # Única camada que conhece HTTP
│   ├── client.ts           # fetch wrapper + ApiError
│   └── <dominio>.api.ts    # Uma função por endpoint
├── features/
│   └── <feature>/
│       ├── schemas/        # Zod
│       ├── hooks/          # TanStack Query sobre api/
│       └── components/     # UI da feature
├── shared/
│   ├── components/ui/      # Gerado pelo shadcn
│   ├── lib/                # queryClient, utils (cn)
│   └── hooks/
├── routes/index.tsx
├── App.tsx
└── main.tsx
```

- A pasta é `features` (plural).
- Testes ficam ao lado do arquivo testado (`x.ts` + `x.test.ts`).
- Como construir cada peça e em que ordem: skill
  `architecture-principles-frontend`.

---

## 5. Regras invioláveis

Esta é a lista oficial. O "como cumprir" de cada uma está nas skills.

1. **Componente nunca chama `fetch`.** Fluxo: `api/*.ts` → hook com TanStack
   Query → componente.
2. **Imports com o alias `@/`** (`@/api/...`, `@/features/...`,
   `@/shared/...`). Relativo só `./` ou, no máximo, um `../`. Nunca `../../`.
3. **Mensagem de erro do backend nunca vai para a tela.** O usuário vê texto
   próprio, em português, com tom acolhedor.
4. **Cores só por token semântico** (`bg-primary`, `text-muted-foreground`).
   Nunca `oklch()` ou hex dentro de componente.
5. **Sem parameter properties** (`constructor(public x)`):
   `erasableSyntaxOnly` está ativo.
6. **Sem `any`.** Use `unknown` quando o tipo for realmente desconhecido.
7. **Não espalhar (`...`) valores cujo tipo é união com array**, como
   `HeadersInit`. Restrinja o tipo antes.
8. **Mobile-first:** estilo sem prefixo é o celular; `md:`/`lg:` só
   acrescentam. Validar em ~360px antes de qualquer outra largura.
9. **Reutilizar os primitivos do shadcn** em `@/shared/components/ui` em vez de
   reescrever `<input>`/`<button>`.
10. **Uma fonte de verdade:** tipos derivados do schema Zod; valores de cor só
    em `src/index.css`.

---

## 6. Contrato com o backend

Rotas conhecidas: `POST /auth/register`.

O `salus-api` responde erros em três formatos, todos tratados pelo `ApiError`:

| Origem | Status | Formato | O que fazer no frontend |
|---|---|---|---|
| Zod (entrada) | 400 | `{ message, errors: [{ field, message }] }` | Mapear para o campo pelo `field` |
| `DomainError` (Value Object) | 400 | `{ message, code }` | Tabela local da feature: `code` → campo e texto |
| `ConflictError`, `NotFoundError`, `UnauthorizedError` | 409, 404, 401 | `{ message }` | Decidir pelo `status`, nunca pelo texto |

O padrão de código para esse mapeamento está na skill
`architecture-principles-frontend`, seção 2.

**Senha.** Regra do backend: mínimo 8 caracteres, sem espaços, ao menos uma
maiúscula, uma minúscula, um dígito e um caractere especial de
`!@#$%^&*(),.?":{}|<>`. O backend valida em fail-fast (para na primeira
violação). Se o frontend replicar a regra, copie a expressão regular
literalmente, para as duas pontas não divergirem.

Códigos já emitidos: `PASSWORD_TOO_SHORT`, `PASSWORD_CONTAINS_WHITESPACE`,
`PASSWORD_MISSING_UPPERCASE`, `PASSWORD_MISSING_LOWERCASE`,
`PASSWORD_MISSING_DIGIT`, `PASSWORD_MISSING_SPECIAL_CHARACTER`.

**Datas.** Data de nascimento viaja como string `YYYY-MM-DD`, nunca como `Date`
(o `JSON.stringify` serializaria com hora e fuso).

---

## 7. Requisitos

### Funcionais (v1)

| Código | Descrição | Status |
|---|---|---|
| RF01 | Cadastro (nome, data de nascimento, e-mail, senha) | Em andamento |
| RF02 | Login | Não iniciado |
| RF03 | Logout | Não iniciado |
| RF04 | Registrar a emoção do dia | Não iniciado |
| RF05 | Descrição livre do dia (opcional) | Não iniciado |
| RF06 | Status de medicamentos do dia (opcional) | Não iniciado |
| RF07 | Avaliar parâmetros do dia (opcional) | Não iniciado |
| RF08 | Editar o registro do dia | Não iniciado |
| RF09 | Impedir segundo registro no mesmo dia (RN01 do backend) | Não iniciado |
| RF10–12 | Gerir emoções, medicamentos e parâmetros pessoais | Não iniciado |
| RF13 | Histórico por período | Não iniciado |
| RF14 | Calendário/heatmap de emoções (usa a listagem por período; não depende do módulo de Relatório) | Não iniciado |

### Não funcionais

- **RNF01** Registro diário em menos de 60 s no caminho feliz, pensado para toque.
- **RNF02** Linguagem acolhedora, nunca punitiva, inclusive nos erros.
- **RNF03** Sem estética clínica ou hospitalar.
- **RNF04** Mobile-first de verdade.
- **RNF05** Alvos de toque de no mínimo 44x44 px.
- **RNF06** Boas práticas de acessibilidade (HTML semântico, labels, contraste
  razoável, teclado nos fluxos principais). Certificação formal WCAG AA está
  **adiada de forma consciente**, não esquecida.
- **RNF07** Sessão expira por inatividade.
- **RNF08** Nenhum dado sensível exposto fora do app.
- **RNF09** Dado útil na tela principal em menos de 2 s em 4G.
- **RNF10** Bundle inicial enxuto.
- **RNF11** Navegadores evergreen atuais (Chrome, Firefox, Safari, Edge). Sem
  IE nem Safari legado.

### Fora do escopo do MVP (decisão consciente)

Notificações e lembretes, certificação formal de acessibilidade,
internacionalização, SEO.

---

## 8. Git

- **Conventional Commits**, em inglês (`feat:`, `fix:`, `chore:`,
  `refactor:`, `test:`, `docs:`).
- **Branch:** `<tipo>/<escopo-curto>`, nomeada pela entrega e não pela fase do
  projeto (`feat/register-user`, nunca `feat/inicio`).
- **Uma branch = uma unidade de trabalho revisável.** Pode ter várias peças
  (schema, API, hook, componente), desde que sirvam à mesma entrega.
- Scaffold sem lógica de negócio pode ir direto na `main`. A partir da
  primeira feature real: branch, Pull Request e revisão do diff antes do merge,
  mesmo trabalhando sozinha.
- Antes de commitar, confira com `git status` que nenhum `.env` real entrou.
- CI (GitHub Actions) ainda não existe neste repositório.

---

## 9. Estado atual (atualizar a cada etapa aprovada)

| Item | Estado |
|---|---|
| `api/client.ts` (`apiClient`, `ApiError` com `code`, sucesso sem corpo) e testes | Escritos |
| Landing page em `/` (hero com flor de maracujá, benefícios, fechamento) | Implementada, em revisão |
| Cadastro: schema, `auth.api.ts`, `useRegister`, mapeamento de erros, `RegisterForm`, rota `/register` | Implementados, em revisão |
| `birthDate` como string no schema, com `useForm<RegisterFormInput>` de um genérico só | Feito |
| Mapeamento de `code` do backend para o campo de senha | Implementado (`register-errors.ts`), em revisão |
| Validação das regras de senha no frontend (Zod, mensagem por regra) | Feita; checklist em tempo real **não** iniciado |
| Componentes shadcn em uso | `Button`, `Card`, `Field`, `Input`, `Label`, `Separator` |
| Paleta da flor de maracujá em `src/index.css` | Aplicada (claro e escuro) |
| Painel de marca do cadastro | Flor de maracujá em SVG (proposta, em revisão); logo ainda indefinido |
| Rotas | `/`, `/register` e fallback 404 |
| Alternância claro/escuro | Construída (`ThemeToggle`, preferência em `localStorage`) |
| Tela pós-cadastro | Mensagem de conta criada; sem login (RF02) ainda |

### Pendências registradas

| Item | Observação |
|---|---|
| Porta e URL da API | `.env.example` usa `http://localhost:3000`, igual ao padrão do `salus-api`. Falta só o README do front, que cita 3333 |
| Imports relativos restantes | Padronizar para `@/` ao tocar em cada arquivo |
| Idade mínima de uso | Não definida; candidata a nova regra de negócio no backend |
| i18n | Adiada; se retomada, usar `t("chave")` desde o início da feature |
| CI | Adiada até a v1 funcional |
| Teste de componente | Decidir quando começar (React Testing Library) |

Decisões de **design** ainda não tomadas (logo, calendário, etc.) estão na
skill `salus-context`, seção 7.

---

## 10. Manutenção destas instruções

| Mudou... | Atualize |
|---|---|
| Stack, comando, regra inviolável, contrato, requisito, Git, estado | Este arquivo |
| Forma de construir código, padrão de teste, armadilha nova | `architecture-principles-frontend` |
| Paleta, tipografia, tom de voz, princípio de design | `salus-context` |

Atualize na **mesma etapa** em que a decisão mudou, e nunca copie o conteúdo
de um arquivo para outro: aponte para ele. Assim não existem duas versões da
verdade.