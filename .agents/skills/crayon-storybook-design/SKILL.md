---
name: crayon-storybook-design
description: Sistema de diseño "Crayon Storybook" de Gossip Garden: estética paper-like cálida e infantil con efecto crayón, paleta de colores crema/marrón, tipografía redondeada, filtros SVG de jitter, y personajes con cara. Usa esta skill siempre que trabajes en cualquier página, componente, o elemento visual del proyecto Gossip Garden — aunque solo vayas a cambiar un color, añadir un botón, o crear una sección nueva. Todo lo visual en este proyecto debe seguir este lenguaje.
---

# Gossip Garden — Crayon Storybook Design System

Skill de referencia para mantener la coherencia visual del proyecto Gossip Garden. Todo elemento visual —desde un simple botón hasta una página completa— debe adherirse a este sistema.

## Filosofía visual

El lenguaje visual se llama **Crayon Storybook**. Combina cuatro influencias:

1. **Ilustración de libro infantil** — contornos marrón oscuro gruesos, rellenos planos, caras expresivas
2. **Efecto crayón / wax crayon** — filtros SVG `feTurbulence` + `feDisplacementMap` que distorsionan levemente cada forma
3. **Textura de papel kraft** — fondo `#FAF1DA` con ruido fractal superpuesto (CSS `body::before` y `body::after`)
4. **Storybook UI / Yoshi's Island** — borde grueso oscuro, colores cálidos, mejillas rosadas, bocadillos de diálogo

El resultado es **cálido, artesanal y deliberadamente imperfecto** — como si todo hubiera sido dibujado con crayones sobre papel. **La imperfección es la estética.**

### Principios fundamentales

1. **La imperfección es intencional.** El jitter del crayón no es un defecto — es la firma del estilo.
2. **Todo tiene cara.** Los personajes son expresivos. La planta tiene emociones reales.
3. **El papel existe.** La textura de fondo no es decoración — es el material del mundo.
4. **Sin emojis. Nunca.** Todos los íconos son SVG dibujados a mano con `HandIcon`.
5. **El marrón oscuro (`#3D2817`) une todo.** Es el "tinte de crayón" que da coherencia a todo el proyecto.

## Paleta de colores

La fuente única de verdad para colores es el objeto `PALETTE` en `components/crayon-v3.jsx`. **Nunca** uses valores hex directamente si existen en PALETTE.

### Colores base

| Nombre | Variable | HEX | Uso principal |
|---|---|---|---|
| Cream Paper | `PALETTE.bg` | `#FAF1DA` | Fondo global |
| Cream Dark | `PALETTE.bgDark` | `#F0E2C0` | Fondos alternativos, hover suave |
| Ink | `PALETTE.ink` | `#3D2817` | Contornos, texto principal, bordes SVG |
| Ink Soft | `PALETTE.inkSoft` | `#6B4A2E` | Texto secundario, párrafos |
| Pot Orange | `PALETTE.pot` | `#E8A95C` | Botones neutros |
| Pot Dark | `PALETTE.potDk` | `#C68A40` | Scrollbar, texturas |
| Leaf Green | `PALETTE.leaf` | `#8AC553` | Botón secundario, CTA descarga |
| Leaf Dark | `PALETTE.leafDk` | `#5FA037` | Subrayados, kickers |
| Heart Red | `PALETTE.heart` | `#E85D52` | CTA principal, botón "Comprar", rubor |
| Cream Light | `PALETTE.cream` | `#FFF8E7` | Fondo interior de tarjetas |
| Shadow | `PALETTE.shadow` | `rgba(61,40,23,0.08)` | Sombras suaves |

### Colores de personalidades (4 plantas)

| Personalidad | HEX | Carácter |
|---|---|---|
| Alegre (Girasol) | `#F4D06F` | Amarillo dorado, energético |
| Dormilona (Suculenta) | `#B8C9E8` | Azul suave, tranquilo |
| Dramática (Orquídea) | `#E0B8E0` | Lavanda, intenso |
| Exigente (Cactus) | `#A8C88A` | Verde sage, directo |

