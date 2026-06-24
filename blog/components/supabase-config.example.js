/* ─────────────────────────────────────────────────────────────────────────
   PLANTILLA — no edites este archivo a mano.

   components/supabase-config.js se GENERA desde el .env con:
       ./scripts/gen-config.sh

   Está ignorado por git (contiene la anon key real). Solo se inyectan aquí
   las dos variables PÚBLICAS que el navegador necesita; las secretas
   (service_role, contraseña de DB) viven únicamente en el .env.
   ───────────────────────────────────────────────────────────────────────── */
window.SUPABASE_URL      = "TU_PROJECT_URL";       // p. ej. https://abcd1234.supabase.co
window.SUPABASE_ANON_KEY = "TU_ANON_PUBLIC_KEY";   // empieza por "eyJ..."
