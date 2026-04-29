# 🎨 Arali Flow — Branding & Design System

> Documento inicial de identidade visual. **Versão preliminar** sujeita a refinamento após validação com a Arali Móveis e com designer (futuro). Este documento serve como **base operacional** para começar o desenvolvimento sem ficar travado esperando design.

---

## 📑 Índice

1. [Identidade da Marca](#1-identidade-da-marca)
2. [Tom e Voz](#2-tom-e-voz)
3. [Paleta de Cores](#3-paleta-de-cores)
4. [Tipografia](#4-tipografia)
5. [Iconografia](#5-iconografia)
6. [Espaçamento e Grid](#6-espaçamento-e-grid)
7. [Border Radius e Sombras](#7-border-radius-e-sombras)
8. [Gradientes](#8-gradientes)
9. [Componentes](#9-componentes)
10. [Tokens (Tailwind + CSS Variables)](#10-tokens-tailwind--css-variables)
11. [Modo Claro vs Escuro](#11-modo-claro-vs-escuro)
12. [Acessibilidade](#12-acessibilidade)
13. [Logo e Aplicações](#13-logo-e-aplicações)
14. [Anti-Padrões](#14-anti-padrões)

---

## 1. Identidade da Marca

### Posicionamento
**Arali Flow** é o sistema operacional digital de uma marcenaria de altíssimo padrão. A interface deve transmitir as mesmas qualidades dos móveis Arali:

- **Sofisticação sem ostentação**
- **Precisão de marcenaria fina**
- **Materiais nobres** (madeira, metal, couro — traduzidos visualmente)
- **Atenção a cada detalhe**
- **Funcionalidade silenciosa** — a UI não compete com o conteúdo

### Conceito Visual Núcleo
> **Luxo Discreto** — interfaces escuras, neutros profundos, ouro velho como detalhe, madeira como textura emocional, sem brilho excessivo, sem flashes, sem "neon tech".

### Inspirações
- **Linear** (precisão e clareza)
- **Cron / Notion Calendar** (densidade elegante)
- **Aston Martin / Bentley sites** (luxo automotivo discreto)
- **Hermès digital** (sofisticação editorial)
- **Figma dark mode** (legibilidade prolongada)
- **Stripe Dashboard** (rigor financeiro com elegância)

### O que **NÃO** queremos
- ❌ Aparência "tech bro startup"
- ❌ Gradientes neon, roxo cyber
- ❌ Glassmorphism exagerado
- ❌ Animações chamativas
- ❌ Cores saturadas e infantis
- ❌ Stock photos genéricas
- ❌ Emojis decorativos espalhados pela UI (uso pontual em contexto)

---

## 2. Tom e Voz

### Atributos da Comunicação
- **Direto** — sem rodeios
- **Preciso** — vocabulário correto da marcenaria
- **Confiante** — sem ser arrogante
- **Calmo** — não usa urgência fabricada
- **Premium** — sem ser pomposo

### Estilo de Microcopy

| Situação | ❌ Genérico / Ruim | ✅ Arali Flow |
|---|---|---|
| Botão primário | "Salvar" | "Salvar alterações" |
| Confirmação | "Item salvo!" | "Recebimento registrado." |
| Erro | "Algo deu errado" | "Não foi possível salvar. Tente novamente em alguns segundos." |
| Loading | "Carregando..." | "Carregando projetos..." |
| Estado vazio | "Sem dados" | "Nenhum projeto atribuído ao seu Time ainda." |
| Confirmação destrutiva | "Você tem certeza?" | "Excluir este projeto removerá também as Tasks vinculadas. Confirma?" |

### Termos Padronizados (Glossário Resumido)

| Termo | Como usar | Como NÃO usar |
|---|---|---|
| **Pasta do Projeto** | "Abra a Pasta do Projeto" | "Workspace do Projeto" |
| **Integrante** | "Integrantes do Time" | "Usuário", "Membro", "Colaborador" no contexto de um Time |
| **Time** | "Time Comercial" | "Equipe", "Squad" |
| **Ambiente** | "Ambiente PCP" | "Departamento", "Setor" |
| **Ferramenta** | "Ferramenta Recebimentos" | "Módulo", "App" |
| **Task** | "Concluir Task" | "Tarefa" (usaremos Task para padronizar o domínio) |
| **Feed** | "Feed do Time" | "Mural", "Timeline" |

> 📄 Glossário completo: [`docs/ai/GLOSSARY.md`](./ai/GLOSSARY.md)

---

## 3. Paleta de Cores

### Filosofia
**Base escura premium** + **acentos quentes (gold/alaranjado)** + **textura de madeira como detalhe**. Nunca todas no mesmo momento — a paleta é orquestrada.

### Cores Principais

#### 🖤 Preto Profundo (Background)
```
--arali-noir-900:   #0A0A0B    /* Fundo principal */
--arali-noir-800:   #111113    /* Card / Surface elevado */
--arali-noir-700:   #1A1A1D    /* Hover / Borda sutil */
--arali-noir-600:   #232328    /* Divisor / Stroke */
```

#### 🪵 Madeira (Texturas e Acentos Quentes)
```
--arali-wood-900:   #2B1F14    /* Mogno escuro - base de texturas */
--arali-wood-700:   #4A3520    /* Madeira média - bordas decorativas */
--arali-wood-500:   #7A5A3A    /* Carvalho - destaque sutil */
--arali-wood-300:   #B89270    /* Madeira clara - hover suave */
```

#### ✨ Gold (Acento Premium)
```
--arali-gold-900:   #6B4F1A    /* Gold escuro - bordas */
--arali-gold-700:   #9A7424    /* Gold médio */
--arali-gold-500:   #C8973A    /* Gold principal — botão primário, ícone destaque */
--arali-gold-300:   #E0B968    /* Gold claro — hover */
--arali-gold-100:   #F2D89B    /* Gold pálido — backgrounds delicados */
```

#### 🔥 Alaranjado (CTA e Sinalização Quente)
```
--arali-amber-900:  #6E2E0A    /* Alaranjado escuro */
--arali-amber-700:  #9C4514    /* Alaranjado médio */
--arali-amber-500:  #D6651E    /* Alaranjado principal - alertas, destaques */
--arali-amber-300:  #F09151    /* Alaranjado claro - hover */
```

#### ⚪ Neutros (Textos e UI)
```
--arali-neutral-50:    #FAFAF8    /* Texto principal sobre escuro */
--arali-neutral-200:   #D4D4CF    /* Texto secundário */
--arali-neutral-400:   #8A8A85    /* Texto terciário / disabled */
--arali-neutral-600:   #4A4A47    /* Texto sobre fundos claros */
--arali-neutral-800:   #2A2A28    /* Texto principal sobre claro */
```

### Cores Semânticas

```
--success:   #4A7C3F    /* Verde musgo - não brilhante */
--warning:   #D6651E    /* Reusa o Alaranjado */
--danger:    #A03A2C    /* Vermelho terra - não vermelho fluorescente */
--info:      #3F6B7C    /* Azul aço discreto */
```

### Regras de Uso
- **Background base**: sempre `noir-900`
- **Surface (cards, modais)**: `noir-800`
- **Texto principal**: `neutral-50`
- **Texto secundário**: `neutral-200`
- **Botão primário**: `gold-500` com texto `noir-900`
- **Botão secundário**: borda `noir-600`, texto `neutral-50`, fundo transparente
- **CTA quente / urgência**: `amber-500`
- **Madeira**: APENAS em texturas decorativas (header, login, splash) — nunca em fundo de operação
- **Verde / vermelho**: SOMENTE em status semânticos (nunca como acento decorativo)

### Proporção Recomendada (Regra 60-30-10)
```
60% Preto Profundo (noir)
30% Neutros (texto e UI)
10% Gold + Alaranjado + Madeira (acentos)
```

---

## 4. Tipografia

### Fontes

#### Display / Títulos
**`Cormorant Garamond`** — serif elegante, transmite craft e tradição
```
Aplicação: títulos de seção, logo, dashboard headers, login
Pesos: 400, 500, 600, 700
```

#### UI / Corpo
**`Inter`** — sans-serif ultra-legível, padrão moderno premium
```
Aplicação: corpo de texto, formulários, tabelas, navegação
Pesos: 400, 500, 600, 700
```

#### Mono (código, IDs, valores)
**`JetBrains Mono`** — para IDs de projeto, valores monetários precisos, código
```
Aplicação: PROJ-2025-001, R$ 12.345,67, hashes
Pesos: 400, 500
```

### Escala Tipográfica

```
text-xs       → 12px / 16px line-height   (legendas, metadados)
text-sm       → 14px / 20px               (corpo secundário, inputs)
text-base     → 16px / 24px               (corpo principal)
text-lg       → 18px / 28px               (subtítulos)
text-xl       → 20px / 28px               (h4)
text-2xl      → 24px / 32px               (h3)
text-3xl      → 30px / 36px               (h2)
text-4xl      → 36px / 40px               (h1)
text-display  → 48px / 52px Cormorant     (hero / landing)
```

### Hierarquia em Páginas

```
H1 — Cormorant 400 — text-3xl  (uma por página, identidade)
H2 — Inter 600     — text-2xl
H3 — Inter 600     — text-xl
H4 — Inter 600     — text-lg
Body — Inter 400   — text-base
Small — Inter 400  — text-sm
```

### Regra de Ouro
- **Títulos respiram**: usar Cormorant em h1 e em momentos editoriais
- **UI funcional**: Inter em todo o resto
- **Nunca misturar Cormorant em UI operacional** (ficaria distrativo)

---

## 5. Iconografia

### Biblioteca Padrão
**`Lucide React`** — leve, consistente, dark-mode friendly.

### Tamanhos
```
icon-sm    → 14px    (inline em texto)
icon-base  → 16px    (botões, navegação)
icon-md    → 20px    (sidebar, headers)
icon-lg    → 24px    (cards principais)
icon-xl    → 32px    (vazio de estados, splash)
```

### Stroke
- **Padrão**: `stroke-1.5` (mais elegante que o default 2)
- **Display**: `stroke-1` (em momentos editoriais)

### Mapa de Ícones — Ambientes do Sistema

| Conceito | Ícone Lucide | Uso |
|---|---|---|
| Home | `Home` | Sidebar |
| Projetos | `FolderOpen` | Sidebar |
| Pasta do Projeto | `FolderKanban` | Header da pasta |
| Time | `Users` | Sidebar / página do time |
| Feed | `Newspaper` | Sidebar |
| Tasks | `CheckSquare` | Listas de tarefas |
| Diretoria | `Crown` | Ambiente Diretoria |
| Comercial | `Handshake` | Ambiente Comercial |
| PCP | `Workflow` | Ambiente PCP |
| Engenharia | `DraftingCompass` | Roadmap |
| Suprimentos | `PackageSearch` | Roadmap |
| Produção | `Factory` | Roadmap |
| Obra | `HardHat` | Roadmap |
| Recebimentos | `Wallet` | Ferramenta Comercial |
| Notificações | `Bell` | Header |
| Configurações | `Settings` | Sidebar |

---

## 6. Espaçamento e Grid

### Sistema de Espaçamento (4px base)

```
space-1    → 4px
space-2    → 8px
space-3    → 12px
space-4    → 16px      ← unidade base de respiro
space-5    → 20px
space-6    → 24px      ← entre cards
space-8    → 32px      ← entre seções
space-10   → 40px
space-12   → 48px      ← topo de páginas
space-16   → 64px
space-20   → 80px      ← hero / landing
```

### Container e Layout

```
Sidebar:    240px (collapsed: 64px)
Header:     56px
Mobile bottom nav: 64px (em mobile)
Container max-width:
  - Operação: 1440px
  - Leitura (docs, post): 720px
```

### Densidade
- **Modo padrão**: confortável (Inter 14-16px, padding generoso)
- **Modo denso (futuro)**: tabelas e listas grandes (Inter 13px, padding reduzido)

---

## 7. Border Radius e Sombras

### Border Radius

```
rounded-none   → 0           /* Botões dentro de tabelas */
rounded-sm     → 2px         /* Tags, chips */
rounded        → 4px         /* Inputs, botões pequenos */
rounded-md     → 6px         /* Default UI */
rounded-lg     → 8px         /* Cards principais */
rounded-xl     → 12px        /* Modais, dialogs */
rounded-2xl    → 16px        /* Hero cards */
rounded-full   → 9999px      /* Avatars, badges circulares */
```

### Sombras (em modo escuro)

```css
--shadow-sm:    0 1px 2px rgba(0,0,0,0.4);
--shadow-md:    0 4px 8px rgba(0,0,0,0.5);
--shadow-lg:    0 8px 24px rgba(0,0,0,0.6);
--shadow-gold:  0 0 16px rgba(200,151,58,0.15);   /* Glow sutil de destaque */
--shadow-inner: inset 0 1px 0 rgba(255,255,255,0.04);  /* Highlight superior em cards */
```

> **Regra**: sombras em modo escuro são MAIS escuras que o fundo (não claras). O highlight superior `shadow-inner` cria a sensação de "lapidado" / "esculpido".

---

## 8. Gradientes

> Você pediu gradiente. Use **com extrema parcimônia** — apenas em momentos editoriais (hero, splash, cards de destaque).

### Gradientes Aprovados

```css
/* Hero / Landing — gradiente noir + gold sutil */
--gradient-hero: linear-gradient(135deg, #0A0A0B 0%, #1A1A1D 60%, #2B1F14 100%);

/* Cards de destaque (raro) */
--gradient-premium: linear-gradient(180deg, #1A1A1D 0%, #111113 100%);

/* Ouro — APENAS em moldura, não em fundo grande */
--gradient-gold-edge: linear-gradient(135deg, #6B4F1A 0%, #C8973A 50%, #6B4F1A 100%);

/* Quente para CTAs (alertas, lançamentos) — uso muito pontual */
--gradient-amber: linear-gradient(135deg, #9C4514 0%, #D6651E 100%);
```

### Anti-Padrão de Gradientes
- ❌ Gradiente arco-íris
- ❌ Gradiente em texto longo (legibilidade morre)
- ❌ Gradiente animado em background (cansa visualmente)
- ❌ Mais de 3 cores num gradiente

---

## 9. Componentes

### Princípios
- Toda interação tem **estado claro**: default, hover, focus, active, disabled, loading
- **Foco visível** sempre (acessibilidade)
- **Transições suaves** (~150-200ms)
- **Sem animações cinematográficas** em ações operacionais

### Botões

```
Primário:
  bg: gold-500
  texto: noir-900
  hover: gold-300
  active: gold-700
  focus ring: gold-300 / 2px
  disabled: opacity 50%

Secundário:
  bg: transparente
  borda: noir-600
  texto: neutral-50
  hover: borda neutral-400
  active: bg noir-700

Terciário (ghost):
  bg: transparente
  texto: neutral-200
  hover: bg noir-700

Destrutivo:
  bg: danger
  texto: neutral-50
  hover: brightness 110%
```

### Inputs

```
bg: noir-800
borda: noir-600 (1px)
texto: neutral-50
placeholder: neutral-400
focus: borda gold-500 + ring gold-300/20%
erro: borda danger + ring danger/20%
disabled: opacity 50% + cursor not-allowed
```

### Cards

```
bg: noir-800
borda: noir-700 (1px)
shadow: shadow-md + shadow-inner
padding: space-6
hover (se clicável): borda gold-700 + transição 150ms
```

### Avatares

```
Tamanhos: 24px, 32px, 40px, 56px
Fallback: iniciais com bg gradiente noir → wood
Ring de role:
  - Diretoria: gold-500 (2px)
  - Gestor: gold-700 (1.5px)
  - Líder: wood-500 (1.5px)
  - Integrante: sem ring
```

### Status (Badge / Tag)

```
pendente:    bg neutral-800, texto neutral-200
em_andamento: bg amber-900, texto amber-300
concluida:   bg success/20%, texto success
bloqueada:   bg danger/20%, texto danger
revisao:     bg gold-900, texto gold-300
```

---

## 10. Tokens (Tailwind + CSS Variables)

### CSS Variables (em `globals.css`)

```css
@layer base {
  :root {
    /* Noir */
    --noir-900: 10 10 11;
    --noir-800: 17 17 19;
    --noir-700: 26 26 29;
    --noir-600: 35 35 40;

    /* Wood */
    --wood-900: 43 31 20;
    --wood-700: 74 53 32;
    --wood-500: 122 90 58;
    --wood-300: 184 146 112;

    /* Gold */
    --gold-900: 107 79 26;
    --gold-700: 154 116 36;
    --gold-500: 200 151 58;
    --gold-300: 224 185 104;
    --gold-100: 242 216 155;

    /* Amber */
    --amber-900: 110 46 10;
    --amber-700: 156 69 20;
    --amber-500: 214 101 30;
    --amber-300: 240 145 81;

    /* Neutral */
    --neutral-50: 250 250 248;
    --neutral-200: 212 212 207;
    --neutral-400: 138 138 133;
    --neutral-600: 74 74 71;
    --neutral-800: 42 42 40;

    /* Semantic */
    --success: 74 124 63;
    --warning: 214 101 30;
    --danger: 160 58 44;
    --info: 63 107 124;

    /* UI */
    --background: var(--noir-900);
    --foreground: var(--neutral-50);
    --card: var(--noir-800);
    --card-foreground: var(--neutral-50);
    --primary: var(--gold-500);
    --primary-foreground: var(--noir-900);
    --secondary: var(--noir-700);
    --secondary-foreground: var(--neutral-50);
    --muted: var(--noir-700);
    --muted-foreground: var(--neutral-400);
    --accent: var(--gold-500);
    --accent-foreground: var(--noir-900);
    --destructive: var(--danger);
    --destructive-foreground: var(--neutral-50);
    --border: var(--noir-600);
    --input: var(--noir-600);
    --ring: var(--gold-500);

    /* Radius */
    --radius: 0.5rem;
  }
}
```

### Extensão Tailwind (`tailwind.config.ts`)

```ts
export default {
  theme: {
    extend: {
      colors: {
        noir: {
          900: 'rgb(var(--noir-900) / <alpha-value>)',
          800: 'rgb(var(--noir-800) / <alpha-value>)',
          700: 'rgb(var(--noir-700) / <alpha-value>)',
          600: 'rgb(var(--noir-600) / <alpha-value>)',
        },
        wood: {
          900: 'rgb(var(--wood-900) / <alpha-value>)',
          700: 'rgb(var(--wood-700) / <alpha-value>)',
          500: 'rgb(var(--wood-500) / <alpha-value>)',
          300: 'rgb(var(--wood-300) / <alpha-value>)',
        },
        gold: {
          900: 'rgb(var(--gold-900) / <alpha-value>)',
          700: 'rgb(var(--gold-700) / <alpha-value>)',
          500: 'rgb(var(--gold-500) / <alpha-value>)',
          300: 'rgb(var(--gold-300) / <alpha-value>)',
          100: 'rgb(var(--gold-100) / <alpha-value>)',
        },
        amber: {
          900: 'rgb(var(--amber-900) / <alpha-value>)',
          700: 'rgb(var(--amber-700) / <alpha-value>)',
          500: 'rgb(var(--amber-500) / <alpha-value>)',
          300: 'rgb(var(--amber-300) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0A0A0B 0%, #1A1A1D 60%, #2B1F14 100%)',
        'gradient-premium': 'linear-gradient(180deg, #1A1A1D 0%, #111113 100%)',
        'gradient-gold-edge': 'linear-gradient(135deg, #6B4F1A 0%, #C8973A 50%, #6B4F1A 100%)',
        'gradient-amber': 'linear-gradient(135deg, #9C4514 0%, #D6651E 100%)',
      },
      boxShadow: {
        'gold': '0 0 16px rgba(200,151,58,0.15)',
        'inner-highlight': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
    },
  },
}
```

---

## 11. Modo Claro vs Escuro

### Decisão: **Dark-First, Light Opcional**

**MVP**: apenas Dark Mode (alinhado ao tom Luxo Discreto, reduz fadiga visual em uso prolongado, evita debate de design no MVP).

**Fase 2**: implementar Light Mode com a mesma paleta invertida, mantendo Gold/Wood como acentos.

**Estrutura preparada**: usar CSS Variables desde o dia 1 facilita ativar Light Mode depois sem refactor.

---

## 12. Acessibilidade

### Padrão WCAG 2.1 nível AA

- ✅ **Contraste mínimo 4.5:1** em texto normal, 3:1 em texto grande
- ✅ **Foco visível** em todos elementos interativos (ring gold)
- ✅ **Navegação por teclado** completa (Tab, Esc, Enter, setas em listas)
- ✅ **ARIA labels** em ícones-only buttons
- ✅ **Skip links** no header
- ✅ **Reduced motion** respeitado (`prefers-reduced-motion`)
- ✅ **Tamanho mínimo** de toque mobile: 44x44px
- ✅ **Texto alternativo** em todas as imagens significativas

### Verificações Automatizadas
- ESLint com `eslint-plugin-jsx-a11y`
- Lighthouse CI no pipeline
- Manual: Axe DevTools nos PRs maiores

---

## 13. Logo e Aplicações

### Status Atual
**Logo ainda não foi criado.** Espaço reservado para entrega futura por designer.

### Diretrizes Iniciais para o Futuro Logo

- Conceito sugerido: **letra "A" estilizada** evocando uma serra ou um chanfro de marcenaria + **palavra "FLOW"** em sans-serif elegante
- **Versões**: monocromática (gold sobre noir, noir sobre gold), positiva, negativa
- **Variantes**: completa (Arali Flow), só símbolo (A), favicon (16x16, 32x32, 192x192, 512x512 para PWA)
- **Espaço de respiro mínimo**: equivalente à altura da letra "A"
- **Tamanho mínimo**: 24px de altura

### Placeholder Atual (até logo final)
```
ARALI ✦ FLOW
(Cormorant Garamond 600 + ornamento gold)
```

### Favicon e PWA Icons
Manter consistência com `/public/icons/`:
- `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`
- `icon-192.png`, `icon-512.png` (PWA)
- `maskable-icon.png` (PWA Android)

---

## 14. Anti-Padrões

### O que NUNCA fazer

1. ❌ **Usar mais de 3 cores de acento** numa mesma tela
2. ❌ **Bordas brilhantes** (white/100% opacity) — usar highlight sutil 4-8% opacity
3. ❌ **Animações de mais de 300ms** em ações operacionais
4. ❌ **Drop shadows brancas** ou coloridas — sempre escuras
5. ❌ **Texto Cormorant em parágrafos** — só em títulos
6. ❌ **Gradiente em fundo de operação** (planilhas, listas)
7. ❌ **Emoji decorativo** em UI corporativa (ok em Feed/Posts)
8. ❌ **Capitalização ALL CAPS** em texto longo (ok em labels curtos)
9. ❌ **Stock photos genéricas**
10. ❌ **Termos como "uau"**, "incrível", "fantástico" no microcopy
11. ❌ **Dark mode com cinza puro** (frio demais — sempre tem matiz quente)
12. ❌ **Logo da Arali deformado, recolorido ou sob fundo conflitante**

---

## 📌 Próximos Passos do Branding

1. ✅ Estabelecer paleta e tokens iniciais (este documento)
2. ⏳ Validar paleta em wireframes navegáveis (Figma/Lovable)
3. ⏳ Validar com Arali Móveis em checkpoint
4. ⏳ Contratar/orientar designer para criar logo definitivo
5. ⏳ Criar Storybook com todos os componentes documentados
6. ⏳ Refinar microcopy em todas as telas
7. ⏳ Adicionar Light Mode (Fase 2)
8. ⏳ Criar Brand Book em PDF para Arali (Fase pós-MVP)

---

> *"Design é o silêncio entre as notas. Em uma marcenaria de luxo, o design não grita — ele convida."*

**Versão**: 0.1 — Inicial preliminar  
**Última atualização**: 2026-04-29  
**Autor**: Marcus Vitorino + Copiloto IA
