/* ═══════════════════════════════════════════════════════════════════════════
   blog-ui.jsx — componentes de UI del Blog comunitario (estilo crayón).
   Reutilizados por blog/index.html y blog/post.html.
   Depende de: crayon-v3.jsx (PALETTE, CrayonCard, CrayonButton, CrayonUnderline,
   SpeechBubble, HandIcon, Reveal) y blog-data.jsx (helpers).
   ═══════════════════════════════════════════════════════════════════════════ */
const P = window.PALETTE;

/* Personalidades: mismos colores que Personalidades.html */
const PERSONA_META = {
  alegre:    { label: 'Alegre',    color: '#A8D5A2', bg: '#F0FAF0' },
  dormilona: { label: 'Dormilona', color: '#B8C9E8', bg: '#EEF2FA' },
  dramatica: { label: 'Dramática', color: '#E0B8E0', bg: '#FAF0FA' },
  exigente:  { label: 'Exigente',  color: '#F5C2C2', bg: '#FDF0F0' },
};
const PERSONA_KEYS = ['alegre', 'dormilona', 'dramatica', 'exigente'];

/* ─── Pestañas Blog | Foro ─────────────────────────────────────────────────── */
const SectionTabs = ({ t, active }) => {
  const tabs = [{ l: 'Blog', href: 'index.html', key: 'blog' }, { l: 'Foro', href: 'foro.html', key: 'foro' }];
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
      {tabs.map(tab => {
        const on = active === tab.key;
        return (
          <a key={tab.key} href={tab.href} style={{
            fontFamily: t.hf, fontWeight: 800, fontSize: 15, textDecoration: 'none', padding: '8px 22px',
            borderRadius: 20, border: `2px solid ${P.ink}`, background: on ? P.heart : P.cream,
            color: on ? P.cream : P.ink, boxShadow: on ? `2px 2px 0 ${P.ink}` : 'none' }}>{tab.l}</a>
        );
      })}
    </div>
  );
};

/* ─── Masthead único: logo al lado de "El Jardín" + pestañas + enlaces ─────── */
const BlogMasthead = ({ t, dateText, subtitle, section }) => {
  const MAIN = (window.MAIN_SITE_URL || '').replace(/\/$/, '');
  const links = [
    { l: 'Inicio', href: MAIN || '#' },
    { l: 'Cómo funciona', href: `${MAIN}/Como funciona.html` },
    { l: 'Personalidades', href: `${MAIN}/Personalidades.html` },
    { l: 'Tienda', href: `${MAIN}/Tienda.html` },
  ];
  return (
    <header style={{ padding: '42px clamp(20px,5vw,48px) 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', borderBottom: `2px solid ${P.ink}`, paddingBottom: 22 }}>
        {dateText && <div style={{ fontFamily: t.bf, fontSize: 11.5, fontWeight: 800, letterSpacing: '2px', color: P.heart, textTransform: 'uppercase', marginBottom: 12 }}>{dateText}</div>}
        <a href="index.html" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px,2vw,22px)', textDecoration: 'none', flexWrap: 'wrap' }}>
          <img src="assets/icons/icon-crayon.png" alt="Gossip Garden" style={{ width: 'clamp(58px,8vw,96px)', height: 'auto', objectFit: 'contain' }} />
          <span style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 'clamp(34px,6vw,58px)', color: P.ink, lineHeight: .95, letterSpacing: '-1px', filter: 'url(#cr-text)' }}>El Jardín</span>
        </a>
        {section && <SectionTabs t={t} active={section} />}
        {subtitle && <p style={{ fontFamily: t.bf, fontSize: 'clamp(13px,1.3vw,15px)', color: P.inkSoft, marginTop: 14, opacity: .85 }}>{subtitle}</p>}
        <nav style={{ marginTop: 14, display: 'flex', gap: 'clamp(14px,3vw,30px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {links.map(({ l, href }) => (
            <a key={l} href={href} style={{ fontFamily: t.bf, fontSize: 12, fontWeight: 700, color: P.inkSoft, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.8px', opacity: .85 }}>{l}</a>
          ))}
        </nav>
      </div>
    </header>
  );
};

