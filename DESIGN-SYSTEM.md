# Gossip Garden — Design System & Visual Identity

> Documento de referencia para el sistema de diseño del proyecto.  
> Generado a partir del código fuente en `components/crayon-v3.jsx` y `components/sections-v3.jsx`.

---

## Índice

1. [Estilo Visual General](#1-estilo-visual-general)
2. [Paleta de Colores](#2-paleta-de-colores)
3. [Tipografía](#3-tipografía)
4. [Filtros SVG — El corazón del efecto crayón](#4-filtros-svg--el-corazón-del-efecto-crayón)
5. [Ilustraciones y Personajes](#5-ilustraciones-y-personajes)
6. [Componentes UI](#6-componentes-ui)
7. [Sombras, Bordes y Contenedores](#7-sombras-bordes-y-contenedores)
8. [Animaciones y Microinteracciones](#8-animaciones-y-microinteracciones)
9. [Personalidad Visual de Marca](#9-personalidad-visual-de-marca)
10. [Referencias e Inspiraciones](#10-referencias-e-inspiraciones)
11. [Design Tokens — Quick Reference](#11-design-tokens--quick-reference)

---

## 1. Estilo Visual General

### Nombre del estilo: Crayon Storybook

El lenguaje visual de Gossip Garden combina cuatro influencias principales:

| Influencia | Cómo se aplica |
|---|---|
| **Ilustración de libro infantil** | Contornos marrón oscuro gruesos, rellenos planos, caras expresivas en personajes simples |
| **Efecto crayón / wax crayon** | Filtros SVG `feTurbulence` + `feDisplacementMap` que distorsionan levemente cada forma, imitando el temblor de una mano dibujando |
| **Textura de papel kraft** | Fondo `#FAF1DA` con dos capas de ruido fractal superpuestas (CSS `body::before` y `body::after`) que simulan el grano y las fibras del papel |
| **Storybook UI / Yoshi's Island** | Borde grueso oscuro, colores cálidos, personajes con mejillas rosadas, bocadillos de diálogo, subrayados dibujados a mano |

El resultado es un estilo **cálido, artesanal y deliberadamente imperfecto** — como si toda la interfaz hubiera sido dibujada con crayones sobre papel cuadriculado. La imperfección es la estética.

---

## 2. Paleta de Colores

### 2.1 Colores Base (PALETTE)

Estos son los únicos colores que deben usarse. Están definidos en `components/crayon-v3.jsx` como el objeto `PALETTE`. Nunca usar valores hex directos que existan aquí.

| Nombre | Variable | HEX | RGB | Uso principal |
|---|---|---|---|---|
| Cream Paper | `PALETTE.bg` | `#FAF1DA` | rgb(250, 241, 218) | Fondo global de toda la página |
| Cream Dark | `PALETTE.bgDark` | `#F0E2C0` | rgb(240, 226, 192) | Fondos alternativos, hover suave |
| Ink | `PALETTE.ink` | `#3D2817` | rgb(61, 40, 23) | Contornos, texto principal, bordes SVG |
| Ink Soft | `PALETTE.inkSoft` | `#6B4A2E` | rgb(107, 74, 46) | Texto secundario, párrafos, descripciones |
| Pot Orange | `PALETTE.pot` | `#E8A95C` | rgb(232, 169, 92) | Botones neutros, kicker de Variantes |
| Pot Dark | `PALETTE.potDk` | `#C68A40` | rgb(198, 138, 64) | Scrollbar thumb, texturas de maceta |
| Leaf Green | `PALETTE.leaf` | `#8AC553` | rgb(138, 197, 83) | Botón secundario, CTA de descarga, fondo CTA |
| Leaf Dark | `PALETTE.leafDk` | `#5FA037` | rgb(95, 160, 55) | Subrayados de sección, kickers, hojas |
| Heart Red | `PALETTE.heart` | `#E85D52` | rgb(232, 93, 82) | Botón "Comprar", CTA principal, rubor de cara |
| Cream Light | `PALETTE.cream` | `#FFF8E7` | rgb(255, 248, 231) | Fondo interior de tarjetas, texto en botón rojo |
| Shadow | `PALETTE.shadow` | `rgba(61,40,23, 0.08)` | — | Sombras suaves, halos |

### 2.2 Colores de Personalidades

Cada una de las cuatro personalidades tiene un color identitario. Se usan como fondos de tarjeta (con 25–40% de opacidad) y como subrayados.

| Personalidad | Planta | HEX | RGB | Carácter |
|---|---|---|---|---|
| Alegre | Girasol | `#F4D06F` | rgb(244, 208, 111) | Amarillo dorado, energético |
| Dormilona | Suculenta | `#B8C9E8` | rgb(184, 201, 232) | Azul suave, tranquilo |
| Dramática | Orquídea | `#E0B8E0` | rgb(224, 184, 224) | Lavanda, intenso |
| Exigente | Cactus | `#A8C88A` | rgb(168, 200, 138) | Verde sage, directo |

### 2.3 Colores de Variantes de Producto

Fondos de tarjeta para la sección "Elige la tuya".

| Variante | HEX fondo |
|---|---|
| Verde | `#E8F5E8` |
| Azul | `#EEF2FA` |
| Naranja | `#FDF3E8` |
| Rosado | `#FDF0F0` |

### 2.4 Colores Funcionales Adicionales

| Elemento | HEX | Contexto |
|---|---|---|
| Gota de agua (ícono `drop`) | `#9DC8E8` | Ícono de humedad |
| Área del gráfico histórico | `#F5C2C2` | ExigenteCard |
| Fondo circular de RealPot | `#A8D5A2` | Círculo detrás de la foto del producto |
| Sol y campana (íconos) | `#F4D06F` | Igual que Alegre |

### 2.5 Gradientes

| Nombre | CSS | Uso |
|---|---|---|
| Hero radial | `radial-gradient(circle at 50% 50%, #FFF8E7 0%, #FAF1DA 70%)` | Fondo de la sección ScrollStory sticky |
| Sombra de piso | `radial-gradient(ellipse at center, rgba(61,40,23,0.28) 0%, rgba(61,40,23,0) 70%)` + `blur(4px)` | Debajo de la planta en escena |

### 2.6 Regla de opacidades para color de tarjetas

Cuando se usa un color de personalidad como fondo de tarjeta, se aplica siempre con opacidad reducida en notación hexadecimal:

```
color + '40'  →  25% opacidad   (tarjetas de personalidad)
color + '30'  →  19% opacidad   (CTA card con PALETTE.leaf)
color + '20'  →  13% opacidad   (fondos internos secundarios)
```

---

## 3. Tipografía

### 3.1 Fuentes cargadas

```
https://fonts.googleapis.com/css2?
  family=Caveat:wght@500;600;700
  &family=Nunito:wght@400;500;600;700;800;900
  &family=Quicksand:wght@400;500;600;700
```

Las tres fuentes siempre se cargan juntas. El usuario puede alternar entre ellas desde el TweaksPanel.

---

### 3.2 Quicksand — Heading Font (hf)

| Atributo | Valor |
|---|---|
| Clasificación | Sans-serif geométrica redondeada |
| Personalidad | Juguetona, limpia, amigable, moderna sin ser fría |
| Pesos activos | `700` subtítulos · `800` títulos de sección · `900` precio |
| Letter-spacing | `-1px` en `h1` · `-0.5px` en `h2` · `+0.5px` en kickers |
| Uso | `h1`, `h2`, `h3`, labels de tarjeta, logotipo, nombre de marca |

**Tamaños por jerarquía:**

| Elemento | Tamaño CSS |
|---|---|
| h1 (ScrollStory) | `clamp(30px, 3.8vw, 54px)` |
| h2 (secciones) | `clamp(28px, 4vw, 46px)` |
| h3 (tarjetas) | `17–20px` |
| Label de tarjeta | `13–14px`, peso `800`, letter-spacing `0.5px` |
| Precio | `clamp(34px, 5vw, 52px)`, peso `900` |

---

### 3.3 Nunito — Body Font (bf)

| Atributo | Valor |
|---|---|
| Clasificación | Sans-serif redondeada con terminales circulares |
| Personalidad | Cálida, legible, redonda — complementa Quicksand sin competir |
| Pesos activos | `400` párrafos · `600` nav links · `700` labels, kickers |
| Letter-spacing | `2px` en kickers de sección · `0.3px` en botones |
| Uso | Párrafos de cuerpo, navegación, etiquetas, pies de foto, footer |

**Tamaños por uso:**

| Elemento | Tamaño CSS |
|---|---|
| Párrafo principal | `clamp(13px, 1.1vw, 16px)` |
| Párrafo sección | `clamp(14px, 1.4vw, 17px)` |
| Metadatos / trait | `11–12px` |
| Kicker de sección | `12–13px`, peso `700`, all-caps |
| Nav links | `14px`, peso `600` |
| Footer links | `13px`, peso normal |

---

### 3.4 Caveat — Alternativa decorativa (opcional)

| Atributo | Valor |
|---|---|
| Clasificación | Handwriting / caligrafía casual |
| Personalidad | Hecho a mano, espontáneo, diarístico |
| Pesos | `500, 600, 700` |
| Uso recomendado | Solo para headings cuando se quiere enfatizar "escrito a mano" — citas, mensajes de planta, experimentación. No usar en cuerpo de texto. |

---

### 3.5 Tratamiento especial de texto

**Crayon text-shadow** — aplicado a todos los `h1–h4` vía CSS global:

```css
h1, h2, h3, h4 {
  text-shadow:
    0.5px 0 0 currentColor,
   -0.5px 0 0 currentColor,
    0 0.4px 0 currentColor,
    0 -0.4px 0 currentColor;
  letter-spacing: -0.3px;
}
```

Esto simula el trazo doble del crayón sobre papel sin distorsionar la legibilidad.

**Filtro SVG `#cr-text`** — aplicado selectivamente (logotipo, precio, hint de scroll): añade grano fractal encima del texto.

---

## 4. Filtros SVG — El corazón del efecto crayón

Todos los filtros están definidos en el componente `<CrayonDefs/>` que debe renderizarse **una sola vez en la raíz** de cada página. Son la base técnica de toda la estética.

### `#cr` — Jitter geométrico

```xml
<filter id="cr">
  <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="2" result="n" seed="3"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="0.9"
    xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

**Uso:** Todas las formas SVG (bordes de tarjeta, íconos, botones, círculos, subrayados). Distorsiona la geometría para imitar el trazo físico imperfecto del crayón.

---

### `#cr-text` — Grano fractal para texto

```xml
<filter id="cr-text" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="2" result="noise"/>
  <feColorMatrix ... result="grain"/>
  <feComposite in="grain" in2="SourceGraphic" operator="in" result="texturedGrain"/>
  <feMerge>
    <feMergeNode in="SourceGraphic"/>
    <feMergeNode in="texturedGrain"/>
  </feMerge>
</filter>
```

**Uso:** Texto específico donde se quiere textura crayón sin distorsionar la forma (logotipo, precio, hint de scroll). No usar en cuerpo de texto larga.

---

### `#crayon-fill` — Textura de trazo para rellenos

```xml
<filter id="crayon-fill" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/>
  <feColorMatrix ... result="alpha"/>
  <feComposite in="alpha" in2="SourceGraphic" operator="in" result="texturedNoise"/>
  <feBlend in="SourceGraphic" in2="texturedNoise" mode="multiply"/>
</filter>
```

**Uso:** Rellenos de botones y formas sólidas para simular la textura granulada del crayón pasado sobre papel. Se superpone a `url(#cr)` en el SVG del botón.

---

### Regla de uso de filtros

| Elemento | Filtro |
|---|---|
| Borde de tarjeta | `filter="url(#cr)"` en el `<rect>` |
| Íconos SVG | `style={{filter:'url(#cr)'}}` en el `<svg>` contenedor |
| Botones | `filter="url(#cr)"` en el `<rect>` de forma + `url(#crayon-fill)` para textura interna |
| Subrayados | `filter="url(#cr)"` en el `<svg>` del path |
| Texto especial | `filter: 'url(#cr-text)'` en el elemento HTML |
| Texto de cuerpo | Sin filtro — el CSS text-shadow es suficiente |

---

## 5. Ilustraciones y Personajes

### 5.1 CrayonPot — Maceta animada

Componente SVG puro (`100x105` viewBox) con cara intercambiable según el prop `mood`.

**Anatomía:**
- Hojas laterales con `PALETTE.leaf` y `PALETTE.leafDk`
- Tallo central
- Cuerpo de maceta con `PALETTE.pot` (o `tint` personalizado)
- Rim de maceta
- Suelo con `#5C3D2E`
- Líneas de textura verticales con `PALETTE.potDk`
- Cara superpuesta sobre el cuerpo

**Estados de expresión:**

| Mood | Ojos | Boca |
|---|---|---|
| `happy` | Arcos curvados hacia arriba | Sonrisa amplia curva |
| `sleepy` | Líneas horizontales | Sonrisita suave |
| `drama` | Círculos llenos (`r=2`) | "O" pequeña |
| `stern` | Puntos pequeños (`r=1.2`) | Línea recta |

Todos los estados incluyen **mejillas**: `<ellipse>` con `PALETTE.heart` al `35%` de opacidad.

---

### 5.2 RealPot — Foto real con overlay

Combina tres capas:
1. Círculo SVG con color `tint` y `filter="url(#cr)"` + garabatos decorativos laterales
2. Imagen PNG real (`assets/pot-real.png`) con `object-fit: contain` y `drop-shadow` marrón
3. Cara SVG superpuesta en la zona inferior de la foto, con los mismos 4 estados de mood

---

### 5.3 HandIcon — Set de íconos

14 íconos SVG dibujados a mano, todos en `48x48` viewBox. Se aplica `filter="url(#cr)"` en el `<svg>` contenedor.

| Ícono | Descripción |
|---|---|
| `drop` | Gota de agua azul (`#9DC8E8`) con brillo blanco |
| `chat` | Bocadillo de diálogo con tres puntos |
| `heart` | Corazón relleno con `PALETTE.heart` |
| `bell` | Campana dorada (`#F4D06F`) |
| `sun` | Sol con 8 rayos |
| `thermo` | Termómetro con mercurio rojo |
| `cloud` | Nube para humedad de aire |
| `leaf` | Hoja verde con vena central |
| `sensor` | Plaquita con gráfica de línea |
| `arrow` | Flecha direccional |
| `sparkle` | Estrella de 4 puntas dorada |
| `apple` | Manzana con tallo |
| `play` | Triángulo play |
| `send` | Avión de papel |

**Estilo base de todos los íconos:**
- `stroke`: `PALETTE.ink` (`#3D2817`)
- `strokeWidth`: `2–2.5`
- `strokeLinecap`: `round`
- `strokeLinejoin`: `round`
- Sin relleno sólido en la mayoría — usan `PALETTE.cream` o colores temáticos suaves

---

### 5.4 SpeechBubble — Bocadillo de diálogo

Forma SVG con cola en la esquina inferior izquierda. El path tiene `filter="url(#cr)"` para el jitter. Fondo `PALETTE.cream`, borde `PALETTE.ink`.

Usado para mostrar las frases de personalidad de cada planta. El texto interno usa la fuente body (`bf`) en tamaño `11px`, peso `700`.

---

## 6. Componentes UI

### 6.1 CrayonCard — Tarjeta base

Contenedor con borde SVG dibujado. No usa `border` CSS.

| Prop | Default | Descripción |
|---|---|---|
| `fill` | `PALETTE.cream` | Color de relleno de la tarjeta |
| `stroke` | `PALETTE.ink` | Color del borde |
| `sw` | `3` | Grosor del borde (strokeWidth) |
| `radius` | `24` | Radio de esquinas |
| `padding` | `24` | Padding interno |
| `hoverLift` | `true` | Si se eleva 4px al hover |

**Comportamiento hover:** `translateY(-4px)`, `transition: 0.3s cubic-bezier(.4,0,.2,1)`

---

### 6.2 CrayonButton — Botón

Pastilla SVG (nunca `border-radius` CSS). El fondo es un `<rect rx="22">` con filtros de crayón.

**Variantes:**

| Variante | Fill | Stroke | Color texto | Uso |
|---|---|---|---|---|
| Primario CTA | `PALETTE.heart` | `PALETTE.ink` | `PALETTE.cream` | "Comprar", acción principal |
| Secundario | `PALETTE.cream` | `PALETTE.ink` | `PALETTE.ink` | "Ver la tienda", acción alternativa |
| Descarga | `PALETTE.leaf` | `PALETTE.ink` | `PALETTE.ink` | "Descargar app" |
| Neutro | `PALETTE.pot` | `PALETTE.ink` | `PALETTE.ink` | Acciones genéricas |

**Hover:** `translateY(-2px) rotate(-0.5deg)` — sensación de presión física como un sello.

**Tipografía interna:** `font-size: 15px`, `font-weight: 700`, `letter-spacing: 0.3px`.

---

### 6.3 CrayonUnderline — Subrayado animado

Path SVG curvo que se dibuja con `stroke-dashoffset` al entrar al viewport.

- Duración: `0.9s`
- Easing: `cubic-bezier(.4,0,.2,1)`
- Delay configurable para escalonar múltiples subrayados
- El color varía según la sección:
  - `PALETTE.heart` → secciones de producto y CTA
  - `PALETTE.leafDk` → sección de personalidades
  - `PALETTE.pot` → sección de variantes

---

### 6.4 Nav — Navegación

- Altura: `72px`, `position: fixed`
- Transparente al inicio → `rgba(250,241,218,0.92)` + `backdrop-filter: blur(10px)` al hacer scroll >40px
- Logo: `icon-crayon.png` + tipografía heading `Gossip\nGarden`
- Links: `14px`, peso `600`, color `PALETTE.ink`, sin subrayado CSS
- Botón CTA: `CrayonButton` con fill `PALETTE.heart`
- Mobile: hamburger que despliega menú vertical con fondo `rgba(250,241,218,0.98)`

---

### 6.5 Reveal — Animación de entrada

Wrapper de `IntersectionObserver` que añade fade + slide al entrar al 12% del viewport.

- Opacity: `0 → 1`
- Transform: `translateY(24px) → none`
- Duración: `0.8s`
- Easing: `cubic-bezier(.4,0,.2,1)`
- Delay configurable para escalonar items de grid

---

## 7. Sombras, Bordes y Contenedores

### 7.1 Bordes

| Contexto | Técnica |
|---|---|
| Tarjetas y contenedores | `<rect>` SVG con `filter="url(#cr)"` y `vectorEffect="non-scaling-stroke"` |
| Grosor estándar | `strokeWidth: 2.5–3px` |
| Color siempre | `PALETTE.ink` (#3D2817) |
| Divisores sutiles | `border: 1px solid ${PALETTE.ink}22` (5% opacidad) |
| Divisor dashed | `border-top: 2px dashed ${PALETTE.ink}33` — usado en footer |

**Nunca usar `border` CSS con radio en elementos que deban tener efecto crayón.** El border CSS no puede aplicar el filtro de jitter.

---

### 7.2 Sombras

Todas las sombras usan el tono marrón `rgba(61,40,23,…)` — nunca negro puro. Esto mantiene la calidez del papel.

| Tipo | CSS `filter` |
|---|---|
| Planta en escena (foto hero) | `drop-shadow(0 8px 14px rgba(61,40,23,0.15)) drop-shadow(0 22px 36px rgba(61,40,23,0.22))` |
| Imágenes de personalidades | `drop-shadow(0 4px 10px rgba(61,40,23,0.18))` |
| Sombra de piso (debajo de planta) | Div con `radial-gradient` elíptico + `blur(4px)`, posición `absolute bottom: -4%` |
| Tarjetas | Sin sombra — el borde SVG funciona como delimitador visual |

---

### 7.3 Radio de esquinas

| Elemento | `borderRadius` |
|---|---|
| Tarjetas grandes (CTA) | `32px` |
| Tarjetas estándar | `20–24px` |
| Íconos circulares (features) | `50%` |
| Botones pill | `22px` (via `rx/ry` en SVG) |
| Chips internos | `10–14px` |
| Scrollbar thumb | `4px` |

---

## 8. Animaciones y Microinteracciones

### 8.1 Keyframes globales (CSS)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes floatB {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50%       { transform: translateY(-10px) rotate(3deg); }
}

@keyframes bounce {
  0%, 100% { transform: translate(-50%, 0); }
  50%       { transform: translate(-50%, 8px); }
}

@keyframes blink {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
```

---

### 8.2 Tabla de animaciones

| Animación | Mecanismo | Duración | Descripción |
|---|---|---|---|
| **Reveal on scroll** | `IntersectionObserver` + opacity/transform | `0.8s` | Cada sección entra con fade + slide 24px al cruzar el 12% del viewport |
| **CrayonUnderline draw** | `stroke-dashoffset` animado | `0.9s` | El subrayado se "dibuja" al entrar al viewport |
| **ScrollStory** | `scroll` event + `position: sticky` (400vh) | Continua | Narrativa de 4 beats — planta y texto hacen crossfade conforme avanza el scroll |
| **Plant crossfade** | Interpolación de `opacity` + `translateY` | Continua | La planta entrante sube desde `200px` mientras la saliente se desvanece |
| **Speech bubble float** | `floatB` keyframe | `4s` infinito | Bocadillo sube/baja 10px con rotación ±3deg |
| **Scroll hint bounce** | `bounce` keyframe | `2s` infinito | Indicador "DESLIZA" rebota verticalmente |
| **Chat messages** | `setTimeout` escalonados | 400, 1400, 2600ms | Mensajes del chat de Dramática aparecen uno a uno |
| **PlantRotator** | `setInterval` cada 2800ms | `0.7s` cada transición | Las 4 variantes de planta hacen crossfade con scale `0.94→1` |
| **Button hover** | CSS transform | `0.2s` | `translateY(-2px) rotate(-0.5deg)` — sensación de presión física |
| **Card hover** | CSS transform | `0.3s` | `translateY(-4px)` — la tarjeta se eleva |
| **Nav blur** | `backdrop-filter` + `background` | `0.3s` | Aparece al hacer scroll >40px |
| **Progress dots** | Ancho + opacidad interpolados | Continua | Los puntos del ScrollStory se agrandan/iluminan según el beat activo |

---

### 8.3 Easing estándar

Todo el proyecto usa un único easing para coherencia:

```
cubic-bezier(.4, 0, .2, 1)
```

Este es el easing estándar de Material Design ("standard" curve). Produce movimientos que aceleran rápido y desaceleran suavemente, lo que se percibe como natural.

---

## 9. Personalidad Visual de Marca

| Dimensión | Descripción |
|---|---|
| **Tono emocional** | Cálido, cercano, ligeramente juguetón — no infantil, sino amigable |
| **Nivel de seriedad** | Balanceado: producto tecnológico real presentado con lenguaje visual accesible y emocional |
| **Sofisticación** | Media-alta — la estética handmade es deliberada y cuidada, no descuidada |
| **Energía** | Tranquila con momentos de sorpresa — animaciones sutiles, humor en los textos |
| **Arquetipo de marca** | "El amigo creativo" — no premium frío, no infantil caótico |
| **Adjetivos clave** | Cálido · Artesanal · Expresivo · Cercano · Vivo |

### Principios visuales que sostienen la personalidad

1. **La imperfección es intencional.** El jitter del crayón no es un defecto — es la firma del estilo.
2. **Todo tiene cara.** Los personajes son expresivos. La planta tiene emociones reales.
3. **El papel existe.** La textura de fondo no es decoración — es el material del mundo.
4. **Sin emojis. Nunca.** Todos los íconos son SVG dibujados a mano.
5. **El marrón oscuro (`#3D2817`) une todo.** Es el "tinte de crayón" que da coherencia.

---

## 10. Referencias e Inspiraciones

| Referencia | Conexión |
|---|---|
| **Yoshi's Island (SNES, 1995)** | Borde de crayón sobre formas, fondo papel cuadriculado, paleta crema/verde/rojo |
| **Kirby's Epic Yarn (Wii, 2010)** | Personajes simples con cara, calidez de materiales físicos, mundo hecho de objetos reales |
| **Ilustración infantil 70s–80s** | Contorno marrón grueso, rellenos planos, sin sombras complejas, expresiones faciales simples |
| **Notion / Linear (product UI)** | Grid limpio, jerarquía clara, navegación minimalista — la estructura subyacente es moderna |
| **Moleskine / Paper by WeTransfer** | La textura de papel como identidad de marca, no como decoración periférica |
| **Duolingo** | Mascota con estado emocional, gamificación del cuidado, personalidad de producto |
| **Wax crayon illustrations** | El efecto técnico central: SVG `feTurbulence` + `feDisplacementMap` imita el trazo físico |

---

## 11. Design Tokens — Quick Reference

Copia este bloque al inicio de cualquier componente nuevo.

```js
// ─── COLORES BASE ───────────────────────────────────────────────────────────
// Importar PALETTE desde crayon-v3.jsx (ya disponible en window.PALETTE)
//
// PALETTE.bg        '#FAF1DA'   fondo global
// PALETTE.cream     '#FFF8E7'   fondo tarjeta
// PALETTE.ink       '#3D2817'   todo lo oscuro
// PALETTE.inkSoft   '#6B4A2E'   texto secundario
// PALETTE.pot       '#E8A95C'   naranja neutro
// PALETTE.leaf      '#8AC553'   verde acción
// PALETTE.leafDk    '#5FA037'   verde oscuro / kickers
// PALETTE.heart     '#E85D52'   rojo CTA / acento emocional

// ─── COLORES DE PERSONALIDAD ────────────────────────────────────────────────
// Alegre      '#F4D06F'   amarillo dorado
// Dormilona   '#B8C9E8'   azul suave
// Dramática   '#E0B8E0'   lavanda
// Exigente    '#A8C88A'   verde sage

// ─── TIPOGRAFÍA ─────────────────────────────────────────────────────────────
// hf (headings):  'Quicksand'   — pesos 700, 800, 900
// bf (body):      'Nunito'      — pesos 400, 600, 700
// alt (decorativo):'Caveat'     — solo headings expresivos

// ─── FILTROS SVG (requieren <CrayonDefs/> en el root) ───────────────────────
// #cr           jitter geométrico → shapes, íconos, botones, subrayados
// #cr-text      grano fractal     → texto de énfasis (logo, precio)
// #crayon-fill  textura de trazo  → relleno interno de botones

// ─── RADIO DE ESQUINAS ──────────────────────────────────────────────────────
// CTA card:     32px
// Tarjetas:     20–24px
// Círculos:     50%
// Botones pill: 22px (SVG rx/ry)

// ─── EASING ESTÁNDAR ────────────────────────────────────────────────────────
// cubic-bezier(.4, 0, .2, 1)   — todo el proyecto

// ─── SOMBRAS ────────────────────────────────────────────────────────────────
// Drop shadow hero:  drop-shadow(0 8px 14px rgba(61,40,23,0.15))
//                    drop-shadow(0 22px 36px rgba(61,40,23,0.22))
// Drop shadow card:  drop-shadow(0 4px 10px rgba(61,40,23,0.18))
// Regla:             siempre rgba(61,40,23,…) — nunca negro puro
```

---

*Documento generado desde el código fuente del proyecto — mayo 2026.*
