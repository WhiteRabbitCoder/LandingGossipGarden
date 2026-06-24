/* ─────────────────────────────────────────────────────────────────────────
   Configuración de despliegue del BLOG (dominio aparte).

   MAIN_SITE_URL = URL del sitio principal de Gossip Garden. El menú y el
   footer del blog enlazan aquí. Cámbiala por tu dominio real cuando lo tengas
   (incluye https:// y SIN barra final).
   ───────────────────────────────────────────────────────────────────────── */
// EN LOCAL: ".." apunta a la carpeta del sitio principal (el blog vive en /blog).
// EN PRODUCCIÓN (dominio aparte): cámbialo por la URL absoluta, p. ej.
//   "https://gossipgarden.co"  (con https:// y SIN barra final).
window.MAIN_SITE_URL = "..";

// Correos con permiso para publicar ARTÍCULOS del blog (deben coincidir con la
// tabla 'admins' de Supabase). El foro lo puede usar cualquier usuario con sesión.
window.ADMIN_EMAILS = ["santigovanegas11@gmail.com"];

// Correo donde llegan los mensajes del formulario de contacto del footer.
window.CONTACT_EMAIL = "santigovanegas11@gmail.com";