/* ─── Píldora de personalidad ─────────────────────────────────────────────── */
const PersonaTag = ({ k, active, onClick, t }) => {
  const m = PERSONA_META[k];
  if (!m) return null;
  const clickable = typeof onClick === 'function';
  return (
    <span onClick={onClick} style={{
      fontFamily: t.bf, fontSize: 12, fontWeight: 700, padding: '5px 13px', borderRadius: 20,
      background: active ? m.color : `${m.color}80`, border: `1.5px solid ${P.ink}`, color: P.ink,
      cursor: clickable ? 'pointer' : 'default', userSelect: 'none', display: 'inline-block',
      boxShadow: active ? `2px 2px 0 ${P.ink}` : 'none', transition: 'all .15s' }}>
      {m.label}
    </span>
  );
};

/* ─── Avatar: inicial en círculo crayón ───────────────────────────────────── */
const Avatar = ({ name, size = 38 }) => {
  const initial = (name || 'A').trim().charAt(0).toUpperCase();
  return (
    <div style={{ width: size, height: size, flexShrink: 0, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill={P.pot} stroke={P.ink} strokeWidth="2.5" filter="url(#cr)" />
      </svg>
      <span style={{ position: 'relative', zIndex: 1, fontWeight: 800, color: P.ink, fontSize: size * 0.42 }}>{initial}</span>
    </div>
  );
};

/* ─── Botón de me gusta (corazón crayón) ──────────────────────────────────── */
const LikeButton = ({ id, count, t }) => {
  const [n, setN] = React.useState(count || 0);
  const [liked, setLiked] = React.useState(() => window.hasLiked(id));
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { setN(count || 0); }, [count]);
  const onLike = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (liked || busy) return;
    setBusy(true);
    const { data, error } = await window.likePost(id);
    if (!error) { setN(typeof data === 'number' ? data : n + 1); setLiked(true); }
    setBusy(false);
  };
  return (
    <button onClick={onLike} disabled={liked} title={liked ? 'Ya te gusta' : 'Me gusta'} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
      cursor: liked ? 'default' : 'pointer', fontFamily: t.bf, fontWeight: 700, color: P.inkSoft, padding: 4 }}>
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M12 21s-7.5-4.7-10-9.3C.6 9 1.6 5.6 4.6 4.7c2-.6 3.9.4 4.9 1.9 1-1.5 2.9-2.5 4.9-1.9 3 .9 4 4.3 2.6 7C19.5 16.3 12 21 12 21z"
          fill={liked ? P.heart : 'none'} stroke={P.heart} strokeWidth="2" strokeLinejoin="round" filter="url(#cr)" />
      </svg>
      <span>{n}</span>
    </button>
  );
};

/* ─── Aviso de configuración faltante ─────────────────────────────────────── */
const ConfigNotice = ({ t }) => (
  <CrayonCard fill={`${P.pot}22`} stroke={P.ink} sw={2.5} radius={22} padding={28} style={{ maxWidth: 620, margin: '0 auto' }}>
    <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 20, color: P.ink, marginBottom: 8 }}>El blog aún no está conectado</h3>
    <p style={{ fontFamily: t.bf, fontSize: 14.5, color: P.inkSoft, lineHeight: 1.6 }}>
      Para que las publicaciones se compartan entre visitantes hay que configurar Supabase.
      Sigue los pasos de <b>docs/BLOG-SETUP.md</b> y pega tus claves en <b>components/supabase-config.js</b>.
    </p>
  </CrayonCard>
);

