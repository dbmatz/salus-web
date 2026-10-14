---
name: salus-context
description: Contexto de produto do SALUS — objetivo, público, princípios e definição de design (identidade visual inspirada na flor de maracujá, tom de voz acolhedor, mobile-first, modo claro/escuro). Use esta skill sempre que for tomar qualquer decisão de design, layout, cor, tipografia, microcopy, mensagem de erro, estado vazio ou fluxo de tela no SALUS, e sempre que precisar entender para quem e para quê o produto existe. Consulte antes de criar ou alterar qualquer tela, componente visual ou texto exibido ao usuário.
---

# SALUS — Contexto de produto e definição de design

Esta skill responde **para quê o SALUS existe** e **como ele deve parecer e
soar**.

O que **não** está aqui:

| Assunto | Onde está |
|---|---|
| Como escrever código no frontend | skill `architecture-principles-frontend` |
| Como escrever código no backend | skill de arquitetura do `salus-api` |
| Stack, requisitos (RF/RNF), estado atual, pendências | `CLAUDE.md` de cada repositório |

**Precedência:** se esta skill e o `CLAUDE.md` divergirem, vale o `CLAUDE.md`,
e esta skill deve ser corrigida na mesma etapa. Se esta skill e a skill
genérica `frontend-design` divergirem, **vale esta skill**: paleta, fonte, tom
de voz e mobile-first do SALUS nunca são substituídos por escolhas da
`frontend-design`.

---

## 1. Objetivo

O SALUS é uma plataforma de registro diário de saúde emocional e acompanhamento
de hábitos. Existe para estabelecer um ambiente **seguro e acessível** no qual
as pessoas possam documentar suas emoções ao longo do tempo, possibilitando o
monitoramento e uma análise **holística** das variações emocionais. Busca ser
uma ferramenta de autocuidado e suporte emocional proativo.

Cada palavra da missão gera uma obrigação concreta:

| Palavra da missão | O que isso exige no produto |
|---|---|
| **Seguro** | Nenhum erro técnico, stack trace ou mensagem assustadora chega ao usuário. Privacidade percebida importa tanto quanto a técnica |
| **Acessível** | Boas práticas desde já: HTML semântico, labels, contraste razoável, teclado nos fluxos principais (RNF06). Certificação formal WCAG AA está adiada de forma consciente |
| **Ao longo do tempo** | O produto mostra o tempo passando (histórico navegável, calendário), não só um formulário diário |
| **Holística** | Visão de vários dias, emoções e parâmetros ao mesmo tempo (calendário, heatmap, gráficos), nunca um dia isolado |
| **Proativo** | Promessa de longo prazo (lembretes). Fora do MVP: lacuna registrada entre missão e entrega, não esquecimento |

---

## 2. Público e contexto de uso

- Pessoas que querem registrar como se sentem no dia a dia. O momento de uso é
  muitas vezes **íntimo, cansado ou emocionalmente delicado**: à noite, no
  celular, com uma mão.
- Idioma: português do Brasil. Internacionalização adiada.
- Plataforma principal: **celular**. Desktop é adaptação, não ponto de partida.
- Idade mínima de uso: **não definida** (pendência no `CLAUDE.md`). Não presumir.

**Consequência de design:** a tela pede pouco, rápido e sem julgamento. Um dia
ruim não pode virar uma experiência pior por causa da interface.

---

## 3. Princípios de design