### Reglas de opacidad para fondos de tarjeta

Cuando uses un color de personalidad como fondo de tarjeta, aplica opacidad reducida en notación hex:
- `color + '40'` → 25% opacidad (tarjetas de personalidad)
- `color + '30'` → 19% opacidad (CTA card)
- `color + '20'` → 13% opacidad (fondos secundarios)

## Tipografía

Tres fuentes cargadas desde Google Fonts. Siempre se cargan juntas:
```
https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Nunito:wght@400;500;600;700;800;900&family=Quicksand:wght@400;500;600;700
```

| Rol | Fuente | Pesos | Uso |
|---|---|---|---|
| **Headings (hf)** | `Quicksand` | 700, 800, 900 | h1–h4, logotipo, labels, precios |
| **Body (bf)** | `Nunito` | 400, 600, 700 | Párrafos, navegación, footer |
| **Decorativa (alt)** | `Caveat` | 500, 600, 700 | Solo headings expresivos, citas — **nunca en cuerpo** |

### Jerarquía de tamaños

- **h1** (ScrollStory): `clamp(30px, 3.8vw, 54px)`, peso 900, `letter-spacing: -1px`
- **h2** (secciones): `clamp(28px, 4vw, 46px)`, peso 800, `letter-spacing: -0.5px`
- **h3** (tarjetas): `17–20px`, peso 700
- **Párrafos**: `clamp(13px, 1.1vw, 16px)`, peso 400
- **Kickers**: `12–13px`, peso 700, all-caps, `letter-spacing: 2px`
- **Precio**: `clamp(34px, 5vw, 52px)`, peso 900

### Tratamiento especial de texto (crayon text-shadow)

Aplicar a todos los `h1–h4` vía CSS global:
```css
h1, h2, h3, h4 {
  text-shadow: 0.5px 0 0 currentColor, -0.5px 0 0 currentColor,
               0 0.4px 0 currentColor, 0 -0.4px 0 currentColor;
  letter-spacing: -0.3px;
}
```
Esto simula el trazo doble del crayón sin distorsionar la legibilidad. Para texto de cuerpo NO se usa filtro ni text-shadow — solo la fuente.

## Filtros SVG — El corazón del efecto crayón

Los filtros están definidos en `<CrayonDefs/>` y deben renderizarse **una sola vez en la raíz** de cada página.

### `#cr` — Jitter geométrico
Distorsiona levemente la geometría de cualquier forma SVG. **Usar en:** bordes de tarjeta, íconos, botones, subrayados, círculos.
```xml
<filter id="cr">
  <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="2" result="n" seed="3"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="0.9" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

### `#cr-text` — Grano fractal para texto
Añade textura de crayón al texto sin distorsionar la forma. **Usar en:** logotipo, precio, hints de scroll. **NO usar en cuerpo de texto.**
```xml
<filter id="cr-text" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="2" result="noise"/>
  <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" result="grain"/>
  <feComposite in="grain" in2="SourceGraphic" operator="in" result="texturedGrain"/>
  <feMerge>
    <feMergeNode in="SourceGraphic"/>
    <feMergeNode in="texturedGrain"/>
  </feMerge>
</filter>
```

### `#crayon-fill` — Textura de trazo para rellenos
Simula la textura granulada del crayón pasado sobre papel. **Usar en:** relleno interno de botones (junto con `#cr`).

### Regla de aplicación de filtros

| Elemento | Filtro |
|---|---|
| Borde de tarjeta | `filter="url(#cr)"` en el `<rect>` |
| Íconos SVG | `style={{filter:'url(#cr)'}}` en el `<svg>` contenedor |
| Botones | `filter="url(#cr)"` + `url(#crayon-fill)` para textura interna |
| Subrayados | `filter="url(#cr)"` en el `<path>` |
| Texto especial | `filter: 'url(#cr-text)'` en elemento HTML |
| Texto de cuerpo | Sin filtro |

## Componentes UI