/* ─── Modal de inicio de sesión / registro (Supabase Auth) ────────────────── */
const AuthModal = ({ t, onClose, onAuthed }) => {
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [name, setName] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const [ok, setOk] = React.useState(null);
  const fs = { width: '100%', fontFamily: t.bf, fontSize: 14.5, color: P.ink, background: P.cream, border: `2px solid ${P.ink}`, borderRadius: 14, padding: '10px 14px', outline: 'none' };
  const submit = async (e) => {
    e.preventDefault(); setMsg(null); setOk(null);
    if (!email || !pass) { setMsg('Completa correo y contraseña.'); return; }
    setBusy(true);
    if (mode === 'login') {
      const { error } = await window.signIn(email, pass);
      setBusy(false);
      if (error) { setMsg('No se pudo entrar. Revisa tu correo y contraseña.'); return; }
      onAuthed && onAuthed();
    } else {
      if (pass.length < 6) { setMsg('La contraseña debe tener al menos 6 caracteres.'); setBusy(false); return; }
      const { data, error } = await window.signUp(email, pass, name);
      setBusy(false);
      if (error) { setMsg(error.message || 'No se pudo registrar.'); return; }
      if (data && data.session) onAuthed && onAuthed();
      else setOk('¡Cuenta creada! Revisa tu correo para confirmarla y luego inicia sesión.');
    }
  };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(61,40,23,.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400 }}>
        <CrayonCard fill={P.cream} stroke={P.ink} sw={3} radius={24} padding={28} hoverLift={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <h3 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 22, color: P.ink }}>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 26, lineHeight: 1, cursor: 'pointer', color: P.inkSoft }}>×</button>
          </div>
          <p style={{ fontFamily: t.bf, fontSize: 13.5, color: P.inkSoft, opacity: .8, marginBottom: 16 }}>Necesitas una cuenta para publicar y comentar en El Jardín.</p>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'register' && <input style={fs} placeholder="Tu nombre" value={name} maxLength={40} onChange={e => setName(e.target.value)} />}
            <input style={fs} type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={fs} type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} />
            <CrayonButton fill={P.heart} stroke={P.ink} color={P.cream} style={{ opacity: busy ? .6 : 1 }}>{busy ? 'Un momento…' : (mode === 'login' ? 'Entrar' : 'Registrarme')}</CrayonButton>
            {msg && <div style={{ fontFamily: t.bf, fontSize: 13, color: P.heart, fontWeight: 700 }}>{msg}</div>}
            {ok && <div style={{ fontFamily: t.bf, fontSize: 13, color: P.leafDk, fontWeight: 700 }}>{ok}</div>}
          </form>
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMsg(null); setOk(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: t.bf, fontSize: 13, color: P.inkSoft, marginTop: 16, padding: 0 }}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <b style={{ color: P.heart }}>{mode === 'login' ? 'Regístrate' : 'Inicia sesión'}</b>
          </button>
        </CrayonCard>
      </div>
    </div>
  );
};

/* ─── Control de cuenta (barra de acciones / masthead) ────────────────────── */
const AccountControl = ({ t, user, onLogin }) => {
  if (user === undefined) return null;
  if (!user) return <CrayonButton fill={P.cream} stroke={P.ink} onClick={onLogin}>Iniciar sesión</CrayonButton>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar name={window.userName(user)} size={30} />
      <span style={{ fontFamily: t.bf, fontWeight: 700, fontSize: 13.5, color: P.ink }}>{window.userName(user)}</span>
      <button onClick={() => window.signOut()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: t.bf, fontWeight: 700, fontSize: 12.5, color: P.heart, padding: '4px 2px' }}>Salir</button>
    </div>
  );
};

/* ─── Encabezado de sección estilo periódico (regla superior + título) ────── */
const SectionHeading = ({ children, t }) => (
  <div style={{ borderTop: `3px solid ${P.ink}`, paddingTop: 10, marginBottom: 18 }}>
    <h2 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 22, color: P.ink, letterSpacing: '-.3px' }}>{children}</h2>
  </div>
);

/* ─── Etiqueta de categoría (personalidad) en versalitas ──────────────────── */
const CategoryLabel = ({ post, t }) => {
  const m = post.personality ? PERSONA_META[post.personality] : null;
  const label = m ? m.label : 'Comunidad';
  const color = m ? m.color : P.leaf;
  return (
    <span style={{ fontFamily: t.bf, fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: P.inkSoft, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, border: `1.5px solid ${P.ink}`, flexShrink: 0 }} />
      {label}
    </span>
  );
};

