# 🎨 BRANDING.md — Identidade Visual Arali Flow
> Fonte: Brand Book Arali Móveis (Fev/2026) — documento oficial LIOMA IT
> Última atualização: 2026-04-30
> Versão: 1.1

---

## 🏢 Sobre a Marca

**Arali Móveis** — Engenharia Aplicada à Madeira.
Fundada por dois irmãos, o símbolo é derivado da letra "A" com dois elementos
representando os fundadores. Traços retos e angulares remetem aos cortes precisos
da madeira. Palavras-chave da identidade: **Legado · Expertise · Humildade**.

> *"A Arali nasce das raízes da família, cresce com a técnica e se consolida como legado."*

---

## 🎨 Paleta de Cores Oficial (Brand Book)

São **4 cores** — nenhuma outra cor é da marca. Utilitários (success, danger) existem
apenas para sinalização funcional da UI.

| Nome | Hex | RGB | Papel |
|---|---|---|---|
| **Creme** | `#F5ECE6` | R245 G236 B230 | Fundo light, papel, texto sobre escuro |
| **Terracota** | `#C77549` | R201 G123 B99 | Acento quente, CTAs, chips de OS |
| **Vinho** | `#683637` | R104 G54 B55 | Cor primária, navegação ativa, autoridade |
| **Marrom** | `#412F2D` | R65 G47 B45 | Base das superfícies dark, texto em light |

### Psicologia (Brand Book oficial)

- **Terracota** — Simbolismo: origem, matéria e construção. Evoca calor, proximidade e permanência.
- **Vinho** — Simbolismo: profundidade, maturidade e rigor. Expressa precisão, controle e autoridade técnica.
- **Marrom** — Simbolismo: estabilidade, estrutura e confiança. Remete à base construtiva e ao conhecimento.

---

## 🌗 Sistema Dual de Temas

O Arali Flow usa **`:root` = light** e **`.dark` = dark**.
Todas as cores vivem em CSS custom properties — nenhum componente usa hex literal.
Tokens semânticos (`bg-bg`, `text-text-1`, `bg-vinho`, `bg-terracota`) são as únicas
classes de cor permitidas nos componentes.

> ⚠️ **`vinho-light` e `terra-light` têm valores diferentes por modo** — não são iguais.
> Em light precisam ser mais escuras para ter contraste sobre o creme.
> Em dark precisam ser mais claras para ter contraste sobre o marrom profundo.

### CSS Custom Properties (`src/styles.css`)

```css
:root {
  /* ── LIGHT (padrão — cor de papel Arali) ── */

  /* Backgrounds */
  --bg:          #F5ECE6;   /* creme oficial — fundo principal */
  --surface-1:   #FDFAF8;   /* near-white quente — sidebar, painéis */
  --surface-2:   #EDE0D6;   /* creme mais escuro — cards, inputs */
  --surface-3:   #E2D0C4;   /* hover de cards, dropdowns */
  --border:      rgba(65, 47, 45, 0.12);

  /* Marca */
  --vinho:       #683637;
  --vinho-light: #4D2526;   /* ← mais ESCURO no light (contraste sobre creme) */
  --terracota:   #C77549;
  --terra-light: #A85D38;   /* ← mais ESCURO no light */

  /* Texto */
  --text-1:      #412F2D;   /* marrom oficial */
  --text-2:      #7A5C54;
  --text-3:      #A89B95;   /* placeholder, desabilitado */

  /* Utilitários */
  --success:     #2D7A57;   /* verde escuro — contraste no light */
  --danger:      #B94040;   /* vermelho escuro — contraste no light */

  /* Sombras (sutis, marrom) */
  --shadow-card:  0 1px 3px rgba(65,47,45,0.08), 0 4px 12px rgba(65,47,45,0.06);
  --shadow-hover: 0 4px 16px rgba(65,47,45,0.14), 0 1px 3px rgba(65,47,45,0.1);
}

.dark {
  /* ── DARK (derivado do marrom Arali) ── */

  /* Backgrounds */
  --bg:          #150E0D;
  --surface-1:   #1E1512;
  --surface-2:   #2A1C18;
  --surface-3:   #352420;
  --border:      rgba(245, 236, 230, 0.07);

  /* Marca */
  --vinho:       #683637;
  --vinho-light: #8B4A4B;   /* ← mais CLARO no dark (contraste sobre marrom) */
  --terracota:   #C77549;
  --terra-light: #D4906A;   /* ← mais CLARO no dark */

  /* Texto */
  --text-1:      #F5ECE6;   /* creme — texto principal no escuro */
  --text-2:      #A89B95;
  --text-3:      #5C4E4A;

  /* Utilitários */
  --success:     #4CAF82;
  --danger:      #D95F52;

  /* Sombras (escuras) */
  --shadow-card:  0 1px 0 0 rgba(245,236,230,0.04) inset, 0 4px 16px rgba(0,0,0,0.4);
  --shadow-hover: 0 1px 0 0 rgba(245,236,230,0.06) inset, 0 8px 24px rgba(0,0,0,0.5);
}

/* Aliases legados — apontam para os novos tokens.
   Mantidos para compatibilidade durante migração progressiva.
   Não usar em código novo. */
:root, .dark {
  --noir:   var(--bg);
  --wood:   var(--vinho);
  --gold:   var(--terracota);
  --amber:  var(--terracota);
  --creme:  var(--text-1);
}
```

