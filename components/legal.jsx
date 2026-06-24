/* ═══════════════════════════════════════════════════════════════════════════
   legal.jsx — layout y tipografía para páginas legales (Términos, Privacidad).
   Mantiene el sistema crayón. Depende de crayon-v3.jsx (PALETTE, CrayonDefs,
   CrayonCard, CrayonButton, CrayonUnderline, Reveal) y sections-v3.jsx (Footer).
   ═══════════════════════════════════════════════════════════════════════════ */
const LP_PALETTE = window.PALETTE;

/* Navegación superior (clon de la de las demás páginas) */
const LegalNav = ({ t }) => {
  const P = LP_PALETTE;
  const [s, setS] = React.useState(false);
  const [o, setO] = React.useState(false);
  React.useEffect(() => {
    const h = () => setS(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [
    { l: 'Inicio', href: 'index.html' },
    { l: 'Cómo funciona', href: 'Como funciona.html' },
    { l: 'Personalidades', href: 'Personalidades.html' },
    { l: 'Tienda', href: 'Tienda.html' },
    { l: 'Blog', href: 'blog/index.html' },
  ];
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)',
      background: s ? 'rgba(250,241,218,0.92)' : 'rgba(250,241,218,0.6)', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
      <a href="index.html" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="assets/icons/icon-crayon.png" alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
        <span style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 19, color: P.ink, lineHeight: 1, filter: 'url(#cr-text)' }}>Gossip<br />Garden</span>
      </a>
      <div className="gg-nav-d" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {links.map(({ l, href }) => (
          <a key={l} href={href} style={{ color: P.ink, textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: t.bf, padding: '4px 2px' }}>{l}</a>
        ))}
        <a href="Tienda.html" style={{ textDecoration: 'none' }}><CrayonButton fill={P.heart} stroke={P.ink} color={P.cream}>Comprar</CrayonButton></a>
      </div>
      <button className="gg-nav-m" onClick={() => setO(!o)} style={{ display: 'none', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: P.ink }}>{o ? '×' : '≡'}</button>
      {o && <div style={{ position: 'absolute', top: 72, left: 0, right: 0, background: 'rgba(250,241,218,0.98)', padding: 24, display: 'flex', flexDirection: 'column', gap: 18, borderBottom: `2px solid ${P.ink}33` }}>
        {links.map(({ l, href }) => <a key={l} href={href} onClick={() => setO(false)} style={{ color: P.ink, textDecoration: 'none', fontSize: 18, fontWeight: 600, fontFamily: t.bf }}>{l}</a>)}
      </div>}
    </nav>
  );
};

/* Párrafo */
const LP = ({ children, t }) => (
  <p style={{ fontFamily: t.bf, fontSize: 15.5, color: LP_PALETTE.inkSoft, lineHeight: 1.75, margin: '0 0 14px' }}>{children}</p>
);

/* Lista */
const LUL = ({ items, t }) => (
  <ul style={{ margin: '0 0 16px', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
    {items.map((it, i) => (
      <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: LP_PALETTE.leaf, border: `1.5px solid ${LP_PALETTE.ink}`, marginTop: 8, flexShrink: 0 }} />
        <span style={{ fontFamily: t.bf, fontSize: 15.5, color: LP_PALETTE.inkSoft, lineHeight: 1.65 }}>{it}</span>
      </li>
    ))}
  </ul>
);

/* Subtítulo dentro de una sección */
const LSub = ({ children, t }) => (
  <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 17, color: LP_PALETTE.ink, margin: '18px 0 8px' }}>{children}</h3>
);

/* Recuadro destacado (avisos importantes) */
const LNote = ({ children, t, color }) => {
  const P = LP_PALETTE;
  return (
    <CrayonCard fill={`${color || P.pot}1f`} stroke={P.ink} sw={2} radius={18} padding={'20px 26px'} hoverLift={false} style={{ margin: '10px 0 20px' }}>
      <div style={{ fontFamily: t.bf, fontSize: 14.5, color: P.inkSoft, lineHeight: 1.7 }}>{children}</div>
    </CrayonCard>
  );
};

/* Página legal completa: nav + hero + índice + secciones + footer.
   sections = [{ id, title, content: <>…</> }]  */