/* Metadatos compactos: autor · tiempo · lectura */
const PostMeta = ({ post, t }) => (
  <div style={{ fontFamily: t.bf, fontSize: 12, color: P.inkSoft, opacity: .8, marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    <span>Por <b style={{ color: P.ink }}>{post.author_name}</b></span>
    <span>·</span><span>{window.timeAgo(post.created_at)}</span>
    <span>·</span><span>{window.readingTime(post.body)} min de lectura</span>
  </div>
);

/* ─── Tarjeta de publicación (feed, estilo revista) ───────────────────────── */
const PostCard = ({ post, t }) => {
  const m = post.personality ? PERSONA_META[post.personality] : null;
  const tint = m ? m.color : P.leaf;
  const href = `post.html?id=${post.id}`;
  return (
    <a href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <CrayonCard fill={P.cream} stroke={P.ink} sw={2.5} radius={20} padding={0} hover style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {post.image_url && (
          <div style={{ borderBottom: `2px solid ${P.ink}`, height: 185, background: `${tint}2e`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
            <img src={post.image_url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
        )}
        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <CategoryLabel post={post} t={t} />
          <h3 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 19, lineHeight: 1.18, color: P.ink, margin: '8px 0 8px' }}>{window.postHeadline(post)}</h3>
          <p style={{ fontFamily: t.bf, fontSize: 14, color: P.inkSoft, lineHeight: 1.55, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.body}</p>
          <div style={{ marginTop: 'auto' }}>
            <PostMeta post={post} t={t} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1.5px dashed ${P.ink}33` }}>
              <LikeButton id={post.id} count={post.likes} t={t} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: t.bf, fontWeight: 700, fontSize: 13, color: P.inkSoft }}>
                <svg width="19" height="19" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-4 4v-4H4z" fill="none" stroke={P.inkSoft} strokeWidth="2" strokeLinejoin="round" filter="url(#cr)" /></svg>
                {post.comment_count != null ? post.comment_count : '—'}
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: t.bf, fontWeight: 700, fontSize: 13, color: P.heart }}>Leer →</span>
            </div>
          </div>
        </div>
      </CrayonCard>
    </a>
  );
};

/* ─── Destacado: publicación principal grande (imagen + texto) ────────────── */
const FeaturedCard = ({ post, t }) => {
  const m = post.personality ? PERSONA_META[post.personality] : null;
  const href = `post.html?id=${post.id}`;
  return (
    <a href={href} style={{ textDecoration: 'none', display: 'block', marginBottom: 26 }}>
      <CrayonCard fill={P.cream} stroke={P.ink} sw={3} radius={22} padding={0} hover style={{ overflow: 'hidden' }}>
        <div className="gg-feat">
          <div className="gg-feat-img" style={{ background: `${m ? m.color : P.leaf}2e`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 280 }}>
            {post.image_url && <img src={post.image_url} alt="" style={{ maxWidth: '100%', maxHeight: 330, objectFit: 'contain', display: 'block' }} />}
          </div>
          <div style={{ padding: 'clamp(22px,3vw,32px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CategoryLabel post={post} t={t} />
            <h2 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 'clamp(23px,2.7vw,32px)', lineHeight: 1.1, color: P.ink, margin: '10px 0 12px', letterSpacing: '-.4px' }}>{window.postHeadline(post)}</h2>
            <p style={{ fontFamily: t.bf, fontSize: 15.5, color: P.inkSoft, lineHeight: 1.6, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.body}</p>
            <PostMeta post={post} t={t} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
              <LikeButton id={post.id} count={post.likes} t={t} />
              <span style={{ fontFamily: t.bf, fontWeight: 700, fontSize: 14, color: P.heart }}>Leer publicación →</span>
            </div>
          </div>
        </div>
      </CrayonCard>
    </a>
  );
};

/* ─── Barra lateral: tendencia (lista numerada por me gusta) ───────────────── */
const TrendingList = ({ posts, t }) => {
  const top = [...posts]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0) || (b.comment_count || 0) - (a.comment_count || 0))
    .slice(0, 5);
  if (!top.length) return <p style={{ fontFamily: t.bf, fontSize: 14, color: P.inkSoft, opacity: .7 }}>Aún no hay tendencias.</p>;
  return (
    <div>
      {top.map((p, i) => (
        <a key={p.id} href={`post.html?id=${p.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, padding: '16px 0', borderTop: i ? `1.5px dashed ${P.ink}22` : 'none' }}>
          <span style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 30, color: P.heart, lineHeight: 1, minWidth: 26, opacity: .9 }}>{i + 1}</span>
          <div style={{ minWidth: 0 }}>
            <CategoryLabel post={p} t={t} />
            <h4 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 16, lineHeight: 1.25, color: P.ink, margin: '5px 0 5px' }}>{window.postHeadline(p)}</h4>
            <div style={{ fontFamily: t.bf, fontSize: 12, color: P.inkSoft, opacity: .8 }}>{(p.likes || 0)} me gusta · {window.readingTime(p.body)} min</div>
          </div>
        </a>
      ))}
    </div>
  );
};

/* ─── Input/Textarea con estilo crayón coherente ──────────────────────────── */
const fieldStyle = (t) => ({
  width: '100%', fontFamily: t.bf, fontSize: 14.5, color: P.ink, background: P.cream,
  border: `2px solid ${P.ink}`, borderRadius: 14, padding: '10px 14px', outline: 'none',
});

