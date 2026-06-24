/* ═══════════════════════════════════════════════════════════════════════════
   blog-data.jsx — capa de datos del Blog comunitario (Supabase).

   Crea el cliente `window.ggDB` y expone helpers de lectura/escritura.
   Sin login: lectura pública + inserción anónima (protegido por RLS).
   Carga después de @supabase/supabase-js y de components/supabase-config.js.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ¿Están configuradas las claves? (si no, la UI muestra un aviso amable) */
const BLOG_CONFIGURED =
  typeof window.SUPABASE_URL === 'string' &&
  typeof window.SUPABASE_ANON_KEY === 'string' &&
  window.SUPABASE_URL.indexOf('http') === 0 &&
  window.SUPABASE_ANON_KEY !== 'TU_ANON_PUBLIC_KEY';

/* Cliente Supabase (null si no hay config válida) */
const ggDB = (BLOG_CONFIGURED && window.supabase)
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
  : null;

/* Error estándar cuando falta configuración */
const NOT_CONFIGURED = {
  configError: true,
  message: 'Blog sin configurar. Sigue los pasos de docs/BLOG-SETUP.md.',
};

/* ─── LECTURA ─────────────────────────────────────────────────────────────── */

async function fetchPosts({ personality, kind } = {}) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  let q = ggDB.from('posts').select('*').order('created_at', { ascending: false });
  if (kind) q = q.eq('kind', kind);
  if (personality) q = q.eq('personality', personality);
  const { data, error } = await q;
  return { data, error };
}

async function fetchPost(id) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  const { data, error } = await ggDB.from('posts').select('*').eq('id', id).single();
  return { data, error };
}

async function fetchComments(postId) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  const { data, error } = await ggDB
    .from('comments').select('*').eq('post_id', postId)
    .order('created_at', { ascending: true });
  return { data, error };
}

/* Cuenta de comentarios por post (para el feed) */
async function countComments(postId) {
  if (!ggDB) return 0;
  const { count } = await ggDB
    .from('comments').select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
  return count || 0;
}

/* ─── ESCRITURA ───────────────────────────────────────────────────────────── */

async function createPost({ title, author_name, plant_name, personality, body, image_url, kind }) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  const row = {
    kind:        kind === 'blog' ? 'blog' : 'foro',
    title:       (title || '').trim() || null,
    author_name: (author_name || '').trim() || 'Anónimo',
    plant_name:  (plant_name || '').trim() || null,
    personality: personality || null,
    body:        (body || '').trim(),
    image_url:   image_url || null,
  };
  const { data, error } = await ggDB.from('posts').insert(row).select().single();
  return { data, error };
}

async function createComment({ post_id, parent_id, author_name, body }) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  const row = {
    post_id,
    parent_id: parent_id || null,
    author_name: (author_name || '').trim() || 'Anónimo',
    body: (body || '').trim(),
  };
  const { data, error } = await ggDB.from('comments').insert(row).select().single();
  return { data, error };
}

/* ─── ME GUSTA (sin login, anti-doble-like por navegador con localStorage) ── */

const LIKED_KEY = 'gg_liked_posts';

function likedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')); }
  catch (e) { return new Set(); }
}
function hasLiked(id) { return likedSet().has(id); }

async function likePost(id) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  if (hasLiked(id)) return { data: null, error: { message: 'Ya diste me gusta.' } };
  const { data, error } = await ggDB.rpc('increment_likes', { p_id: id });
  if (!error) {
    const s = likedSet(); s.add(id);
    try { localStorage.setItem(LIKED_KEY, JSON.stringify([...s])); } catch (e) {}
  }
  return { data, error }; // data = nuevo total de likes
}

/* ─── SUBIDA DE IMÁGENES (Storage bucket público 'plant-photos') ──────────── */

async function uploadImage(file) {
  if (!ggDB) return { url: null, error: NOT_CONFIGURED };
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await ggDB.storage.from('plant-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) return { url: null, error };
  const { data } = ggDB.storage.from('plant-photos').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/* ─── AUTENTICACIÓN (Supabase Auth: email + contraseña) ───────────────────── */

async function signUp(email, password, name) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  return ggDB.auth.signUp({ email: (email || '').trim(), password, options: { data: { name: (name || '').trim() } } });
}

async function signIn(email, password) {
  if (!ggDB) return { data: null, error: NOT_CONFIGURED };
  return ggDB.auth.signInWithPassword({ email: (email || '').trim(), password });
}

async function signOut() {
  if (!ggDB) return { error: NOT_CONFIGURED };
  return ggDB.auth.signOut();
}

/* ¿El usuario es administrador? (lista en site-config window.ADMIN_EMAILS) */
function isAdmin(user) {
  if (!user || !user.email) return false;
  const list = window.ADMIN_EMAILS || [];
  return list.map(e => (e || '').toLowerCase()).includes(user.email.toLowerCase());
}

/* Nombre visible del usuario: el que puso al registrarse o el prefijo del email */
function userName(user) {
  if (!user) return 'Usuario';
  return (user.user_metadata && user.user_metadata.name) || (user.email || '').split('@')[0] || 'Usuario';
}

/* Hook de sesión: devuelve undefined (cargando), null (invitado) o el user */
function useAuth() {
  const [user, setUser] = React.useState(undefined);
  React.useEffect(() => {
    if (!ggDB) { setUser(null); return; }
    ggDB.auth.getSession().then(({ data }) => setUser((data.session && data.session.user) || null));
    const { data: sub } = ggDB.auth.onAuthStateChange((_e, session) => setUser((session && session.user) || null));
    return () => { try { sub.subscription.unsubscribe(); } catch (e) {} };
  }, []);
  return user;
}

/* ─── UTILIDAD: fecha relativa en español ─────────────────────────────────── */

function timeAgo(iso) {
  const d = new Date(iso), now = new Date();
  const s = Math.floor((now - d) / 1000);
  if (s < 60) return 'hace un momento';
  const m = Math.floor(s / 60); if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60); if (h < 24) return `hace ${h} h`;
  const days = Math.floor(h / 24); if (days < 7) return `hace ${days} d`;
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Fecha larga estilo periódico: "24 de junio de 2026" */
function dateLong(iso) {
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* Tiempo de lectura estimado (~200 palabras/min) */
function readingTime(body) {
  const words = (body || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* Titular: usa el título; si no, el nombre de la planta; si no, un extracto del cuerpo */
function postHeadline(post) {
  if (post.title && post.title.trim()) return post.title.trim();
  if (post.plant_name && post.plant_name.trim()) return post.plant_name.trim();
  const b = (post.body || '').trim();
  const words = b.split(/\s+/).slice(0, 9).join(' ');
  return words + (b.split(/\s+/).length > 9 ? '…' : '');
}

Object.assign(window, {
  ggDB, BLOG_CONFIGURED,
  fetchPosts, fetchPost, fetchComments, countComments,
  createPost, createComment,
  likePost, hasLiked, uploadImage, timeAgo, dateLong, readingTime, postHeadline,
  signUp, signIn, signOut, userName, useAuth, isAdmin,
});
