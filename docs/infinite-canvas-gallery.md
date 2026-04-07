# Infinite Canvas Gallery — Documentacao Tecnica

> Referencia: [emmiwu.com/playground](https://emmiwu.com/playground)
> Implementado em: `src/components/InfiniteCanvas.tsx` + `src/app/gallery/page.tsx`

## Visao Geral

Uma galeria de imagens em canvas infinito com parallax e fisica. O usuario pode arrastar (drag) ou usar scroll (wheel) para navegar. As imagens se repetem infinitamente em todas as direcoes (tiling), criando a ilusao de um espaco sem fim.

**Nao usa nenhuma biblioteca de fisica externa** — tudo e matematica simples com `requestAnimationFrame`.

---

## Arquitetura

### Componentes

```
src/app/gallery/
  layout.tsx        → Layout full-screen (escapa do max-w-712px do root)
  page.tsx          → Define os items, posicoes, e renderiza o canvas

src/components/
  InfiniteCanvas.tsx → Componente core com toda a logica de tiling, drag, scroll e parallax
```

### Parametros Configuraveis

```ts
interface InfiniteCanvasProps {
  items: CanvasItem[];        // Lista de imagens (nao usada diretamente, items sao children)
  scrollSpeed?: number;       // 0-1, velocidade do scroll wheel (default: 0.4)
  dragSpeed?: number;         // 0-1, velocidade do arraste (default: 0.5)
  ease?: number;              // 0-1, suavizacao do lerp (default: 0.3)
  parallax?: {
    enabled: boolean;         // Ativar parallax
    general: number;          // Multiplicador geral (default: 1)
    child: number;            // Multiplicador do conteudo interno (default: 1)
  };
  enableDrag?: boolean;       // Ativar arraste (default: true)
}
```

---

## Como Funciona — Detalhes Tecnicos

### 1. Canvas Infinito com Tiling (Repeticao)

Os cards sao posicionados com `position: absolute` e `transform: translate(Xpx, Ypx)`.

Para criar a ilusao de canvas infinito, cada card e **clonado 3 vezes** e posicionado em tiles de `2x largura` e `2x altura` do container (grid 2x2 = 4 instancias total):

```js
// Para cada card, cria 3 clones
for (let i = 0; i < 3; i++) {
  const clone = node.cloneNode(true);
  container.appendChild(clone);
  clone.style.position = "absolute";
  clone.style.willChange = "transform";
}

// 4 posicoes por card (2x2 grid de tiles)
[0, larguraContainer].forEach((offsetX) => {
  [0, alturaContainer].forEach((offsetY) => {
    positions.push({
      x: posicaoOriginalX + offsetX,
      y: posicaoOriginalY + offsetY,
    });
  });
});
```

Quando um card sai por um lado, o `extraX`/`extraY` e ajustado para ele reaparecer pelo lado oposto:

```js
// Wrap-around
if (direction === "right" && posX > totalWidth) pos.extraX -= tileSizeW;
if (direction === "left"  && posX + width < 0)  pos.extraX += tileSizeW;
if (direction === "down"  && posY > totalHeight) pos.extraY -= tileSizeH;
if (direction === "up"    && posY + height < 0)  pos.extraY += tileSizeH;
```

### 2. Easing com Interpolacao Linear (Lerp)

O movimento suave e feito com um simples **lerp** no `requestAnimationFrame`:

```js
// A cada frame:
current.x += (target.x - current.x) * ease;  // ease = ~0.06 (mapeado de 0.3)
current.y += (target.y - current.y) * ease;
```

Isso cria aquele efeito de "atraso elastico" — o target muda instantaneamente quando o usuario interage, e o current alcanca suavemente. Nao tem spring nem inertia complexa — e so **interpolacao linear por frame**.

O ease e mapeado de 0..1 para 0.01..0.2:
- `ease = 0` → muito suave (0.01 de lerp, quase nao se move)
- `ease = 1` → muito responsivo (0.2 de lerp, quase instantaneo)

### 3. Inputs: Wheel + Drag + Touch

```js
// WHEEL — move o target diretamente
window.addEventListener("wheel", (e) => {
  e.preventDefault();
  target.x -= e.deltaX * scrollSpeed;
  target.y -= e.deltaY * scrollSpeed;
}, { passive: false });

// MOUSE DRAG
container.addEventListener("mousedown", (e) => {
  // Salva posicao inicial
  startX = e.clientX;
  startY = e.clientY;
  savedScrollX = target.x;
  savedScrollY = target.y;
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    target.x = savedScrollX + (e.clientX - startX) * dragSpeed;
    target.y = savedScrollY + (e.clientY - startY) * dragSpeed;
  }
});

// TOUCH — mesma logica do mouse, com e.touches[0]
```

### 4. Efeito Parallax

O parallax tem duas camadas:

**Camada 1 — Deslocamento geral do card** (baseado na posicao do mouse na tela):

```js
// Posicao do mouse suavizada (lerp lento de 0.04)
mouseSmooth.x += (mouseReal.x - mouseSmooth.x) * 0.04;

// Offset no card baseado no delta de movimento + posicao do mouse
offsetX = 5 * smoothDelta.x * itemEase + (mouseSmooth.x - 0.5) * cardWidth * 0.6 * parallaxGeneral;
offsetY = 5 * smoothDelta.y * itemEase + (mouseSmooth.y - 0.5) * cardHeight * 0.6 * parallaxGeneral;
```

**Camada 2 — Deslocamento interno do conteudo** (imagem dentro do card):

```js
// O conteudo interno se move na direcao OPOSTA ao mouse
childOffsetX = (0.5 - mouseSmooth.x) * itemEase * 20 * parallaxGeneral * parallaxChild;
childOffsetY = (0.5 - mouseSmooth.y) * itemEase * 20 * parallaxGeneral * parallaxChild;
child.style.transform = `translate(${childOffsetX}%, ${childOffsetY}%)`;
```

**Profundidade por card**: Cada card recebe um `ease` aleatorio (`Math.random() * 0.5 + 0.5`), fazendo cada um se mover em velocidades ligeiramente diferentes — criando camadas de profundidade naturais.

### 5. Visibilidade e Performance

Apenas cards visiveis (viewport + margem de 1000px) recebem `opacity: 1` e `pointer-events: auto`. Os invisiveis ficam com `opacity: 0` e `pointer-events: none`.

```js
const margin = 1000;
const isVisible =
  screenX >= -width - margin &&
  screenX <= viewportWidth + margin &&
  screenY >= -height - margin &&
  screenY <= viewportHeight + margin;

el.style.opacity = isVisible ? "1" : "0";
el.style.pointerEvents = isVisible ? "auto" : "none";
```

### 6. Selecao do Elemento "Real" vs Clones

Para cada card, existem 4 instancias (1 original + 3 clones). O componente decide qual e o "real" (que recebe eventos de click, etc.) baseado em:

1. Se o mouse esta sobre uma instancia → essa e a real
2. Senao, mantem a ultima instancia ativa (se ainda visivel)
3. Senao, pega a mais proxima do centro da tela

---

## Resumo da Tecnica

| Conceito            | Implementacao                                              |
| ------------------- | ---------------------------------------------------------- |
| Canvas infinito     | Clones + tiling 2x2 + wrap-around modular                 |
| Suavizacao          | Lerp simples: `current += (target - current) * ease`      |
| Parallax            | Mouse normalizado (0-1) + multiplicadores por camada      |
| Drag                | mousedown/move/up + touchstart/move/end nativos            |
| Scroll              | `wheel` event com `preventDefault`                         |
| Performance         | `requestAnimationFrame` + `will-change: transform`         |
| Visibilidade        | Viewport check com margem de 1000px                        |
| Profundidade        | `ease` aleatorio por card (0.5-1.0)                        |

---

## Layout Full-Screen

A galeria precisa ocupar a tela inteira, mas o root layout do Next.js tem `max-w-[712px]`. O `gallery/layout.tsx` resolve isso com CSS override:

```css
/* Esconde o header do root layout */
body > div > main > aside { display: none !important; }

/* Faz o main ocupar a tela toda */
body > div > main {
  max-width: none !important;
  position: fixed !important;
  inset: 0 !important;
}
```

E renderiza seu proprio header posicionado absolutamente.

---

## Estrutura dos Items

Os items sao definidos estaticamente no `page.tsx` com posicoes pre-computadas (scatter manual):

```ts
const galleryItems = [
  {
    src: "/galleryIMGs/emmiwu/01-illustration-crossing.png",
    title: "Illustration",
    description: "For a piece about crossing paths, fate, and love",
    width: 273,   // Largura do card em pixels
    height: 360,  // Altura do card em pixels
  },
  // ...
];

// Posicoes (x, y) de cada card no canvas
const positions = [
  { x: 60, y: 44 },
  { x: 400, y: 767 },
  // ...
];
```

O canvas tem dimensoes fixas de `2000x1300px` — os items sao espalhados dentro desse espaco, e o tiling duplica tudo em um grid 2x2 (efetivamente 4000x2600px de mundo).

---

## Como Usar para Contexto de Agente

Para dar contexto a um agente sobre como implementar/modificar esta galeria:

1. **Adicionar novo item**: Adicionar entrada em `galleryItems` + posicao em `positions` no `page.tsx`
2. **Ajustar fisica**: Mudar `scrollSpeed`, `dragSpeed`, `ease` nas props do `<InfiniteCanvas>`
3. **Ajustar parallax**: Mudar `parallax.general` (movimento geral) e `parallax.child` (movimento interno)
4. **Mudar tamanho do canvas**: Alterar o `width`/`height` do div container (atualmente 2000x1300)
5. **Mudar layout dos cards**: Alterar as posicoes no array `positions`

O componente `InfiniteCanvas` nao precisa saber dos items — ele opera no DOM diretamente, pegando os children do container pai e clonando/posicionando.