/* ─── Formulario de publicación ───────────────────────────────────────────── */
const PostForm = ({ t, onCreated, user, kind }) => {
  const [title, setTitle] = React.useState('');
  const [plant, setPlant] = React.useState('');
  const [persona, setPersona] = React.useState(null);
  const [body, setBody] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [hp, setHp] = React.useState(''); // honeypot
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const pickFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setErr('La imagen supera 5 MB.'); return; }
    setErr(null); setFile(f); setPreview(URL.createObjectURL(f));
  };
  const submit = async (e) => {
    e.preventDefault();
    if (hp) return; // bot
    if (body.trim().length < 3) { setErr('Escribe un poco más en tu publicación.'); return; }
    setBusy(true); setErr(null);
    let image_url = null;
    if (file) {
      const up = await window.uploadImage(file);
      if (up.error) { setErr('No se pudo subir la imagen. ' + (up.error.message || '')); setBusy(false); return; }
      image_url = up.url;
    }
    const { data, error } = await window.createPost({ kind, title, author_name: window.userName(user), plant_name: plant, personality: persona, body, image_url });
    setBusy(false);
    if (error) { setErr(error.message || 'No se pudo publicar.'); return; }
    setTitle(''); setPlant(''); setPersona(null); setBody(''); setFile(null); setPreview(null);
    if (onCreated) onCreated(data);
  };

  return (
    <CrayonCard fill={P.cream} stroke={P.ink} sw={3} radius={24} padding={24}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 20, color: P.ink }}>{kind === 'blog' ? 'Escribir artículo' : 'Comparte tu planta'}</h3>
        <span style={{ fontFamily: t.bf, fontSize: 12.5, color: P.inkSoft, opacity: .8 }}>Publicas como <b style={{ color: P.ink }}>{window.userName(user)}</b></span>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input style={{ ...fieldStyle(t), fontSize: 16, fontWeight: 700 }} placeholder="Título de tu publicación" value={title} maxLength={90} onChange={e => setTitle(e.target.value)} />
        <input style={{ ...fieldStyle(t) }} placeholder="Nombre de tu planta (opcional)" value={plant} maxLength={40} onChange={e => setPlant(e.target.value)} />
        <div>
          <div style={{ fontFamily: t.bf, fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: P.ink, opacity: .6, marginBottom: 8 }}>PERSONALIDAD (OPCIONAL)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PERSONA_KEYS.map(k => <PersonaTag key={k} k={k} active={persona === k} onClick={() => setPersona(persona === k ? null : k)} t={t} />)}
          </div>
        </div>
        <textarea style={{ ...fieldStyle(t), resize: 'vertical', minHeight: 90, lineHeight: 1.5 }} placeholder="¿Cómo está tu planta hoy? ¿Qué te dijo?" value={body} maxLength={1000} onChange={e => setBody(e.target.value)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <label style={{ fontFamily: t.bf, fontWeight: 700, fontSize: 13.5, color: P.ink, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 7h4l2-3h6l2 3h4v12H3z" fill="none" stroke={P.ink} strokeWidth="2" strokeLinejoin="round" filter="url(#cr)" /><circle cx="12" cy="13" r="3.5" fill="none" stroke={P.ink} strokeWidth="2" filter="url(#cr)" /></svg>
            {file ? 'Cambiar foto' : 'Añadir foto'}
            <input type="file" accept="image/*" onChange={pickFile} style={{ display: 'none' }} />
          </label>
          {preview && <img src={preview} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: `2px solid ${P.ink}` }} />}
          <div style={{ marginLeft: 'auto' }}>
            <CrayonButton fill={P.heart} stroke={P.ink} color={P.cream} style={{ opacity: busy ? .6 : 1 }}>{busy ? 'Publicando…' : 'Publicar'}</CrayonButton>
          </div>
        </div>
        {/* honeypot anti-bots */}
        <input tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />
        {err && <div style={{ fontFamily: t.bf, fontSize: 13, color: P.heart, fontWeight: 700 }}>{err}</div>}
      </form>
    </CrayonCard>
  );
};