Todos los componentes están definidos en `components/crayon-v3.jsx`. Las secciones de página están en `components/sections-v3.jsx`.

### CrayonCard — Tarjeta base
Contenedor con borde SVG dibujado. **Nunca usa `border` CSS.**
- Props: `fill` (default `PALETTE.cream`), `stroke` (default `PALETTE.ink`), `sw` (grosor, default 3), `radius` (default 24), `padding` (default 24), `hoverLift` (default true)
- Hover: `translateY(-4px)`, transition `0.3s cubic-bezier(.4,0,.2,1)`

### CrayonButton — Botón
Pastilla SVG con `rx="22"`. **Nunca usa `border-radius` CSS.**
- Variantes por `fill`: Primario CTA = `PALETTE.heart`, Secundario = `PALETTE.cream`, Descarga = `PALETTE.leaf`, Neutro = `PALETTE.pot`
- Hover: `translateY(-2px) rotate(-0.5deg)` — sensación de presión física
- Tipografía: `font-size: 15px`, `font-weight: 700`, `letter-spacing: 0.3px`

### CrayonUnderline — Subrayado animado
Path SVG curvo que se dibuja al entrar al viewport (`stroke-dashoffset`, 0.9s).
- Colores por contexto: `PALETTE.heart` (producto/CTA), `PALETTE.leafDk` (personalidades), `PALETTE.pot` (variantes)

### HandIcon — Set de íconos
14 íconos SVG dibujados a mano en `48x48` viewBox. **Reemplazan emojis.**
- Tipos: `drop`, `chat`, `heart`, `bell`, `sun`, `thermo`, `cloud`, `leaf`, `sensor`, `arrow`, `sparkle`, `apple`, `play`, `send`
- Estilo: `stroke: PALETTE.ink`, `strokeWidth: 2–2.5`, `strokeLinecap: round`, `strokeLinejoin: round`
- Siempre con `filter="url(#cr)"` en el SVG contenedor

### CrayonPot — Maceta animada
SVG `100x105` viewBox con cara según prop `mood`: `happy`, `sleepy`, `drama`, `stern`. Incluye mejillas con `PALETTE.heart` al 35% de opacidad.

### RealPot — Foto real con overlay
Combina círculo SVG + foto `pot-real.png` + cara SVG superpuesta (mismos 4 moods).

### SpeechBubble — Bocadillo de diálogo
Path SVG con cola y `filter="url(#cr)"`. Fondo `PALETTE.cream`, borde `PALETTE.ink`. Texto interno: `11px`, peso `700`, fuente `bf`.

### Reveal — Animación de entrada
Wrapper con `IntersectionObserver` (threshold 0.12): fade + slide 24px, 0.8s, delay configurable.

### Nav — Navegación
- Altura `72px`, `position: fixed`
- Transparente → `rgba(250,241,218,0.92)` + `backdrop-filter: blur(10px)` al hacer scroll >40px
- Logo: `icon-crayon.png` + tipografía heading

## Sombras y bordes

### Reglas de bordes
- **Tarjetas y contenedores**: SIEMPRE `<rect>` SVG con `filter="url(#cr)"`. **Nunca `border` CSS con radio** en elementos que deban tener efecto crayón.
- Grosor estándar: `strokeWidth: 2.5–3px`
- Color: siempre `PALETTE.ink` (`#3D2817`)
- Divisores sutiles: `border: 1px solid ${PALETTE.ink}22`
- Divisor dashed: `border-top: 2px dashed ${PALETTE.ink}33`

### Reglas de sombras
Todas las sombras usan `rgba(61,40,23,…)` — **nunca negro puro.**
- Planta hero: `drop-shadow(0 8px 14px rgba(61,40,23,0.15)) drop-shadow(0 22px 36px rgba(61,40,23,0.22))`
- Imágenes de personalidades: `drop-shadow(0 4px 10px rgba(61,40,23,0.18))`
- Tarjetas: sin sombra — el borde SVG es suficiente

## Animaciones

