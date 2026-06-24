/* ═══════════════════════════════════════════════════════════════════════════
   blog-footer.jsx — Footer propio del blog (dominio aparte).
   Replica el estilo del footer del sitio principal pero enlaza al dominio
   principal vía window.MAIN_SITE_URL. Evita depender de sections-v3.jsx.
   Depende de crayon-v3.jsx (PALETTE).
   ═══════════════════════════════════════════════════════════════════════════ */
const Footer = ({ t }) => {
  const P = window.PALETTE;
  const [contactOpen, setContactOpen] = React.useState(false);
  const MAIN = (window.MAIN_SITE_URL || '').replace(/\/$/, '');
  const cols = [
    { t: 'Producto', l: [
      { n: 'Inicio', h: MAIN || '#' },
      { n: 'Cómo funciona', h: `${MAIN}/Como funciona.html` },
      { n: 'Personalidades', h: `${MAIN}/Personalidades.html` },
      { n: 'Tienda', h: `${MAIN}/Tienda.html` },
    ]},
    { t: 'Comunidad', l: [
      { n: 'Blog', h: 'index.html' },
      { n: 'Foro', h: 'foro.html' },
    ]},
    { t: 'Legal', l: [
      { n: 'Términos', h: `${MAIN}/Terminos.html` },
      { n: 'Privacidad', h: `${MAIN}/Privacidad.html` },
      { n: 'Contacto', action: 'contact' },
    ]},
  ];
  return (
    <footer style={{ padding: '40px clamp(20px,5vw,80px) 28px', marginTop: 30, borderTop: `2px dashed ${P.ink}33` }}>
      <style>{`.gg-foot-link{color:${P.inkSoft};opacity:.78;cursor:pointer;transition:color .15s ease,opacity .15s ease}.gg-foot-link:hover{color:${P.heart};opacity:1}`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 28, maxWidth: 1080, margin: '0 auto' }}>
        <div>
          <a href={MAIN || '#'} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, textDecoration: 'none' }}>
            <img src="assets/icons/icon-crayon.png" alt="" style={{ width: 42, height: 42, objectFit: 'contain' }} />
            <span style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 16, color: P.ink, lineHeight: 1, filter: 'url(#cr-text)' }}>Gossip<br />Garden</span>
          </a>
          <p style={{ fontFamily: t.bf, fontSize: 12.5, color: P.inkSoft, lineHeight: 1.5, opacity: .8 }}>El jardín de todos. Comparte tus plantas.</p>
        </div>
        {cols.map(col => (
          <div key={col.t}>
            <h4 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 13, color: P.ink, marginBottom: 10, letterSpacing: '.3px' }}>{col.t}</h4>
            {col.l.map(({ n, h, action }) => action === 'contact'
              ? <a key={n} href="#" className="gg-foot-link" onClick={e => { e.preventDefault(); setContactOpen(true); }} style={{ display: 'block', fontFamily: t.bf, fontSize: 13, textDecoration: 'none', marginBottom: 6 }}>{n}</a>
              : <a key={n} href={h} className="gg-foot-link" style={{ display: 'block', fontFamily: t.bf, fontSize: 13, textDecoration: 'none', marginBottom: 6 }}>{n}</a>)}
          </div>
        ))}
      </div>
      {contactOpen && <ContactModal t={t} onClose={() => setContactOpen(false)} />}
    </footer>
  );
};

Object.assign(window, { Footer });
