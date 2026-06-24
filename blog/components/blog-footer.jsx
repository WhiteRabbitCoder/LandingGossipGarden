/* ═══════════════════════════════════════════════════════════════════════════
   blog-footer.jsx — Footer propio del blog (dominio aparte).
   Replica el estilo del footer del sitio principal pero enlaza al dominio
   principal vía window.MAIN_SITE_URL. Evita depender de sections-v3.jsx.
   Depende de crayon-v3.jsx (PALETTE).
   ═══════════════════════════════════════════════════════════════════════════ */
const Footer = ({ t }) => {
  const P = window.PALETTE;
  const MAIN = (window.MAIN_SITE_URL || '').replace(/\/$/, '');
  const cols = [
    { t: 'Producto', l: [
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
      { n: 'Contacto', h: 'mailto:hola@gossipgarden.co' },
    ]},
  ];
  return (
    <footer style={{ padding: '40px clamp(20px,5vw,80px) 28px', marginTop: 30, borderTop: `2px dashed ${P.ink}33` }}>
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
            {col.l.map(({ n, h }) => <a key={n} href={h} style={{ display: 'block', fontFamily: t.bf, fontSize: 13, color: P.inkSoft, opacity: .75, textDecoration: 'none', marginBottom: 6 }}>{n}</a>)}
          </div>
        ))}
      </div>
    </footer>
  );
};

Object.assign(window, { Footer });