const LegalPage = ({ t, kicker, title, updated, intro, sections }) => {
  const P = LP_PALETTE;
  const [active, setActive] = React.useState(sections[0] && sections[0].id);

  // Scrollspy: marca la sección visible según la posición de scroll.
  React.useEffect(() => {
    const onScroll = () => {
      let current = sections[0] && sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 130) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  return (
    <div style={{ fontFamily: t.bf, position: 'relative' }}>
      <CrayonDefs />
      <LegalNav t={t} />
      <style>{`
        .gg-legal-sec{scroll-margin-top:96px}
        .gg-legal-layout{display:grid;grid-template-columns:250px minmax(0,1fr);gap:46px;max-width:1040px;margin:0 auto;padding:0 clamp(20px,5vw,40px) 70px}
        .gg-legal-toc{position:sticky;top:96px;align-self:start;max-height:calc(100vh - 120px);overflow:auto}
        @media(max-width:860px){.gg-legal-layout{grid-template-columns:1fr}.gg-legal-toc{display:none}}
      `}</style>

      <section style={{ padding: '120px clamp(20px,5vw,40px) 28px', maxWidth: 1040, margin: '0 auto' }}>
        <Reveal>
          <div style={{ fontFamily: t.bf, fontSize: 13, fontWeight: 700, letterSpacing: '2px', color: P.heart, marginBottom: 12 }}>{kicker}</div>
          <h1 style={{ fontFamily: t.hf, fontSize: 'clamp(34px,5.5vw,58px)', fontWeight: 900, color: P.ink, lineHeight: 1.05, filter: 'url(#cr-text)' }}>{title}</h1>
          <CrayonUnderline color={P.heart} w="220px" delay={250} h={6} />
          <p style={{ fontFamily: t.bf, fontSize: 13.5, color: P.inkSoft, opacity: .7, marginTop: 16 }}>Última actualización: {updated}</p>
          {intro && <div style={{ marginTop: 18, maxWidth: 720 }}><LP t={t}>{intro}</LP></div>}
        </Reveal>
      </section>

      <div className="gg-legal-layout">
        {/* Índice lateral con resaltado de la sección activa */}
        <aside className="gg-legal-toc">
          <div style={{ fontFamily: t.bf, fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', color: P.leafDk, marginBottom: 12, textTransform: 'uppercase' }}>Contenido</div>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {sections.map((s, i) => {
              const on = active === s.id;
              return (
                <a key={s.id} href={`#${s.id}`} style={{
                  fontFamily: t.bf, fontSize: on ? 16 : 13.5, fontWeight: on ? 900 : 600,
                  color: on ? P.heart : P.inkSoft, textDecoration: 'none', lineHeight: 1.3,
                  padding: '7px 0 7px 12px', borderLeft: `${on ? 3 : 2}px solid ${on ? P.heart : `${P.ink}22`}`,
                  opacity: on ? 1 : .8, transition: 'all .15s' }}>
                  <span style={{ opacity: .7, marginRight: 6 }}>{i + 1}.</span>{s.title}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Cuerpo */}
        <div>
          {sections.map((s, i) => (
            <div key={s.id} id={s.id} className="gg-legal-sec" style={{ marginBottom: 38 }}>
              <Reveal>
                <h2 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 'clamp(22px,3vw,30px)', color: P.ink, marginBottom: 0 }}>
                  <span style={{ color: P.heart }}>{i + 1}.</span> {s.title}
                </h2>
                <div style={{ marginTop: -6, marginBottom: 14 }}><CrayonUnderline color={P.leafDk} w="80px" h={4} /></div>
                {s.content}
              </Reveal>
            </div>
          ))}

          <Reveal>
            <CrayonCard fill={P.cream} stroke={P.ink} sw={2.5} radius={18} padding={22} hoverLift={false}>
              <div style={{ fontFamily: t.bf, fontSize: 14, color: P.inkSoft, lineHeight: 1.6 }}>
                ¿Dudas sobre este documento? Escríbenos a <a href="mailto:hola@gossipgarden.co" style={{ color: P.heart, fontWeight: 700 }}>hola@gossipgarden.co</a>.
              </div>
            </CrayonCard>
          </Reveal>
        </div>
      </div>

      <Footer t={t} />
    </div>
  );
};

Object.assign(window, { LegalNav, LegalPage, LP, LUL, LSub, LNote });
