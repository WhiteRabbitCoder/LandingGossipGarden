# Configurar el Blog comunitario (Supabase)

El blog de Gossip Garden (`Blog.html` + `Publicacion.html`) es estático y usa
**Supabase** como backend gratuito para guardar publicaciones, comentarios,
"me gusta" y fotos — **sin necesidad de login**. Sigue estos pasos una sola vez.

Mientras no esté configurado, las páginas cargan con normalidad y muestran un
aviso amable de "El blog aún no está conectado".

---

## 1. Crear el proyecto en Supabase

1. Entra a <https://supabase.com> y crea una cuenta (plan gratuito).
2. **New project** → ponle nombre y contraseña a la base de datos → espera ~2 min.

## 2. Copiar las claves a `.env`

> El blog es un sitio aparte: vive en la carpeta **`blog/`** y se despliega en
> su propio dominio. Define ese enlace de vuelta al sitio principal en
> `blog/components/site-config.js` (`window.MAIN_SITE_URL`).

Las claves **no se hardcodean** en el código. Viven en un archivo `.env`
(ignorado por git) y desde ahí se genera `blog/components/supabase-config.js`.

1. En tu proyecto: **Project Settings → API**.
2. Copia el **Project URL** y la clave **anon public** (en *Project API keys*).
3. Crea tu `.env` a partir de la plantilla y rellénalo:

   ```bash
   cp .env.example .env
   # edita .env y pega tus valores (URL, ANON_KEY, y opcionalmente las secretas)
   ```

4. Genera el archivo de config que lee el navegador:

   ```bash
   ./scripts/gen-config.sh   # crea blog/components/supabase-config.js desde .env
   ```

> La `anon key` es **pública por diseño** (va al navegador y está protegida por
> RLS). Aun así, tanto `.env` como `blog/components/supabase-config.js` están en
> `.gitignore` para no versionar claves. Las variables **secretas**
> (`SUPABASE_SERVICE_ROLE_KEY`, contraseña en `SUPABASE_DB_URL`) viven solo en
> `.env` y **nunca** se inyectan al frontend.

## 3. Crear las tablas y políticas (SQL)

En el panel de Supabase: **SQL Editor → New query**, pega esto y pulsa **Run**:

```sql
-- POSTS
create table posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  author_name text not null default 'Anónimo',
  plant_name  text,
  personality text check (personality in ('alegre','dormilona','dramatica','exigente')),
  body        text not null,
  image_url   text,
  likes       int  not null default 0
);

-- COMMENTS (anidados vía parent_id autorreferenciado)
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id   uuid not null references posts(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamptz default now(),
  author_name text not null default 'Anónimo',
  body text not null
);

-- Like atómico sin login
create or replace function increment_likes(p_id uuid)
returns int language sql as $$
  update posts set likes = likes + 1 where id = p_id returning likes;
$$;

-- RLS: lectura pública + inserción anónima (blog abierto)
alter table posts    enable row level security;
alter table comments enable row level security;
create policy "read posts"      on posts    for select using (true);
create policy "insert posts"    on posts    for insert with check (true);
create policy "read comments"   on comments for select using (true);
create policy "insert comments" on comments for insert with check (true);
```

## 4. Crear el bucket de fotos (Storage)

1. **Storage → New bucket** → nombre exacto: `plant-photos` → marca **Public bucket** → **Create**.
2. Para permitir subir fotos (solo usuarios con sesión) y lectura pública, ve a
   **SQL Editor** y ejecuta:

   ```sql
   -- Subir fotos: solo usuarios autenticados
   create policy "gg upload plant-photos"
     on storage.objects for insert to authenticated
     with check (bucket_id = 'plant-photos');

   -- Lectura pública de las imágenes
   create policy "gg read plant-photos"
     on storage.objects for select to anon
     using (bucket_id = 'plant-photos');
   ```

   > Si marcaste el bucket como *Public*, la policy de lectura puede que ya
   > exista; si Supabase avisa de policy duplicada, ignóralo.

## 5. Activar el login (Supabase Auth)

Para **publicar y comentar** hay que iniciar sesión (email + contraseña). Los
"me gusta" siguen siendo libres. Las políticas RLS ya restringen la escritura a
usuarios autenticados.

1. **Authentication → Sign In / Providers → Email**: asegúrate de que el
   proveedor **Email** está habilitado.
2. **Confirmación de correo** (recomendado para pruebas): en esa misma pantalla
   (o en **Authentication → Settings**) **desactiva "Confirm email"**. Así, al
   registrarse, la persona entra de inmediato sin tener que confirmar.
   - Si lo dejas activado, Supabase envía un correo de confirmación (cuota
     limitada y puede caer en spam). Para producción, configura **SMTP** propio
     en **Authentication → Emails**.
3. Listo: en el blog, el botón **"+ Escribir"** y el formulario de comentarios
   piden iniciar sesión o registrarse mediante una ventana emergente.

## 6. Probar

Sirve la carpeta del blog por HTTP (no abras el archivo con `file://`).
Como el blog va en su propio dominio, sírvelo desde dentro de `blog/`:

```bash
cd blog
python3 -m http.server 8080
# abre http://localhost:8080/   (index.html es el feed)
```

- Crea una publicación con foto y personalidad → debe aparecer en el feed.
- Ábrela, comenta y responde un comentario → se ve la anidación.
- Dale "me gusta" → el contador sube y no permite repetir desde ese navegador.
- Recarga en una ventana de incógnito → todo sigue ahí (persistencia real).

---

## Notas

- **Moderación / spam:** el blog es abierto y anónimo. Hay validación mínima en
  el cliente y un *honeypot* anti-bots, pero no hay moderación de servidor. Para
  producción real conviene añadir captcha, rate limiting o aprobación manual.
- **Borrar contenido:** desde el panel de Supabase (**Table editor**) puedes
  eliminar filas de `posts`/`comments` manualmente.
- **Coste:** el plan gratuito de Supabase sobra para un blog pequeño.