### Easing estándar
Todo el proyecto usa un único easing: `cubic-bezier(.4, 0, .2, 1)` — la curva "standard" de Material Design.

### Keyframes globales
- `fadeUp` — entrada con slide (14px, opacity 0→1)
- `floatB` — flotación con rotación ±3deg, 4s infinito (bocadillos)
- `bounce` — rebote vertical, 2s infinito (scroll hint)
- `blink` — parpadeo (cursor)

### Comportamientos clave
- Hover de botón: `translateY(-2px) rotate(-0.5deg)`, 0.2s
- Hover de tarjeta: `translateY(-4px)`, 0.3s
- Reveal on scroll: `IntersectionObserver` + fade/slide, 0.8s
- CrayonUnderline: `stroke-dashoffset`, 0.9s
- ScrollStory: `position: sticky` 400vh, 4 beats con crossfade

## Reglas de oro (checklist mental)

Antes de crear o modificar cualquier elemento visual, verifica:

1. ☐ ¿Usa colores de `PALETTE`, no valores hex sueltos?
2. ☐ ¿Los bordes de elementos crayón son SVG con `filter="url(#cr)"`, no `border` CSS con radio?
3. ☐ ¿Las sombras usan `rgba(61,40,23,…)`, no negro puro?
4. ☐ ¿No hay emojis? (Usa `HandIcon` con el tipo que corresponda)
5. ☐ ¿El easing es `cubic-bezier(.4, 0, .2, 1)`?
6. ☐ ¿La tipografía respeta la jerarquía: Quicksand para headings, Nunito para body?
7. ☐ ¿Los textos de heading tienen el crayon text-shadow?
8. ☐ ¿La textura de fondo de papel (body::before + body::after) está presente?
9. ☐ ¿`<CrayonDefs/>` está renderizado en la raíz de la página?
10. ☐ ¿Los componentes se cargan en orden: `crayon-v3.jsx` → `sections-v3.jsx` → resto?

## Referencias

- Documento completo de diseño: `DESIGN-SYSTEM.md` en la raíz del proyecto
- Componentes base: `components/crayon-v3.jsx`
- Secciones de landing: `components/sections-v3.jsx`
- Panel de tweaks: `tweaks-panel.jsx`
- Guía del proyecto: `CLAUDE.md`

## Ejemplo rápido: crear una nueva sección

```jsx
// 1. Siempre importar PALETTE (ya está en window.PALETTE)
// 2. Usar CrayonCard como contenedor base
// 3. Usar CrayonButton para acciones (nunca <button> nativo con estilos)
// 4. Usar HandIcon en vez de emojis
// 5. Envolver en Reveal para animación de entrada

const MiNuevaSeccion = ({ t }) => (
  <section style={{padding: '80px 24px', position: 'relative'}}>
    <Reveal>
      <h2 style={{fontFamily: t.hf, fontWeight: 800, textAlign: 'center', marginBottom: 16}}>
        Título de la sección
      </h2>
      <CrayonUnderline color={PALETTE.heart} w="120px" />
    </Reveal>
    <Reveal delay={150}>
      <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} padding={32}>
        <p style={{fontFamily: t.bf, color: PALETTE.inkSoft}}>
          Contenido de la tarjeta...
        </p>
        <CrayonButton fill={PALETTE.heart} color={PALETTE.cream}>
          ¡Acción principal!
        </CrayonButton>
      </CrayonCard>
    </Reveal>
  </section>
);
```

## Tono emocional de marca

| Dimensión | Descripción |
|---|---|
| **Tono** | Cálido, cercano, ligeramente juguetón — no infantil, sino amigable |
| **Seriedad** | Balanceado: producto tech real con lenguaje visual accesible y emocional |
| **Sofisticación** | Media-alta — lo handmade es deliberado y cuidado, no descuidado |
| **Energía** | Tranquila con momentos de sorpresa — animaciones sutiles, humor en textos |
| **Arquetipo** | "El amigo creativo" — no premium frío, no infantil caótico |
| **Adjetivos** | Cálido · Artesanal · Expresivo · Cercano · Vivo |