1. **Acolher antes de cobrar.** Nada de culpa, urgência ou cobrança ("você
   esqueceu de registrar 3 dias"). A interface nunca pune ausência. (RNF02)
2. **Pouco atrito.** Registro diário em menos de 60 segundos no caminho feliz.
   Campos opcionais (descrição, medicamentos, parâmetros) nunca bloqueiam o
   essencial, que é a emoção do dia. (RNF01)
3. **Mobile-first de verdade.** Decidir primeiro o que cabe em ~360px. Classe
   Tailwind sem prefixo = celular; `md:`/`lg:` só acrescentam. Alvos de toque
   de no mínimo 44x44 px. Nada que dependa de hover. (RNF04, RNF05)
4. **Delicadeza, não clínica.** Não parecer hospital, formulário médico ou app
   de monitoramento frio. Evitar cinza puro, azul-hospital, ícones de cruz ou
   estetoscópio. (RNF03)
5. **Erro é conversa, não falha.** A mensagem explica o que fazer, com tom
   gentil. Texto vindo do backend nunca aparece cru.
6. **Honestidade sobre o que não existe.** Se algo não está pronto, não
   fingir. Estados vazios explicam com calma.

---

## 4. Identidade visual

### 4.1 Conceito

Paleta inspirada na **flor de maracujá (Passiflora)**. A flor, e não o fruto,
é a referência: entrega delicadeza e serenidade, e foge do clínico por um
caminho diferente do calor terroso.

### 4.2 Papéis de cor (tokens semânticos do shadcn)

Os valores `oklch()` vivem **apenas** em `src/index.css` (`:root` e `.dark`).
Esta tabela registra só a intenção de cada token:

| Parte da flor | Token | Papel |
|---|---|---|
| Pétalas brancas | `--background`, `--card`, `--popover` | Superfícies quase neutras, com um traço quase imperceptível de violeta |
| Coroa de filamentos violeta (H ≈ 300) | `--primary` | Cor de identidade e ação principal |
| Folhagem verde (H ≈ 150) | `--secondary` | Apoio; complementa o violeta sem competir |
| Centro amarelo-esverdeado (H ≈ 110) | `--accent` | Destaque pontual, hover e seleção |
| — | `--destructive` | **Continua vermelho.** Convenção universal de erro e perigo |
| — | `--muted`, `--muted-foreground` | Texto e áreas secundárias |
| — | `--chart-1` a `--chart-5` | Paleta categórica para gráficos e calendário: violeta, verde, amarelo-esverdeado, violeta-rosado, azul suave |

Regras de uso:

- Em componente, só classes semânticas (`bg-primary`, `text-muted-foreground`,
  `border-border`). **Nunca** `oklch()` ou hex.
- Não criar paleta paralela com nomes que colidam com os tokens do shadcn. Cor
  nova só se tiver um papel que nenhum token cobre, e ela deve ser registrada
  nesta tabela.
- Ao editar `:root`, editar `.dark` junto: **mesmo matiz (H)**, variando só a
  luminosidade. Nunca remover variáveis do bloco; componentes do shadcn
  dependem de todas, incluindo `sidebar-*` e `chart-*`.
- Cor nunca é a única forma de comunicar algo (erro, status): acompanhar de
  texto ou ícone.

### 4.3 Modo claro e escuro

Os dois modos fazem parte da identidade, não são extra. Muita gente registra o
dia à noite, e uma tela branca agressiva às 23h contradiz "acolhedor". Os dois
precisam parecer o mesmo produto: mesma família de matiz, luminosidade
invertida. A alternância é pela classe `dark` no `<html>`.

### 4.4 Tipografia

- Fonte: **Geist Variable** (`--font-sans`). Não trocar.
- Campos de formulário com no mínimo 16px de texto (evita zoom automático no iOS).
- Hierarquia por peso e tamanho, não por cor chamativa.

### 4.5 Forma e espaçamento

- Raio base `--radius: 0.625rem`, escala derivada no `@theme`. Cantos suaves.
- Formulário no celular: coluna única, `px-4`, `max-w-sm`, folga vertical
  generosa entre campos.
- A partir de `md`: telas de autenticação em duas colunas (painel de marca à
  esquerda, formulário à direita).

### 4.6 Componentes

- Primitivos do **shadcn/ui, estilo `base-nova`**, em
  `src/shared/components/ui/`. Reutilizar antes de criar.
- Ícones: `lucide-react`.

---

## 5. Tom de voz e microcopy (pt-BR)

- Segunda pessoa, verbos no presente, frases curtas, sem jargão técnico.
- Dizer **o que fazer**, não só o que deu errado.
- Nunca culpar a pessoa. Evitar "erro", "inválido" e "falhou" quando uma frase
  gentil resolve.
- Nunca usar urgência, contagem de dias perdidos ou comparação com outras
  pessoas.
- Termos sensíveis (depressão, crise, risco) só aparecem se houver um fluxo de
  cuidado real por trás. Não improvisar conteúdo clínico.

| Situação | Em vez de | Prefira |
|---|---|---|
| E-mail duplicado | "Erro: e-mail já existe" | "Este e-mail já está cadastrado" |
| Senha curta | "Senha inválida" | "A senha precisa ter pelo menos 8 caracteres" |
| Falha genérica | "Erro 500" | "Não foi possível concluir agora. Tente novamente em instantes" |
| Dia sem registro | "Você não registrou ontem" | (não comentar; só mostrar o dia vazio no calendário) |
| Estado vazio | "Nenhum dado encontrado" | "Você ainda não tem registros. Quando quiser, conte como foi seu dia" |

Esses textos são proposta de tom. O texto definitivo de cada tela fica
registrado na própria feature.

---

## 6. Estados que merecem cuidado extra

- **Erro:** explicar o que fazer e manter o formulário preenchido. Ninguém
  redigita um registro emocional por causa de uma falha de rede.
- **Carregando:** discreto, sem tela de bloqueio dramática.
- **Vazio:** convite, não cobrança.
- **Sessão expirada:** avisar com calma e preservar o que foi digitado quando
  possível.

---

## 7. Decisões de design ainda NÃO tomadas

Não presumir. Propor e marcar como pendente para a revisora decidir:

- Logo e marca além do `favicon.svg` atual
- Ilustrações ou imagens do painel de marca do cadastro
- Visual do calendário/heatmap e mapeamento emoção → cor
- Visual e posição do botão claro/escuro, e como a escolha é lembrada
- Conteúdo de apoio, recursos de crise ou encaminhamento (não existe e não deve
  ser improvisado)

Para explorar visualmente esses itens, a skill `frontend-design` pode ajudar
no processo, sempre dentro dos limites desta skill.

---

## 8. Checklist antes de entregar algo visual ou de texto

- [ ] Respeita os seis princípios da seção 3
- [ ] Só tokens semânticos, nenhum `oklch()`/hex em componente
- [ ] Conferido primeiro em ~360px, depois em larguras maiores
- [ ] Conferido no modo claro **e** no escuro
- [ ] Alvos de toque ≥ 44x44 px
- [ ] Texto relido como se fosse lido por alguém num dia difícil

Se uma decisão precisar desviar do que está aqui: sinalizar e propor a
atualização desta skill **antes** de implementar.
