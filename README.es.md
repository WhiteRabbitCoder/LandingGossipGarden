<div align="center">
  <img src="assets/icons/icon-crayon.png" width="120" alt="Gossip Garden Logo"/>
  <h1>Gossip Garden Landing</h1>
  
  <p>El centro de marketing y comunidad del ecosistema IoT Gossip Garden — una aplicación web estática construida en React, sin backend dedicado, que presenta macetas inteligentes, personalidades de IA y un foro comunitario integrado con Supabase.</p>

  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
    <img src="https://img.shields.io/badge/Babel-Standalone-F9DC3E?style=for-the-badge&logo=babel&logoColor=black" alt="Babel" />
    <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
</div>

---

## Tabla de Contenido

1. [Visión General del Ecosistema](#1-visión-general-del-ecosistema)
2. [Funciones de Gossip Garden Landing](#2-funciones-de-gossip-garden-landing)
3. [Arquitectura](#3-arquitectura)
4. [Stack Tecnológico](#4-stack-tecnológico)
5. [Estructura del Proyecto](#5-estructura-del-proyecto)
6. [Módulos Principales](#6-módulos-principales)
7. [Sub-sistema de Blog y Comunidad](#7-sub-sistema-de-blog-y-comunidad)
8. [Referencia de Flujo de Datos](#8-referencia-de-flujo-de-datos)
9. [Sistema de Diseño](#9-sistema-de-diseño)
10. [Términos Legales y Cumplimiento](#10-términos-legales-y-cumplimiento)
11. [Ejecutar el Sitio](#11-ejecutar-el-sitio)
12. [Variables de Entorno](#12-variables-de-entorno)
13. [Despliegue](#13-despliegue)

---

## 1. Visión General del Ecosistema

Gossip Garden es un producto IoT de monitoreo de plantas que integra hardware de sensores (ESP32), un backend en FastAPI, telemetría MQTT/HiveMQ y personalidades de Inteligencia Artificial. La página de aterrizaje actúa como el punto de entrada para los clientes, integrándose en el ecosistema más amplio a través de flujos informativos y participación en la comunidad.

```mermaid
graph TD
    Landing[Gossip Garden Landing<br>React Estático + CDN]
    Hardware[Maceta Gossip Garden<br>ESP32 + Sensores]
    Backend[Gossip Garden API<br>FastAPI + MongoDB]
    Community[Blog y Foro<br>Base de datos Supabase]

    Landing -->|Educa a Usuarios| Hardware
    Landing -->|Lee/Escribe Posts| Community
    Hardware -->|Telemetría MQTT| Backend
    Backend -->|Sincronización| Community
```

| Componente | Rol |
|---|---|
| **Sitio Landing (este repo)** | Escaparate de marketing, resumen de funcionalidades y términos de servicio. |
| **Blog y Foro** | Participación comunitaria, sub-sistema aislado utilizando Supabase. |
| **Maceta Inteligente (ESP32)** | Hardware físico con sensores DHT22, GY-30 y SEN0193. |
| **FastAPI Backend** | Ingesta de telemetría y motor de personalidad de IA. |

---

## 2. Funciones de Gossip Garden Landing

| Característica | Descripción |
|---|---|
| **Scroll Story Dinámico** | Una sección hero de 400vh que desplaza una secuencia de imágenes 3D de 100 fotogramas mediante GSAP ScrollTrigger con base en el scroll del usuario. |
| **Sistema de Componentes** | Una interfaz gráfica tipo crayón, cargada en el navegador, que genera filtros SVG únicos para un aspecto dibujado a mano. |
| **Panel de Ajustes en Vivo** | Un panel de edición de diseño integrado que utiliza `postMessage` para sincronizar variables y guardarlas en comentarios HTML. |
| **Integración FormSubmit** | Formularios de contacto sin backend propio que aprovechan FormSubmit para enviar correos sin requerir una API REST. |
| **Blog Autocontenido** | Un foro anidado diseñado para desplegarse en un dominio separado, respaldado por Supabase RLS. |
| **Documentación Legal** | Generación automática de índices y diseños estandarizados para las páginas de Privacidad y Términos, alineadas a las leyes colombianas. |

---

## 3. Arquitectura

### Ejecución en el Cliente

Este proyecto omite procesos de construcción en Node.js, favoreciendo una estrategia de compilación directa en el navegador para acelerar la iteración y el desarrollo.

```mermaid
graph LR
    HTML[index.html]
    CDN1[React 18 CDN]
    CDN2[Babel Standalone]
    JSX1[crayon-v3.jsx]
    JSX2[sections-v3.jsx]
    Render[DOM del Navegador]

    HTML --> CDN1
    HTML --> CDN2
    CDN1 --> Render
    CDN2 --> JSX1
    CDN2 --> JSX2
    JSX1 --> Render
    JSX2 --> Render
```

### Flujo de Datos

```mermaid
graph TD
    Client[Navegador de Usuario]
    Forms[FormSubmit.co]
    Supabase[Supabase PostgreSQL]
    Storage[Supabase Storage]

    Client -->|POST Datos Contacto| Forms
    Forms -->|Envío de Email| AdminEmail[Bandeja Administrador]
    
    Client -->|Autenticación y Posts| Supabase
    Client -->|Subida de Imágenes| Storage
    Supabase -->|Validación RLS| Client
```

---

## 4. Stack Tecnológico

### Frontend Principal

| Capa | Tecnología | Versión / Origen |
|---|---|---|
| Framework | React | 18 (CDN) |
| Transpilador | Babel Standalone | (CDN) |
| Animación | GSAP + ScrollTrigger | 3.x (CDN) |
| Estilos | CSS3 + Filtros SVG | Nativo |
| Iconos | SVGs Personalizados | Recursos Locales |

### Sub-sistema (Blog y Foro)

| Capa | Tecnología | Uso |
|---|---|---|
| Base de Datos | Supabase (PostgreSQL) | Publicaciones, Comentarios, Perfiles |
| Almacenamiento | Supabase Storage | Bucket `plant-photos` |
| Autenticación | Supabase Auth | Correo y Contraseña |
| Seguridad | Row Level Security (RLS) | Restricción de creación de entradas de `blog` solo a Administradores |

---

## 5. Estructura del Proyecto

```text
LandingGossipGarden/
├── index.html                      # Página de aterrizaje principal
├── personalities.html              # Detalle de personalidades de las plantas
├── store.html                      # Tienda de productos y variantes
├── how-it-works.html               # Explicación de las mecánicas IoT
├── privacy.html                    # Política de Privacidad (Legal)
├── terms.html                      # Términos y Condiciones (Legal)
├── components/
│   ├── crayon-v3.jsx               # Primitivas UI y Filtros SVG
│   ├── sections-v3.jsx             # Secciones de Página (Nav, Hero, Footer)
│   ├── tweaks-panel.jsx            # Panel de edición de diseño
│   └── legal.jsx                   # Componentes para páginas legales
├── blog/                           # Sitio comunitario autocontenido
│   ├── index.html                  # Feed del blog
│   ├── forum.html                  # Foro comunitario
│   ├── post.html                   # Vista de publicación individual
│   └── components/
│       ├── blog-data.jsx           # Capa de datos de Supabase y hooks
│       ├── blog-ui.jsx             # Componentes de UI específicos del blog
│       ├── site-config.js          # Variables de dominio
│       └── supabase-config.js      # Credenciales generadas
├── scripts/
│   └── gen-config.sh               # Generador en Bash para supabase-config.js
└── assets/
    ├── icons/                      # Iconos en estilo crayón
    ├── pots/                       # Recursos de imagen para macetas
    │   ├── pot360/                 # 100 fotogramas WebP para animación 360
    │   ├── animated/               # Rostros para crossfade animado
    │   └── faces/                  # Capas de emociones por color
    └── personalities/              # Collages de estado de ánimo
```

---

## 6. Módulos Principales

### Transpilación en el Navegador
Las páginas cargan React y Babel directamente de un CDN. Los archivos de componentes se incluyen usando `<script type="text/babel">`. Para evitar conflictos de caché durante el desarrollo, se añaden cadenas de consulta (`?v=...`) a las URL. El sistema de módulos se basa en adjuntar exportaciones al objeto global `window`.

### Sistema de Diseño Crayon (`crayon-v3.jsx`)
La interfaz utiliza filtros SVG exhaustivamente para lograr un diseño similar al de papel y crayón.
- `CrayonDefs`: Un componente raíz que inyecta etiquetas `<defs>` e IDs de filtros (`#cr`, `#cr-text`) al DOM.
- `PALETTE`: Un objeto constante accesible globalmente que define los colores de marca. El uso de códigos hexadecimales fuera de este objeto está prohibido.

### GSAP ScrollStory (`sections-v3.jsx`)
La sección principal en el index es un contenedor `400vh` que engloba cuatro tiempos narrativos.
- **Maceta360**: Un `<canvas>` que procesa una secuencia WebP de 100 fotogramas manejada por `ScrollTrigger` de GSAP.
- **Alineación Dinámica del Scroll**: Lectores de eventos interceptan la rueda del ratón para encajar (snap) perfectamente la navegación, garantizando transiciones suaves entre las personalidades (Alegre, Dormilona, Dramática, Exigente) sin solaparse.

### Panel de Ajustes (`tweaks-panel.jsx`)
Un panel flotante que permite la edición de variables de diseño, como fuentes y colores. Se comunica con el documento principal vía `postMessage` y guarda el estado en bloques de comentarios `/*EDITMODE-BEGIN*/`.

---

## 7. Sub-sistema de Blog y Comunidad

Ubicado dentro del directorio `blog/`, actúa como una aplicación completamente aislada diseñada para ser desplegada en un subdominio separado.

- **Capa de Datos (`blog-data.jsx`)**: Inicializa `window.ggDB` y maneja el CRUD para publicaciones, comentarios y likes, administrando también la sesión del usuario.
- **Seguridad RLS**: La base de datos garantiza seguridad por filas (RLS). Solo los usuarios autenticados pueden crear entradas en el foro. Además, una función `public.is_admin()` verifica los correos de los usuarios, limitando la publicación de artículos editoriales solo al personal administrativo.
- **Generación de Configuración**: `scripts/gen-config.sh` lee variables desde un `.env` local para generar el archivo `supabase-config.js`, manteniendo protegidas las claves maestras.

---

## 8. Referencia de Flujo de Datos

Como no hay un árbol de módulos ES moderno, el estado viaja a través del objeto `window` y propiedades de React.

### Dependencias Globales

| Módulo | Expone | Consumidor |
|---|---|---|
| `crayon-v3.jsx` | `PALETTE`, `CrayonCard`, `HandIcon` | Todos en `sections-v3.jsx` |
| `blog-data.jsx` | `fetchPosts`, `useAuth`, `window.ggDB` | `blog-ui.jsx` |
| `site-config.js` | `MAIN_SITE_URL`, `ADMIN_EMAILS` | `blog-data.jsx`, `blog-ui.jsx` |
| `tweaks-panel.jsx`| Hook `useTweaks` | Scripts locales en `index.html` |

### Flujo del Formulario de Contacto
1. El usuario interactúa con `ContactModal` (en `sections-v3.jsx`).
2. El componente agrupa la información (nombre, correo, asunto, mensaje).
3. La carga se envía vía `POST` a `https://formsubmit.co/ajax/` combinada con el `CONTACT_EMAIL`.
4. FormSubmit transfiere y notifica el mensaje a la bandeja principal.

---

## 9. Sistema de Diseño

La estética de Gossip Garden es estrictamente cálida, orgánica y dibujada a mano.

### Paleta de Colores

Los colores están controlados centralmente desde `PALETTE` y evitan apariencias genéricas o planos digitales puros.

| Token | Descripción | Uso |
|---|---|---|
| `paper` | Crema cálido | Fondo principal |
| `ink` | Café oscuro | Texto principal, contornos |
| `green`, `blue`, `purple`, `pink` | Colores de marca | Subrayados en crayón, acentos |
| `leafDk` | Verde profundo | Estados activos de navegación |

### Restricciones Visuales
- **Filtros SVG**: Todos los vectores dinámicos deben emplear `filter="url(#cr)"`.
- **Prohibición de Emojis**: Ninguna señal de UI puede utilizar emojis convencionales. Se debe utilizar la colección `HandIcon`.
- **Optimización WebP**: Imágenes intensivas en carga, como las secuencias de rotación en 360 grados, emplean recortes al centro en formato WebP para sostener alta fluidez de cuadros en el canvas.

---

## 10. Términos Legales y Cumplimiento

Las páginas `terms.html` y `privacy.html` integran el módulo `legal.jsx`.
- Éste expone un `LegalPage` que lee secciones en arreglo de objetos para generar una tabla de contenidos interactiva automática.
- Los detalles legales abordan las capacidades técnicas del IoT (recolección de telemetría de sensores, interacciones de IA) alineándose al estatuto de la Ley 1581 de 2012 de Protección de Datos de Colombia.

---

## 11. Ejecutar el Sitio

Debido a que depende de transpilación en navegador vía CDN, se requiere arrancar un servidor HTTP básico. Abrir el archivo directamente por la vía `file://` generará bloqueos por directivas CORS de Babel.

### Arrancar un Servidor Local

```bash
# Con Python 3
python3 -m http.server 8080

# Con Node.js
npx http-server -p 8080
```

Una vez desplegado, dirígete a `http://localhost:8080`.

---

## 12. Variables de Entorno

El núcleo de la página de aterrizaje no requiere variables de entorno. Sin embargo, el sub-sistema en la carpeta `blog/` requiere de un archivo `.env` en la raíz.

Crea un archivo `.env`:

```env
# Configuración Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon
SUPABASE_SERVICE_ROLE_KEY=tu-service-key
SUPABASE_DB_URL=postgresql://postgres:password@db.proyecto.supabase.co:5432/postgres
```

Ejecuta el script antes de lanzar el blog:

```bash
./scripts/gen-config.sh
```
Esto creará el archivo necesario `blog/components/supabase-config.js`, ocultando las claves críticas.

---

## 13. Despliegue

La plataforma en general puede integrarse con cualquier proveedor de páginas estáticas (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

Para desplegar el sub-sistema de la comunidad:
1. Aislar el contenido de la carpeta `blog/`.
2. Asegurar que `supabase-config.js` se genera durante la compilación CI/CD.
3. Montar la salida bajo un subdominio propio (ej. `blog.gossipgarden.co`).