### Tailwind v4 — `@theme` inline (`src/styles.css`)

> ⚠️ Este projeto usa **Tailwind v4 + Vite**. Não existe `tailwind.config.ts`.
> Tokens entram via `@theme` inline no CSS e ficam disponíveis como classes utilitárias
> (`bg-bg`, `text-vinho`, `bg-terracota`, etc.) automaticamente.

```css
@theme inline {
  /* Backgrounds */
  --color-bg:          var(--bg);
  --color-surface-1:   var(--surface-1);
  --color-surface-2:   var(--surface-2);
  --color-surface-3:   var(--surface-3);

  /* Marca */
  --color-vinho:       var(--vinho);
  --color-vinho-light: var(--vinho-light);
  --color-terracota:   var(--terracota);
  --color-terra-light: var(--terra-light);

  /* Texto */
  --color-text-1:      var(--text-1);
  --color-text-2:      var(--text-2);
  --color-text-3:      var(--text-3);

  /* Utilitários */
  --color-success:     var(--success);
  --color-danger:      var(--danger);

  /* Aliases legados */
  --color-noir:        var(--bg);
  --color-wood:        var(--vinho);
  --color-gold:        var(--terracota);
  --color-amber:       var(--terracota);

  /* Sombras */
  --shadow-card:       var(--shadow-card);
  --shadow-hover:      var(--shadow-hover);

  /* Fontes */
  --font-sans:         'DM Sans', sans-serif;
  --font-montserrat:   'Montserrat', sans-serif;
  --font-mono:         'JetBrains Mono', monospace;
}
```

### Transições Globais

```css
/* Em @layer base no styles.css */
*, *::before, *::after {
  transition:
    background-color 250ms ease,
    border-color     200ms ease,
    color            150ms ease,
    box-shadow       200ms ease;
}

/* Elementos interativos: mais rápidos */
button, a, [role="button"] {
  transition-duration: 150ms;
}
```

---

## 🌓 Hook de Tema (`src/hooks/use-theme.ts`)

```ts
'use client'
import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('arali-theme') as Theme | null
    const initial = saved ?? 'dark'           // default sempre dark
    applyTheme(initial)
    setTheme(initial)
  }, [])

  function applyTheme(t: Theme) {
    document.documentElement.classList.toggle('dark', t === 'dark')
    localStorage.setItem('arali-theme', t)
  }

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return { theme, toggleTheme, isDark: theme === 'dark' }
}
```

### Anti-flash (TanStack Start — `__root.tsx`)

Adicionar no `<head>` antes da hidratação para evitar piscão branco:

```tsx
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      var t = localStorage.getItem('arali-theme');
      if (t !== 'light') document.documentElement.classList.add('dark');
    })();
  `
}} />
```

---

## 🔤 Tipografia

### Fontes Oficiais (Brand Book)

| Fonte | Peso | Uso |
|---|---|---|
| **Montserrat** | 300, 400, 500, 600, 700 | Logotipo, títulos de página, labels uppercase |
| **DM Sans Medium** | 500 | Sub-títulos, nomes em cards, textos de destaque |
| **DM Sans Regular** | 400 | Corpo de texto, descrições, meta-informações |
| **JetBrains Mono** | 400, 500 | OS (OS12513), valores monetários, datas *(funcional, não está no brand book)* |

### Hierarquia

```
Montserrat 300 → Títulos de página ("Comercial", "Recebimentos")
Montserrat 600 → Labels uppercase ("AMBIENTES", "TIMES", "ENTREGAS")
DM Sans 500    → Nome do projeto no card, sub-títulos
DM Sans 400    → Corpo, meta-info, descrições
JetBrains 500  → "OS12513", "R$ 12.450,00"
JetBrains 400  → Datas, códigos secundários
```

### Importação Google Fonts (`src/styles.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');
```

---

## 🔲 Border Radius e Sombras

```
Inputs / Badges / Botões:  rounded-md (6px)
Cards / Modais / Drawers:  rounded-lg (8px)
Avatares:                  rounded-full