/* ─── Formulario de comentario (raíz o respuesta) ─────────────────────────── */
const CommentForm = ({ t, postId, parentId, onCreated, compact, user }) => {
  const [body, setBody] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const submit = async (e) => {
    e.preventDefault();
    if (body.trim().length < 2) { setErr('Escribe tu comentario.'); return; }
    setBusy(true); setErr(null);
    const { data, error } = await window.createComment({ post_id: postId, parent_id: parentId || null, author_name: window.userName(user), body });
    setBusy(false);
    if (error) { setErr(error.message || 'No se pudo comentar.'); return; }
    setBody('');
    if (onCreated) onCreated(data);
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: compact ? 10 : 0 }}>
      <textarea style={{ ...fieldStyle(t), resize: 'vertical', minHeight: compact ? 60 : 80, lineHeight: 1.5 }} placeholder={parentId ? `Responde como ${window.userName(user)}…` : `Comenta como ${window.userName(user)}…`} value={body} maxLength={600} onChange={e => setBody(e.target.value)} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CrayonButton fill={P.leaf} stroke={P.ink} style={{ opacity: busy ? .6 : 1 }}>{busy ? 'Enviando…' : (parentId ? 'Responder' : 'Comentar')}</CrayonButton>
        {err && <span style={{ fontFamily: t.bf, fontSize: 13, color: P.heart, fontWeight: 700 }}>{err}</span>}
      </div>
    </form>
  );
};

/* ─── Árbol de comentarios anidados ───────────────────────────────────────── */
const CommentNode = ({ node, t, postId, depth, onReply, user, onRequireAuth }) => {
  const [replying, setReplying] = React.useState(false);
  const indent = Math.min(depth, 3) * 22;
  const onReplyClick = () => { if (!user) { onRequireAuth && onRequireAuth(); return; } setReplying(!replying); };
  return (
    <div style={{ marginLeft: indent, marginTop: 14 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Avatar name={node.author_name} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <CrayonCard fill={P.cream} stroke={P.ink} sw={2} radius={16} padding={'12px 16px'} hoverLift={false}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: t.bf, fontWeight: 800, fontSize: 13.5, color: P.ink }}>{node.author_name}</span>
              <span style={{ fontFamily: t.bf, fontSize: 11, color: P.inkSoft, opacity: .65 }}>{window.timeAgo(node.created_at)}</span>
            </div>
            <p style={{ fontFamily: t.bf, fontSize: 14, color: P.inkSoft, lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap' }}>{node.body}</p>
          </CrayonCard>
          <button onClick={onReplyClick} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: t.bf, fontWeight: 700, fontSize: 12.5, color: P.heart, padding: '6px 4px' }}>
            {replying ? 'Cancelar' : 'Responder'}
          </button>
          {replying && <div style={{ maxWidth: 480 }}><CommentForm t={t} postId={postId} parentId={node.id} compact user={user} onCreated={(c) => { setReplying(false); onReply(c); }} /></div>}
        </div>
      </div>
      {node.children && node.children.map(ch => <CommentNode key={ch.id} node={ch} t={t} postId={postId} depth={depth + 1} onReply={onReply} user={user} onRequireAuth={onRequireAuth} />)}
    </div>
  );
};

/* Convierte la lista plana en árbol por parent_id */
function buildCommentTree(list) {
  const byId = {}, roots = [];
  list.forEach(c => { byId[c.id] = { ...c, children: [] }; });
  list.forEach(c => {
    if (c.parent_id && byId[c.parent_id]) byId[c.parent_id].children.push(byId[c.id]);
    else roots.push(byId[c.id]);
  });
  return roots;
}

const CommentTree = ({ comments, t, postId, onReply, user, onRequireAuth }) => {
  const roots = buildCommentTree(comments);
  if (!roots.length) return <p style={{ fontFamily: t.bf, fontSize: 14, color: P.inkSoft, opacity: .7, marginTop: 8 }}>Aún no hay comentarios. ¡Sé el primero!</p>;
  return <div>{roots.map(r => <CommentNode key={r.id} node={r} t={t} postId={postId} depth={0} onReply={onReply} user={user} onRequireAuth={onRequireAuth} />)}</div>;
};

Object.assign(window, {
  PERSONA_META, PERSONA_KEYS, BlogMasthead, SectionTabs, PersonaTag, Avatar, LikeButton,
  ConfigNotice, AuthModal, AccountControl, PostCard, PostForm, CommentForm, CommentTree, buildCommentTree,
  SectionHeading, CategoryLabel, PostMeta, FeaturedCard, TrendingList,
});