Sombra dark — card:  0 1px 0 rgba(245,236,230,0.04) inset, 0 4px 16px rgba(0,0,0,0.4)
Sombra dark — hover: 0 1px 0 rgba(245,236,230,0.06) inset, 0 8px 24px rgba(0,0,0,0.5)
Sombra light — card: 0 1px 3px rgba(65,47,45,0.08), 0 4px 12px rgba(65,47,45,0.06)
Sombra light — hover:0 4px 16px rgba(65,47,45,0.14), 0 1px 3px rgba(65,47,45,0.1)

→ Usar classes: shadow-card e shadow-hover (mapeadas no @theme)
```

---

## 🏷️ Badges de Status

Usando opacidade Tailwind (`/10`, `/15`, `/30`) — funcionam em ambos os temas:

```
nova:     bg-terracota/10  border-terracota/30  text-terracota
enviada:  bg-vinho/15      border-vinho/40      text-vinho-light
nfp:      bg-vinho/10      border-vinho/25      text-text-2
aprovada: bg-success/12    border-success/30    text-success
recusada: bg-danger/12     border-danger/30     text-danger
em_pausa: bg-terra-light/10 border-terra-light/25 text-terra-light
```

---

## 🔧 Componentes — Spec por Tema

Todos os valores abaixo usam tokens. Nenhum hex literal nos componentes.

### Botão Primário
```
bg-terracota
text-bg          ← usa --bg: no dark é #150E0D, no light é #F5ECE6 — contraste garantido
hover: bg-terra-light
font: font-montserrat font-semibold text-sm
rounded-md, transition-colors duration-150
```

### Botão Outline / Secundário
```
bg-transparent
border border-vinho
text-text-1
hover: bg-vinho/15
rounded-md, transition-colors duration-150
```

### Input / Select
```
bg-surface-1
border border-border
focus: border-terracota ring-0 outline-none
text-text-1, placeholder: text-text-3
rounded-md
```

### Card de OS
```
bg-surface-2
border border-border rounded-lg
shadow-card → hover: shadow-hover bg-surface-3
selected: border-terracota border-[1.5px]

número OS: font-mono text-sm
  dark: text-terracota bg-terracota/10 border-terracota/25
  light: text-vinho bg-vinho/10 border-vinho/25
  → className="font-mono text-vinho dark:text-terracota bg-vinho/10 dark:bg-terracota/10 ..."
```

### Sidebar — Item de Navegação
```
default: text-text-2
hover:   bg-surface-3 text-text-1
ativo:   bg-surface-2 text-text-1 border-l-2 border-vinho
```

### Avatar
```
rounded-full, bg-surface-2
border border-terracota
initials: font-montserrat font-semibold text-terracota
```

### Toggle de Tema (Header)
```
Ícone Sun (light mode) / Moon (dark mode) — lucide-react, 18px, strokeWidth 1.5
p-1.5 rounded-md text-text-2 hover:text-text-1 hover:bg-surface-2
transition-colors duration-150
Posição: lado direito do Header, antes do avatar
```

---

## 🚫 Anti-Padrões (Proibido)

```
❌ Hex literal em componente — usar apenas tokens (bg-bg, text-text-1, etc.)
❌ Preto puro #000000 ou #0C0B09 — não é cor da Arali
❌ Dourado #C9A84C — não existe no brand book (era estimado)
❌ Inter — substituída por DM Sans
❌ Cormorant Garamond — substituída por Montserrat
❌ Azul, verde genérico, cinza frio (#6B7280, etc.)
❌ vinho-light e terra-light com valor único nos dois modos — são diferentes por tema
❌ tailwind.config.ts — este projeto usa Tailwind v4 com @theme inline
❌ next/font — este projeto usa TanStack Start + Vite (Google Fonts via @import)
```

---

## 📦 Recursos

- Brand Book PDF: `docs/assets/Arali-MANUAL-IDT-VISUAL-OFICIAL.pdf`
- Fontes: Google Fonts — Montserrat, DM Sans, JetBrains Mono
- Logo SVG: solicitar ao time de marketing da Arali
- Paleta oficial (4 cores): `#F5ECE6` · `#C77549` · `#683637` · `#412F2D`

---

**Versão**: 1.1
**Atualizado em**: 2026-04-30
**Alterações v1.1**:
- Sistema dual de temas (`:root` = light, `.dark` = dark)
- Correção: `vinho-light` e `terra-light` com valores distintos por modo
- Tailwind v4 via `@theme` inline (sem `tailwind.config.ts`)
- Removido setup Next.js (projeto usa TanStack Start + Vite)
- Adicionado hook `useTheme` e script anti-flash para `__root.tsx`
- Aliases legados (`--noir`, `--wood`, `--gold`) mapeados para novos tokens
- Transições globais especificadas
- Specs de componente reescritas com tokens semânticos
- Badges com opacidade Tailwind (`/10`, `/15`, etc.)

**Mantido por**: Marcus Vitorino / Lioma IT
