/* Sections v3 — full crayon aesthetic, no emojis, scroll-driven motion graphic */

/* ═══ i18n ═══
   Lightweight bilingual helper. The LangSwitcher writes the choice to
   localStorage + dispatches a 'gg-lang' event; useLang() re-renders consumers.
   L(lang, es, en) returns the string for the active language. UI copy lives in
   Spanish by default; English variants are provided inline at each call site. */
const L = (lang, es, en) => (lang === 'en' ? en : es);
function useLang() {
  const [lang, setLang] = React.useState(() => { try { return localStorage.getItem('gg_lang') || 'es'; } catch (e) { return 'es'; } });
  React.useEffect(() => {
    const h = (e) => setLang((e && e.detail) || (() => { try { return localStorage.getItem('gg_lang') || 'es'; } catch (x) { return 'es'; } })());
    window.addEventListener('gg-lang', h);
    return () => window.removeEventListener('gg-lang', h);
  }, []);
  return lang;
}

const Nav = ({ t }) => {
  const [s, setS] = React.useState(false);
  const [o, setO] = React.useState(false);
  React.useEffect(() => {
    const h = () => setS(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [
    { l: L(t.lang, 'Inicio', 'Home'), href: '#top' },
    { l: L(t.lang, 'Cómo funciona', 'How it works'), href: 'how-it-works.html' },
    { l: L(t.lang, 'Personalidades', 'Personalities'), href: 'personalities.html' },
    { l: L(t.lang, 'Tienda', 'Store'), href: 'store.html', store: true },
  ];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)',
      background: s ? 'rgba(250,241,218,0.92)' : 'transparent', backdropFilter: s ? 'blur(10px)' : 'none',
      transition: 'all 0.3s'
    }}>
      <style>{`
        .gg-navlink{color:${PALETTE.ink};transition:color .2s ease, transform .2s ease}
        .gg-navlink:hover{transform:translateY(-1px)}
        .gg-ul{position:absolute;left:0;right:0;bottom:-3px;width:100%;height:11px;overflow:visible;pointer-events:none}
        .gg-ul path{stroke-dasharray:240;stroke-dashoffset:240;transition:stroke-dashoffset .55s cubic-bezier(.4,0,.2,1)}
        .gg-navlink:hover .gg-ul path{stroke-dashoffset:0}
        .gg-navlink.is-active .gg-ul path{stroke-dashoffset:0}
        .gg-nav-d:hover .gg-navlink.is-active .gg-ul path{stroke-dashoffset:240}
        .gg-nav-d:hover .gg-navlink.is-active:hover .gg-ul path{stroke-dashoffset:0;animation:ggDraw .6s cubic-bezier(.4,0,.2,1)}
        @keyframes ggDraw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
        .gg-brand{transition:transform .2s ease}
        .gg-brand:hover{transform:translateY(-1px) rotate(-1deg)}
      `}</style>
      <a href="#top" className="gg-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="assets/icons/icon-crayon.png" alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
        <span style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 19, color: PALETTE.ink, lineHeight: 1, filter: 'url(#cr-text)' }}>Gossip<br />Garden</span>
      </a>
      <div className="gg-nav-d" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {links.map(({ l, href, store }, i) => store
          ? <a key={l} href={href} style={{ textDecoration: 'none' }}><CrayonButton fill={PALETTE.heart} stroke={PALETTE.ink} color={PALETTE.cream}>{l}</CrayonButton></a>
          : <a key={l} href={href} className={i === 0 ? 'gg-navlink is-active' : 'gg-navlink'} style={{
            textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: t.bf,
            position: 'relative', padding: '4px 2px 6px'
          }}>
            {l}
            <svg className="gg-ul" viewBox="0 0 200 14" preserveAspectRatio="none">
              <path d="M3,8 Q40,2 90,9 T196,5" fill="none" stroke={PALETTE.leafDk} strokeWidth="3" strokeLinecap="round" filter="url(#cr)" />
            </svg>
          </a>)}
      </div>
      <button className="gg-nav-m" onClick={() => setO(!o)} style={{ display: 'none', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: PALETTE.ink }}>{o ? '×' : '≡'}</button>
      {o && <div style={{
        position: 'absolute', top: 72, left: 0, right: 0, background: 'rgba(250,241,218,0.98)', padding: 24,
        display: 'flex', flexDirection: 'column', gap: 18, borderBottom: `2px solid ${PALETTE.ink}33`
      }}>
        {links.map(({ l, href }) => <a key={l} href={href} onClick={() => setO(false)} style={{ color: PALETTE.ink, textDecoration: 'none', fontSize: 18, fontWeight: 600, fontFamily: t.bf }}>{l}</a>)}
      </div>}
    </nav>
  );
};

/* ── Scroll-driven 360° turntable of the real pot ─────────────────────────────
   120 pre-rendered WebP frames in assets/pots/pot360/ are scrubbed to scroll
   position via GSAP ScrollTrigger and painted to a <canvas>. Falls back to the
   React `progress` value if GSAP (loaded from CDN) is unavailable. */
const POT_FRAMES = 100;                  // clean 360° turntable (dup/frozen source frames removed)
const POT_ASPECT = '318 / 353';          // matches the cropped frame size
const potFrameSrc = i => `assets/pots/pot360/${String(i + 1).padStart(3, '0')}.webp`;

const Pot360 = ({ containerRef, curBeat, nextBeat, tE, t, progress }) => {
  const canvasRef = React.useRef(null);
  const imagesRef = React.useRef([]);
  const setFrameRef = React.useRef(() => { });
  const gsapActive = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const draw = () => {
      const cw = canvas.width, ch = canvas.height;
      if (!cw || !ch) return;
      ctx.clearRect(0, 0, cw, ch);
      const img = imagesRef.current[frame];
      if (!img || !img.complete || !img.naturalWidth) return;
      ctx.imageSmoothingEnabled = true;     // re-set each draw: changing canvas.width resets ctx state
      ctx.imageSmoothingQuality = 'high';
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };
    const setFrame = (i) => {
      frame = Math.max(0, Math.min(POT_FRAMES - 1, i | 0));
      draw();
    };
    setFrameRef.current = setFrame;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      draw();
    };

    // Preload every frame; size the canvas once the first one decodes.
    let firstLoaded = false;
    imagesRef.current = [];
    for (let i = 0; i < POT_FRAMES; i++) {
      const img = new Image();
      img.onload = () => { if (!firstLoaded) { firstLoaded = true; sizeCanvas(); } };
      img.src = potFrameSrc(i);
      imagesRef.current.push(img);
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    // Scrub the frame to scroll position with GSAP ScrollTrigger.
    let gctx;
    if (window.gsap && window.ScrollTrigger && containerRef.current) {
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);
      gsapActive.current = true;
      const fo = { f: 0 };
      gctx = gsap.context(() => {
        gsap.to(fo, {
          f: POT_FRAMES - 1,
          snap: 'f',            // keep the frame property on integer values
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
          },
          onUpdate: () => setFrame(fo.f),
        });
        ScrollTrigger.refresh();
      });
    }

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      if (gctx) gctx.revert();
      gsapActive.current = false;
    };
  }, [containerRef]);

  // Fallback driver: when GSAP isn't present, follow the React scroll progress.
  React.useEffect(() => {
    if (!gsapActive.current) setFrameRef.current(Math.round(progress * (POT_FRAMES - 1)));
  }, [progress]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'absolute', bottom: '-4%', left: '50%', transform: 'translateX(-50%)',
        width: '78%', height: '8%',
        background: 'radial-gradient(ellipse at center,rgba(61,40,23,0.28) 0%,rgba(61,40,23,0) 70%)',
        filter: 'blur(4px)', zIndex: -1
      }} />
      <canvas ref={canvasRef} aria-label={curBeat.personality}
        style={{
          width: '100%', aspectRatio: POT_ASPECT, display: 'block',
          filter: 'drop-shadow(0 8px 14px rgba(61,40,23,0.15)) drop-shadow(0 22px 36px rgba(61,40,23,0.22))'
        }} />
      <div style={{ position: 'absolute', top: '2%', right: '-4%', animation: 'floatB 4s ease-in-out infinite' }}>
        <SpeechBubble fill={PALETTE.cream} color={PALETTE.ink} style={{ padding: '13px 20px' }}>
          <span style={{ fontFamily: t.bf, fontSize: 14, fontWeight: 700, color: PALETTE.ink, whiteSpace: 'nowrap' }}>
            {tE > 0.5 ? nextBeat.speech : curBeat.speech}
          </span>
        </SpeechBubble>
      </div>
    </div>
  );
};

/* Lives at module scope — NOT inside ScrollStory — so React never remounts it on scroll re-renders */
const StoryTextContent = ({ beat, isFirst, t }) => {
  const SC = PALETTE.leafDk;
  return (
    <div style={{ paddingBottom: 44 }}>
      <div style={{
        fontFamily: t.bf, fontSize: 12, fontWeight: 700, letterSpacing: '2px',
        color: SC, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10
      }}>
        <svg width="28" height="3">
          <path d="M0,1.5 Q14,0 28,1.5" stroke={SC} strokeWidth="2.5" fill="none" filter="url(#cr)" />
        </svg>
        {beat.kicker}
      </div>
      <h1 style={{
        fontFamily: t.hf, fontSize: 'clamp(30px,3.8vw,54px)', fontWeight: 800, lineHeight: 1.02,
        color: PALETTE.ink, letterSpacing: '-1px', whiteSpace: 'pre-line', marginBottom: 6
      }}>
        {beat.title.split('\n').map((line, i, arr) => (
          <div key={i} style={{ position: 'relative' }}>
            {line}
            {i === arr.length - 1 && <div style={{ marginTop: 2 }}><CrayonUnderline color={SC} w="58%" h={5} delay={0} /></div>}
          </div>
        ))}
      </h1>
      <p style={{
        fontFamily: t.bf, fontSize: 'clamp(13px,1.1vw,16px)', color: PALETTE.inkSoft,
        lineHeight: 1.5, marginTop: 14, opacity: .92, maxWidth: 380
      }}>
        {beat.body}
      </p>
      {isFirst && (
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <CrayonButton fill={PALETTE.leaf} stroke={PALETTE.ink}>{L(t.lang, 'Descargar app', 'Download app')}</CrayonButton>
        </div>
      )}
    </div>
  );
};

const ScrollStory = ({ t }) => {
  const containerRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const h = containerRef.current.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / h));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Story-telling snap: ONE scroll gesture advances exactly one beat (Apple-style).
  // While the story fills the viewport we hijack the wheel and animate the scroll
  // to the next/prev beat; the maceta scrub follows the animated scroll. At the
  // first/last beat we let the native scroll through so the page can exit normally.
  const NBEATS = 4;
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let animating = false, cooldownUntil = 0;

    // Evenly spaced snap points: 0, 1/3, 2/3, 1 (even rotation per scroll, and the
    // last beat sits at the very end so one more scroll exits — no dead zone).
    // FADE_START (raised to 0.75) keeps every beat fully solid at these marks.
    const snapPx = () => {
      const start = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      return Array.from({ length: NBEATS }, (_, i) => start + (i / (NBEATS - 1)) * range);
    };
    const nearestBeat = () => {
      const pts = snapPx(), y = window.scrollY;
      let best = 0, bd = Infinity;
      pts.forEach((p, i) => { const d = Math.abs(p - y); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const animateTo = (y) => {
      animating = true;
      const startY = window.scrollY, dist = y - startY, dur = 700;
      const ease = p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
      let t0 = null;
      const step = (ts) => {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        window.scrollTo(0, startY + dist * ease(p));
        if (p < 1) requestAnimationFrame(step);
        else { animating = false; cooldownUntil = performance.now() + 220; }
      };
      requestAnimationFrame(step);
    };
    const onWheel = (e) => {
      const r = el.getBoundingClientRect();
      const active = r.top <= 1 && r.bottom > window.innerHeight + 1;  // story fills viewport
      if (!active) return;
      if (animating || performance.now() < cooldownUntil) { e.preventDefault(); return; }
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = nearestBeat() + dir;
      if (next < 0 || next > NBEATS - 1) return;   // at an edge → let native scroll exit
      e.preventDefault();
      animateTo(snapPx()[next]);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  const beats = [
    { kicker: L(t.lang, 'HOLA, SOY TU PLANTA', 'HI, I AM YOUR PLANT'), title: L(t.lang, 'Hola.\nSoy tu planta.', 'Hi.\nI am your plant.'), body: L(t.lang, 'Por primera vez, puedo contarte cómo me siento. No solo me riegues — escúchame.', 'For the first time, I can tell you how I feel. Don’t just water me — listen to me.'), card: 'alegre', photo: 'assets/pots/colors/verde.png', speech: L(t.lang, '¡Soy feliz contigo!', 'I’m happy with you!'), personality: 'Alegre' },
    { kicker: L(t.lang, 'CUATRO SENTIDOS', 'FOUR SENSES'), title: L(t.lang, 'Cuatro\nsensores.', 'Four\nsensors.'), body: L(t.lang, 'Humedad del suelo, humedad del aire, temperatura y luz. Los mido en silencio, cada minuto.', 'Soil moisture, air humidity, temperature and light. I measure them quietly, every minute.'), card: 'dormilona', photo: 'assets/pots/colors/azul.png', speech: L(t.lang, 'Déjame dormir...', 'Let me sleep...'), personality: 'Dormilona' },
    { kicker: L(t.lang, 'YO INICIO LA CONVERSACIÓN', 'I START THE CONVERSATION'), title: L(t.lang, 'Te toco\nla puerta.', 'I knock\non your door.'), body: L(t.lang, 'Cuando tengo sed, frío o demasiada sombra, te lo digo. Sin abrir la app — yo hablo primero.', 'When I’m thirsty, cold or in too much shade, I tell you. Without opening the app — I speak first.'), card: 'dramatica', photo: 'assets/pots/colors/morado.png', speech: L(t.lang, '¡Esto es un drama!', 'This is a drama!'), personality: 'Dramática' },
    { kicker: L(t.lang, 'MEMORIA DE PLANTA', 'PLANT MEMORY'), title: L(t.lang, 'Recuerdo\ntodo.', 'I remember\neverything.'), body: L(t.lang, 'Guardo 30 días de mi vida. Cada mes, un informe de cómo crecí y qué tan feliz estuve contigo.', 'I keep 30 days of my life. Every month, a report on how I grew and how happy I was with you.'), card: 'exigente', photo: 'assets/pots/colors/naranja.png', speech: L(t.lang, 'Agua justa. Nada más.', 'Just enough water. Nothing more.'), personality: 'Exigente' },
  ];

  const FADE_START = 0.75;   // beats stay solid across most of each segment; transition only in the last 25% (so the 1/3, 2/3 snap marks land solid, not grey)
  const rawBeat = progress * beats.length * 0.9999;
  const curIdx = Math.min(beats.length - 1, Math.floor(rawBeat));
  const nextIdx = Math.min(beats.length - 1, curIdx + 1);
  const fraction = rawBeat % 1;
  const tRaw = curIdx === nextIdx ? 0 : Math.max(0, (fraction - FADE_START) / (1 - FADE_START));
  const tE = tRaw < 0.5 ? 2 * tRaw * tRaw : 1 - Math.pow(-2 * tRaw + 2, 2) / 2;
  const curBeat = beats[curIdx];
  const nextBeat = beats[nextIdx];

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '400vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px clamp(16px,4vw,48px) 24px'
      }}>

        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${PALETTE.cream} 0%, ${PALETTE.bg} 70%)`, zIndex: 0
        }} />

        <div className="gg-story-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          gap: 'clamp(20px,4vw,60px)', maxWidth: 1240, width: '100%',
          alignItems: 'center', position: 'relative', zIndex: 2
        }}>

          {/* LEFT — text, always render both layers so CrayonUnderline never remounts */}
          <div style={{ maxWidth: 440, position: 'relative', height: 'clamp(260px,38vh,360px)' }}>
            {/* Fade through blank: outgoing text clears before incoming appears,
                so the two never overlap and letters never superimpose. */}
            <div style={{
              position: 'absolute', inset: 0,
              opacity: Math.max(0, 1 - tE * 2), transition: 'none',
              pointerEvents: tE > 0.5 ? 'none' : 'auto'
            }}>
              <StoryTextContent beat={curBeat} isFirst={curIdx === 0} t={t} />
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              opacity: Math.max(0, tE * 2 - 1), transition: 'none',
              pointerEvents: tE < 0.5 ? 'none' : 'auto'
            }}>
              <StoryTextContent beat={nextBeat} isFirst={nextIdx === 0} t={t} />
            </div>
            {/* Progress dots */}
            <div style={{ position: 'absolute', bottom: '-36px', left: 0, display: 'flex', gap: 6 }}>
              {beats.map((_, i) => {
                const dist = Math.abs(rawBeat - i);
                const w = dist < 1 ? 8 + 20 * Math.max(0, 1 - dist) : 8;
                const op = dist < 1 ? 0.2 + 0.8 * Math.max(0, 1 - dist) : 0.2;
                return <div key={i} style={{ width: w, height: 8, borderRadius: 4, background: PALETTE.ink, opacity: op, transition: 'none' }} />;
              })}
            </div>
          </div>

          {/* CENTER — plant drifts vertically between beats */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: 'clamp(320px,42vw,560px)',
              transform: 'none',
              transition: 'none',
            }}>
              <Pot360 containerRef={containerRef} curBeat={curBeat} nextBeat={nextBeat} tE={tE} t={t} progress={progress} />
            </div>
          </div>

          {/* RIGHT — cards. Fade through blank (like the left text) so two
              different cards never overlap mid-transition. */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', position: 'relative' }}>
            <div style={{
              position: curIdx === nextIdx ? 'relative' : 'absolute',
              opacity: Math.max(0, 1 - tE * 2), transition: 'none',
              pointerEvents: tE > 0.5 ? 'none' : 'auto'
            }}>
              {curBeat.card === 'alegre' && <AlegreCard key={'c' + curIdx} t={t} />}
              {curBeat.card === 'dormilona' && <DormilonaCard key={'c' + curIdx} t={t} />}
              {curBeat.card === 'dramatica' && <DramaticaCard key={'c' + curIdx} t={t} />}
              {curBeat.card === 'exigente' && <ExigenteCard key={'c' + curIdx} t={t} />}
            </div>
            {curIdx !== nextIdx && (
              <div style={{
                opacity: Math.max(0, tE * 2 - 1), transition: 'none',
                pointerEvents: tE < 0.5 ? 'none' : 'auto'
              }}>
                {nextBeat.card === 'alegre' && <AlegreCard key={'n' + nextIdx} t={t} />}
                {nextBeat.card === 'dormilona' && <DormilonaCard key={'n' + nextIdx} t={t} />}
                {nextBeat.card === 'dramatica' && <DramaticaCard key={'n' + nextIdx} t={t} />}
                {nextBeat.card === 'exigente' && <ExigenteCard key={'n' + nextIdx} t={t} />}
              </div>
            )}
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          fontFamily: t.bf, fontSize: 12, fontWeight: 600, color: PALETTE.inkSoft, letterSpacing: '2px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'bounce 2s infinite', filter: 'url(#cr-text)'
        }}>
          {L(t.lang, 'DESLIZA PARA DESCUBRIR', 'SCROLL TO DISCOVER')}
          <svg width="20" height="24" viewBox="0 0 20 24" style={{ filter: 'url(#cr)' }}>
            <path d="M10,4 L10,18 M4,12 L10,20 L16,12" stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const AlegreCard = ({ t }) => (
  <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={20} style={{ minWidth: 240, maxWidth: 280 }}>
    <div style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 14, color: PALETTE.ink, marginBottom: 12, letterSpacing: '.5px' }}>{L(t.lang, 'HOY ME SIENTO...', 'TODAY I FEEL...')}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 17, color: PALETTE.ink }}>{L(t.lang, '¡Feliz!', 'Happy!')}</div>
      <div style={{ fontFamily: t.bf, fontSize: 12, color: PALETTE.inkSoft }}>{L(t.lang, 'Tierra húmeda · Buen sol', 'Moist soil · Good sun')}</div>
    </div>
    <div style={{ height: 1, background: PALETTE.ink + '22', margin: '10px 0' }}></div>
    <div style={{ fontFamily: t.bf, fontSize: 13, color: PALETTE.ink, fontStyle: 'italic', lineHeight: 1.4 }}>
      {L(t.lang, '"Hola humano. Hoy tengo todo lo que necesito gracias a ti."', '"Hi human. Today I have everything I need thanks to you."')}
    </div>
  </CrayonCard>
);

const DormilonaCard = ({ t }) => (
  <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={20} style={{ minWidth: 240, maxWidth: 280 }}>
    <div style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 14, color: PALETTE.ink, marginBottom: 12, letterSpacing: '.5px' }}>{L(t.lang, '4 SENSORES, 1 PLANTA TRANQUILA', '4 SENSORS, 1 CALM PLANT')}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[{ icon: 'drop', label: L(t.lang, 'Humedad', 'Moisture') }, { icon: 'thermo', label: L(t.lang, 'Temperatura', 'Temperature') }, { icon: 'sun', label: L(t.lang, 'Luz', 'Light') }, { icon: 'cloud', label: L(t.lang, 'Aire', 'Air') }].map((s, i) => (
        <div key={i} style={{ textAlign: 'center', padding: '10px 6px', background: '#B8C9E820', borderRadius: 12, filter: 'url(#cr)' }}>
          <HandIcon type={s.icon} size={32} color={PALETTE.ink} />
          <div style={{ fontFamily: t.bf, fontSize: 11, fontWeight: 700, color: PALETTE.ink, marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </div>
    <div style={{ fontFamily: t.bf, fontSize: 12, color: PALETTE.inkSoft, fontStyle: 'italic', marginTop: 12, textAlign: 'center' }}>
      {L(t.lang, 'Los mido mientras duermo.', 'I measure them while I sleep.')}
    </div>
  </CrayonCard>
);

const DramaticaCard = ({ t }) => {
  const [m, setM] = React.useState(0);
  React.useEffect(() => {
    const ts = [setTimeout(() => setM(1), 400), setTimeout(() => setM(2), 1400), setTimeout(() => setM(3), 2600)];
    return () => ts.forEach(clearTimeout);
  }, []);
  const msgs = [
    { from: 'plant', text: L(t.lang, '¡EMERGENCIA! Llevo 3 horas sin agua.', 'EMERGENCY! I’ve gone 3 hours without water.') },
    { from: 'user', text: L(t.lang, 'Voy corriendo.', 'On my way.') },
    { from: 'plant', text: L(t.lang, 'Ya era hora.', 'About time.') },
  ];
  return (
    <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={18} style={{ minWidth: 240, maxWidth: 280 }}>
      <div style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 14, color: PALETTE.ink, marginBottom: 10, letterSpacing: '.5px' }}>{L(t.lang, 'HOY, 3:12 PM', 'TODAY, 3:12 PM')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.slice(0, m).map((mg, i) => (
          <div key={i} style={{
            alignSelf: mg.from === 'plant' ? 'flex-start' : 'flex-end',
            background: mg.from === 'plant' ? '#E0B8E040' : '#FFE6CC',
            border: `2px solid ${PALETTE.ink}`, borderRadius: 14, padding: '8px 12px', maxWidth: '85%',
            fontFamily: t.bf, fontSize: 12.5, color: PALETTE.ink, lineHeight: 1.4, filter: 'url(#cr)',
            animation: 'fadeUp 0.4s ease-out'
          }}>
            {mg.text}
          </div>
        ))}
      </div>
    </CrayonCard>
  );
};

const ExigenteCard = ({ t }) => (
  <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={20} style={{ minWidth: 240, maxWidth: 280 }}>
    <div style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 14, color: PALETTE.ink, marginBottom: 12, letterSpacing: '.5px' }}>{L(t.lang, 'MIS ÚLTIMOS 30 DÍAS', 'MY LAST 30 DAYS')}</div>
    <svg viewBox="0 0 220 80" style={{ width: '100%', height: 70, filter: 'url(#cr)' }}>
      <path d="M0,60 Q20,55 40,50 T80,40 Q100,35 120,38 T160,30 Q180,28 220,20" stroke={PALETTE.leafDk} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M0,60 Q20,55 40,50 T80,40 Q100,35 120,38 T160,30 Q180,28 220,20 L220,80 L0,80 Z" fill="#F5C2C2" opacity="0.35" />
      {[0, 40, 80, 120, 160, 200].map(x => <circle key={x} cx={x} cy={70 - x * 0.2} r="2.5" fill={PALETTE.leafDk} />)}
    </svg>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: t.bf, fontSize: 11, color: PALETTE.inkSoft, fontWeight: 600 }}>
      <span>{L(t.lang, 'Día 1', 'Day 1')}</span><span>{L(t.lang, 'Día 30', 'Day 30')}</span>
    </div>
    <div style={{ marginTop: 10, padding: '8px 12px', background: '#F5C2C220', borderRadius: 10, border: `1.5px solid ${PALETTE.ink}33` }}>
      <div style={{ fontFamily: t.bf, fontSize: 12, color: PALETTE.ink, fontWeight: 700 }}>{L(t.lang, 'Hidratación: 78% · Exijo al menos 85%.', 'Hydration: 78% · I demand at least 85%.')}</div>
    </div>
  </CrayonCard>
);

/* ═══ FEATURES ═══ */
const Features = ({ t }) => {
  const items = [
    { icon: 'sensor', title: L(t.lang, 'Sensores inteligentes', 'Smart sensors'), desc: L(t.lang, 'Monitorea humedad, temperatura y luz en tiempo real.', 'Monitors moisture, temperature and light in real time.') },
    { icon: 'chat', title: L(t.lang, 'IA que conversa', 'AI that chats'), desc: L(t.lang, 'Chatea con tu planta y recibe respuestas reales.', 'Chat with your plant and get real replies.') },
    { icon: 'heart', title: L(t.lang, 'Personalidades únicas', 'Unique personalities'), desc: L(t.lang, 'Cada planta tiene su propio carácter y manera de ser.', 'Each plant has its own character and way of being.') },
    { icon: 'bell', title: L(t.lang, 'Recordatorios', 'Reminders'), desc: L(t.lang, 'Te avisa cuando necesita agua, luz o cariño.', 'It tells you when it needs water, light or care.') },
  ];
  return (
    <section style={{ padding: 'clamp(60px,9vh,120px) clamp(20px,5vw,80px)', textAlign: 'center' }}>
      <Reveal>
        <div style={{ fontFamily: t.bf, fontSize: 13, fontWeight: 700, letterSpacing: '2px', color: PALETTE.heart, marginBottom: 12 }}>{L(t.lang, 'POR QUÉ FUNCIONA', 'WHY IT WORKS')}</div>
        <h2 style={{ fontFamily: t.hf, fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: PALETTE.ink, letterSpacing: '-.5px' }}>
          {L(t.lang, 'Tecnología que cuida con amor', 'Technology that cares with love')}
        </h2>
        <CrayonUnderline color={PALETTE.heart} w="240px" delay={300} h={5} />
        <p style={{ fontFamily: t.bf, fontSize: 'clamp(14px,1.4vw,17px)', color: PALETTE.inkSoft, marginTop: 14, opacity: .85 }}>
          {L(t.lang, 'Sensores + IA para entender a tu planta como nunca antes.', 'Sensors + AI to understand your plant like never before.')}
        </p>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24, maxWidth: 980, margin: '48px auto 0' }}>
        {items.map((f, i) => (
          <Reveal key={i} delay={i * 100}>
            <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={22} padding={28}>
              <div style={{
                width: 64, height: 64, margin: '0 auto 14px', borderRadius: '50%', background: PALETTE.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${PALETTE.ink}`, filter: 'url(#cr)'
              }}>
                <HandIcon type={f.icon} size={40} color={PALETTE.ink} />
              </div>
              <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 17, color: PALETTE.ink, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontFamily: t.bf, fontSize: 13.5, color: PALETTE.inkSoft, lineHeight: 1.5 }}>{f.desc}</p>
            </CrayonCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ═══ PERSONALITIES ═══ */
// Comic speech-bubble shapes — one per personality (cloud, spark, burst…).
// Little 4-point sparkle star (same as the hero's "sparkle" icon).
const Sparkle = ({ size = 16, style }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ position: 'absolute', zIndex: 2, pointerEvents: 'none', ...style }}>
    <path d="M24,3 L27.5,20.5 L45,24 L27.5,27.5 L24,45 L20.5,27.5 L3,24 L20.5,20.5 Z"
      fill="#F4D06F" stroke={PALETTE.ink} strokeWidth="2.5" strokeLinejoin="round" filter="url(#cr)" />
  </svg>
);
// Per-personality flourish that gives each plant its character.
const Deco = ({ type, t }) => {
  const f = (t && t.hf) || 'Nunito';
  if (type === 'stars') return (
    <>
      <Sparkle size={22} style={{ top: -14, left: -12 }} />
      <Sparkle size={15} style={{ top: -6, right: 2 }} />
      <Sparkle size={17} style={{ bottom: -10, right: -6 }} />
    </>
  );
  if (type === 'zzz') return (
    <div style={{
      position: 'absolute', top: -20, right: -18, display: 'flex', alignItems: 'flex-end', gap: 1,
      transform: 'rotate(-8deg)', color: PALETTE.ink, fontFamily: f, fontWeight: 800, lineHeight: 1, pointerEvents: 'none', zIndex: 3
    }}>
      <span style={{ fontSize: 9 }}>z</span><span style={{ fontSize: 13 }}>z</span><span style={{ fontSize: 18 }}>Z</span>
    </div>
  );
  if (type === 'excl') return (
    <div style={{
      position: 'absolute', top: -22, right: -4, fontFamily: f, fontSize: 26, fontWeight: 900, color: PALETTE.heart,
      transform: 'rotate(9deg)', lineHeight: 1, pointerEvents: 'none', zIndex: 3, WebkitTextStroke: `1.5px ${PALETTE.ink}`
    }}>!</div>
  );
  if (type === 'anger') return (
    <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: -16, right: -15, pointerEvents: 'none', zIndex: 3 }}>
      <path d="M4,9 L8,9 L8,5 M16,5 L16,9 L20,9 M20,15 L16,15 L16,19 M8,19 L8,15 L4,15"
        stroke={PALETTE.heart} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#cr)" />
    </svg>
  );
  return null;
};
// Hand-traced comic speech bubbles (vectorized from the reference art, in
// assets/bubbles/). `box` is the white interior region (% of the SVG) where
// the message text is placed so it never spills onto the outline/spikes.
const TRACED = {
  ovalo: { src: 'assets/bubbles/ovalo.svg', ar: 228 / 173, box: { l: 9, t: 14, w: 82, h: 58 } },
  'nube-pensamiento': { src: 'assets/bubbles/nube-pensamiento.svg', ar: 202 / 187, box: { l: 11, t: 14, w: 78, h: 56 } },
  explosion: { src: 'assets/bubbles/explosion.svg', ar: 210 / 199, box: { l: 21, t: 28, w: 58, h: 42 } },
  estallido: { src: 'assets/bubbles/estallido.svg', ar: 198 / 182, box: { l: 20, t: 28, w: 60, h: 42 } },
};
const TracedBubble = ({ shape = 'ovalo', width = 140, deco, t, children }) => {
  const b = TRACED[shape] || TRACED.ovalo;
  return (
    <div style={{ position: 'relative', width, lineHeight: 0 }}>
      <img src={b.src} alt="" style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
      <Deco type={deco} t={t} />
      <div style={{
        position: 'absolute', left: b.box.l + '%', top: b.box.t + '%', width: b.box.w + '%', height: b.box.h + '%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
      }}>
        {children}
      </div>
    </div>
  );
};

// Moodboard collage: interlocking tiles of different sizes over a soft circle
// accent, with depth from drop shadows.
const Personalities = ({ t }) => {
  // area = celda en el mosaico (a/d son altas, b/c chicas apiladas en medio).
  const ppl = [
    { area: 'a', name: L(t.lang, 'Alegre', 'Cheerful'), color: '#F4D06F', photo: 'assets/personalities/collage/alegre.webp', trait: L(t.lang, 'Luminosa', 'Sunny'), desc: L(t.lang, 'Te saluda cada mañana con buen humor.', 'Greets you every morning in a good mood.'), balloon: 'assets/balloons/happy.webp', rot: -4, bw: 210, lift: 1, bleft: '18%', ph: '82%' },
    { area: 'b', name: L(t.lang, 'Dormilona', 'Sleepy'), color: '#8FBEEE', photo: 'assets/personalities/collage/dormilona.webp', trait: L(t.lang, 'Tranquila', 'Calm'), desc: L(t.lang, 'Calladita; rara vez pide algo.', 'Quiet; rarely asks for anything.'), balloon: 'assets/balloons/sleepy.webp', rot: 3, bw: 170, lift: -84 },
    { area: 'c', name: L(t.lang, 'Dramática', 'Dramatic'), color: '#E0B8E0', photo: 'assets/personalities/collage/dramatica.webp', trait: L(t.lang, 'Intensa', 'Intense'), desc: L(t.lang, 'Lo siente todo y te lo cuenta.', 'Feels everything and tells you about it.'), balloon: 'assets/balloons/drama.webp', rot: -3, bw: 170, lift: -95 },
    { area: 'd', name: L(t.lang, 'Exigente', 'Demanding'), color: '#A8C88A', photo: 'assets/personalities/collage/exigente.webp', trait: L(t.lang, 'Directa', 'Direct'), desc: L(t.lang, 'Sabe lo que quiere y lo pide.', 'Knows what it wants and asks for it.'), balloon: 'assets/balloons/grumpy.webp', rot: 4, bw: 165, lift: -82, inside: true, btop: '6%', ph: '82%' },
  ];
  return (
    <section style={{ padding: 'clamp(60px,9vh,120px) clamp(20px,5vw,80px)', textAlign: 'center', overflow: 'hidden' }}>
      <Reveal>
        <div style={{ fontFamily: t.bf, fontSize: 13, fontWeight: 700, letterSpacing: '2px', color: PALETTE.leafDk, marginBottom: 12 }}>{L(t.lang, 'EL CARÁCTER DE TU PLANTA', 'YOUR PLANT’S CHARACTER')}</div>
        <h2 style={{ fontFamily: t.hf, fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: PALETTE.ink }}>
          {L(t.lang, 'Tu planta tiene personalidad', 'Your plant has personality')}
        </h2>
        <CrayonUnderline color={PALETTE.leafDk} w="340px" delay={300} h={5} />
        <p style={{ fontFamily: t.bf, fontSize: 'clamp(14px,1.4vw,17px)', color: PALETTE.inkSoft, marginTop: 14, opacity: .85 }}>
          {L(t.lang, 'Cada maceta desarrolla su propio carácter. ¿Cuál va contigo?', 'Each pot develops its own character. Which one is you?')}
        </p>
      </Reveal>
      <Reveal>
        <div style={{ position: 'relative', maxWidth: 960, margin: '150px auto 0' }}>
          {/* círculo de color detrás del collage */}
          <div style={{
            position: 'absolute', width: 'min(560px,86%)', aspectRatio: '1 / 1', borderRadius: '50%',
            background: '#F4D06F55', top: '46%', left: '60%', transform: 'translate(-50%,-50%)', zIndex: 0
          }} />
          <div className="gg-pers-mosaic" style={{
            position: 'relative', zIndex: 1, display: 'grid',
            gridTemplateColumns: '1.15fr 1fr 1.15fr',
            gridTemplateRows: '1fr 1fr',
            gridTemplateAreas: '"a b d" "a c d"',
            columnGap: 'clamp(30px,3vw,44px)', rowGap: 'clamp(78px,8vw,96px)', height: 'clamp(460px,52vw,580px)'
          }}>
            {ppl.map((p, i) => (
              /* Custom crayon tile (not CrayonCard) so the flex layout reaches the
                 content directly and the text can never overflow the fixed-height tile. */
              <div key={p.area} style={{ gridArea: p.area, minHeight: 0, position: 'relative', filter: 'drop-shadow(0 10px 18px rgba(61,40,23,0.18))' }}>
                {/* floating emotion balloon (pre-rendered PNG) — drifts gently above the tile */}
                <div style={{ position: 'absolute', top: p.inside ? p.btop : 0, left: p.bleft || '50%', width: p.bw, transform: `translate(-50%,${p.inside ? 0 : p.lift}%) rotate(${p.rot}deg)`, zIndex: 5, pointerEvents: 'none' }}>
                  <img src={p.balloon} alt={p.name} style={{ width: '100%', display: 'block', filter: 'drop-shadow(0 6px 12px rgba(61,40,23,0.18))', animation: `floatB ${4.2 + (p.area.charCodeAt(0) % 3) * 0.5}s ease-in-out infinite` }} />
                </div>
                <div style={{
                  position: 'relative', height: '100%', borderRadius: 24, padding: 14,
                  display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}>
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
                    viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="2" y="2" width="96" height="96" rx="6" ry="6" fill={`${p.color}55`}
                      stroke={PALETTE.ink} strokeWidth="2.5" filter="url(#cr)" vectorEffect="non-scaling-stroke" />
                  </svg>
                  {/* plant + text grouped and centered vertically so the plant scales
                     with the card (proportional) and the text sits around the middle,
                     not glued to the bottom. */}
                  <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '2%', paddingBottom: '3%' }}>
                    <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 8 }}>
                      <img src={p.photo} alt={p.name}
                        style={{
                          ...(p.ph ? { height: p.ph } : { maxHeight: '100%' }), maxWidth: '100%', objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 8px rgba(61,40,23,0.18))'
                        }} />
                    </div>
                    <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 'clamp(16px,1.5vw,20px)', color: PALETTE.ink, margin: '0 0 2px' }}>{p.name}</h3>
                    <div style={{ fontFamily: t.bf, fontSize: 11, color: PALETTE.inkSoft, fontWeight: 700, letterSpacing: '.5px' }}>{p.trait}</div>
                    <p style={{ fontFamily: t.bf, fontSize: 12, color: PALETTE.inkSoft, lineHeight: 1.4, margin: '4px 0 0' }}>{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

/* ═══ VARIANTS ═══ */
const Variants = ({ t }) => {
  const vars = [
    { name: 'Coral', photo: 'assets/pots/faceless/1.webp', bg: '#FBE9EC' },
    { name: 'Cielo', photo: 'assets/pots/faceless/2.webp', bg: '#E9F1F6' },
    { name: 'Lavanda', photo: 'assets/pots/faceless/3.webp', bg: '#F1EAF7' },
    { name: 'Sunny', photo: 'assets/pots/faceless/4.webp', bg: '#FBF5DC' },
  ];
  return (
    <section style={{ padding: 'clamp(60px,9vh,120px) clamp(20px,5vw,80px)', textAlign: 'center' }}>
      <Reveal>
        <div style={{ fontFamily: t.bf, fontSize: 13, fontWeight: 700, letterSpacing: '2px', color: PALETTE.pot, marginBottom: 12 }}>{L(t.lang, 'ELIGE LA TUYA', 'CHOOSE YOURS')}</div>
        <h2 style={{ fontFamily: t.hf, fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: PALETTE.ink }}>{L(t.lang, 'Diseñada para tu espacio', 'Designed for your space')}</h2>
        <CrayonUnderline color={PALETTE.pot} w="240px" delay={300} h={5} />
        <p style={{ fontFamily: t.bf, fontSize: 'clamp(14px,1.4vw,17px)', color: PALETTE.inkSoft, marginTop: 14, opacity: .85 }}>
          {L(t.lang, 'Macetas inteligentes que se ven bien en cualquier lugar.', 'Smart pots that look good anywhere.')}
        </p>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 22, maxWidth: 920, margin: '48px auto 0' }}>
        {vars.map((v, i) => (
          <Reveal key={i} delay={i * 100}>
            <CrayonCard fill={v.bg} stroke={PALETTE.ink} sw={2.5} radius={22} padding={20}>
              <div style={{ margin: '0 auto 10px', display: 'flex', justifyContent: 'center' }}>
                <img src={v.photo} alt={v.name}
                  style={{
                    height: 120, width: 'auto', objectFit: 'contain',
                    filter: 'saturate(0.82) drop-shadow(0 4px 10px rgba(61,40,23,0.18))'
                  }} />
              </div>
              <h3 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 17, color: PALETTE.ink, marginBottom: 8 }}>{v.name}</h3>
            </CrayonCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ═══ CTA ═══ */
const ROTATOR_IMGS = [
  'assets/pots/animated/1.webp',   // rosada · feliz
  'assets/pots/animated/2.webp',   // lila · dramática
  'assets/pots/animated/3.webp',   // azul · dormilona
  'assets/pots/animated/4.webp',   // amarilla · exigente
];

const PlantRotator = () => {
  const [active, setActive] = React.useState(0);
  const [prev, setPrev] = React.useState(null);
  React.useEffect(() => {
    const id = setInterval(() => {
      setActive(a => {
        setPrev(a);
        return (a + 1) % ROTATOR_IMGS.length;
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: 'relative', width: 'clamp(140px,18vw,200px)', height: 'clamp(140px,18vw,200px)', margin: '0 auto' }}>
      {ROTATOR_IMGS.map((src, i) => (
        <img key={src} src={src} alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
            filter: 'drop-shadow(0 8px 18px rgba(61,40,23,0.22))',
            opacity: i === active ? 1 : 0,
            transform: i === active ? 'scale(1) translateY(0)' : i === prev ? 'scale(0.94) translateY(6px)' : 'scale(0.94) translateY(6px)',
            transition: i === active
              ? 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)'
              : 'opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.4s cubic-bezier(.4,0,.2,1)',
          }} />
      ))}
    </div>
  );
};

const CTA = ({ t }) => (
  <section style={{ padding: 'clamp(70px,11vh,140px) clamp(20px,5vw,80px)', textAlign: 'center', position: 'relative' }}>
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <CrayonCard fill={`${PALETTE.leaf}30`} stroke={PALETTE.ink} sw={3} radius={32} padding={48}>
        <Reveal>
          <div style={{ fontFamily: t.bf, fontSize: 13, fontWeight: 700, letterSpacing: '2px', color: PALETTE.heart, marginBottom: 14 }}>{L(t.lang, 'LLÉVATELA A CASA', 'TAKE ONE HOME')}</div>
          <h2 style={{ fontFamily: t.hf, fontSize: 'clamp(30px,4.5vw,52px)', fontWeight: 800, color: PALETTE.ink, lineHeight: 1.05 }}>
            {L(t.lang, 'Tu nueva amiga', 'Your new friend')}
            <br />{L(t.lang, 'te está esperando.', 'is waiting for you.')}
          </h2>
          <CrayonUnderline color={PALETTE.heart} w="260px" delay={200} h={5} />
          <p style={{ fontFamily: t.bf, fontSize: 'clamp(15px,1.5vw,18px)', color: PALETTE.inkSoft, marginTop: 18, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            {L(t.lang, 'Pide tu Gossip Garden hoy. Llega con planta, sustrato, sensores y la app lista para que empiecen a hablarse.', 'Order your Gossip Garden today. It comes with plant, soil, sensors and the app ready so you two can start talking.')}
          </p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 24, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: t.hf, fontSize: 'clamp(34px,5vw,52px)', fontWeight: 900, color: PALETTE.ink, filter: 'url(#cr-text)' }}>$49</span>
            <span style={{ fontFamily: t.bf, fontSize: 14, color: PALETTE.inkSoft, opacity: .7, textDecoration: 'line-through' }}>$69</span>
            <span style={{ fontFamily: t.bf, fontSize: 13, color: PALETTE.heart, fontWeight: 700, marginLeft: 8 }}>{L(t.lang, '· envío gratis', '· free shipping')}</span>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <a href="store.html" style={{ textDecoration: 'none' }}><CrayonButton fill={PALETTE.heart} stroke={PALETTE.ink} color={PALETTE.cream}>{L(t.lang, 'Comprar maceta', 'Buy a pot')}</CrayonButton></a>
            <a href="store.html" style={{ textDecoration: 'none' }}><CrayonButton fill={PALETTE.cream} stroke={PALETTE.ink}>{L(t.lang, 'Ver la tienda', 'Visit the store')}</CrayonButton></a>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div style={{ marginTop: 36 }}>
            <PlantRotator />
          </div>
        </Reveal>
      </CrayonCard>
    </div>
  </section>
);

/* Correo donde llegan los mensajes de contacto (cámbialo por el real). */
const CONTACT_EMAIL = 'santigovanegas11@gmail.com';

/* ═══ DROPDOWN CRAYÓN (reemplaza el <select> nativo) ═══ */
const CrayonSelect = ({ t, value, options, onChange }) => {
  const P = PALETTE;
  const [open, setOpen] = React.useState(false);
  const [hov, setHov] = React.useState(-1);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        fontFamily: t.bf, fontSize: 14.5, fontWeight: 600, color: P.ink, background: P.cream,
        border: `2px solid ${P.ink}`, borderRadius: 14, padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
        boxShadow: open ? `2px 2px 0 ${P.ink}` : 'none', transition: 'box-shadow .15s'
      }}>
        <span>{value}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="M6 9l6 6 6-6" fill="none" stroke={P.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#cr)" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 5, background: P.cream,
          border: `2px solid ${P.ink}`, borderRadius: 16, overflow: 'hidden', boxShadow: `3px 4px 0 ${P.ink}22`, padding: 4
        }}>
          {options.map((opt, i) => {
            const sel = opt === value, h = hov === i;
            return (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 12px', borderRadius: 11,
                  fontFamily: t.bf, fontSize: 14.5, fontWeight: sel ? 800 : 600, cursor: 'pointer',
                  color: sel ? P.heart : P.ink, background: h ? `${P.pot}33` : (sel ? `${P.heart}14` : 'transparent'), transition: 'background .12s'
                }}>
                <span>{opt}</span>
                {sel && <svg width="15" height="15" viewBox="0 0 24 24"><path d="M5 12.5l4 4 10-10" fill="none" stroke={P.heart} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#cr)" /></svg>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══ MODAL DE CONTACTO ═══ */
const ContactModal = ({ t, onClose }) => {
  const P = PALETTE;
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [asunto, setAsunto] = React.useState(L(t.lang, 'Soporte', 'Support'));
  const [mensaje, setMensaje] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const fs = { width: '100%', fontFamily: t.bf, fontSize: 14.5, color: P.ink, background: P.cream, border: `2px solid ${P.ink}`, borderRadius: 14, padding: '10px 14px', outline: 'none' };

  const submit = async (e) => {
    e.preventDefault();
    if (hp) return; // bot
    if (!nombre.trim() || !email.trim() || mensaje.trim().length < 5) { setErr(L(t.lang, 'Completa tu nombre, correo y un mensaje.', 'Fill in your name, email and a message.')); return; }
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nombre, email, asunto, mensaje,
          _subject: `Gossip Garden — Contacto (${asunto})`,
          _template: 'table', _captcha: 'false',
        }),
      });
      setBusy(false);
      if (res.ok) setDone(true);
      else setErr(L(t.lang, 'No se pudo enviar. Inténtalo de nuevo en un momento.', 'Could not send. Please try again in a moment.'));
    } catch (e) { setBusy(false); setErr(L(t.lang, 'No se pudo enviar. Revisa tu conexión.', 'Could not send. Check your connection.')); }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(61,40,23,.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'clamp(340px,40vw,660px)', maxWidth: '94vw', maxHeight: '88vh', overflowY: 'auto' }}>
        <CrayonCard fill={P.cream} stroke={P.ink} sw={3} radius={26} padding={'34px clamp(40px,5vw,64px)'} hoverLift={false}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: 58, height: 58, margin: '0 auto 14px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="58" height="58" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill={`${P.leaf}55`} stroke={P.ink} strokeWidth="2" filter="url(#cr)" /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={P.leafDk} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" filter="url(#cr)" /></svg>
              </div>
              <h3 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 22, color: P.ink, marginBottom: 8 }}>{L(t.lang, '¡Mensaje enviado!', 'Message sent!')}</h3>
              <p style={{ fontFamily: t.bf, fontSize: 14.5, color: P.inkSoft, lineHeight: 1.6, marginBottom: 18 }}>{L(t.lang, 'Gracias por escribirnos. Te responderemos al correo que nos diste lo antes posible.', 'Thanks for reaching out. We’ll reply to the email you gave us as soon as possible.')}</p>
              <CrayonButton fill={P.heart} stroke={P.ink} color={P.cream} onClick={onClose}>{L(t.lang, 'Cerrar', 'Close')}</CrayonButton>
            </div>
          ) : (
            <>
              <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', fontSize: 28, lineHeight: 1, cursor: 'pointer', color: P.inkSoft, zIndex: 2 }}>×</button>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: t.hf, fontWeight: 900, fontSize: 26, color: P.ink }}>{L(t.lang, 'Contáctanos', 'Contact us')}</h3>
                <p style={{ fontFamily: t.bf, fontSize: 14.5, color: P.inkSoft, opacity: .85, marginTop: 8 }}>{L(t.lang, 'Cuéntanos en qué te ayudamos y te respondemos por correo.', 'Tell us how we can help and we’ll reply by email.')}</p>
              </div>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <input style={fs} placeholder={L(t.lang, 'Tu nombre', 'Your name')} value={nombre} maxLength={60} onChange={e => setNombre(e.target.value)} />
                <input style={fs} type="email" placeholder={L(t.lang, 'Tu correo', 'Your email')} value={email} maxLength={80} onChange={e => setEmail(e.target.value)} />
                <CrayonSelect t={t} value={asunto} options={t.lang === 'en' ? ['Support', 'Sales', 'Press', 'Other'] : ['Soporte', 'Ventas', 'Prensa', 'Otro']} onChange={setAsunto} />
                <textarea style={{ ...fs, resize: 'vertical', minHeight: 100, lineHeight: 1.5 }} placeholder={L(t.lang, 'Tu mensaje…', 'Your message…')} value={mensaje} maxLength={1500} onChange={e => setMensaje(e.target.value)} />
                <input tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                  <CrayonButton fill={P.heart} stroke={P.ink} color={P.cream} style={{ opacity: busy ? .6 : 1 }}>{busy ? L(t.lang, 'Enviando…', 'Sending…') : L(t.lang, 'Enviar mensaje', 'Send message')}</CrayonButton>
                  {err && <span style={{ fontFamily: t.bf, fontSize: 13, color: P.heart, fontWeight: 700 }}>{err}</span>}
                </div>
              </form>
            </>
          )}
        </CrayonCard>
      </div>
    </div>
  );
};

/* ═══ FOOTER ═══ */
const Footer = ({ t }) => {
  const [contactOpen, setContactOpen] = React.useState(false);
  return (
    <footer style={{
      padding: '40px clamp(20px,5vw,80px) 28px', marginTop: 30,
      borderTop: `2px dashed ${PALETTE.ink}33`
    }}>
      <style>{`.gg-foot-link{color:${PALETTE.inkSoft};opacity:.78;cursor:pointer;transition:color .15s ease,opacity .15s ease}.gg-foot-link:hover{color:${PALETTE.heart};opacity:1}`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 28, maxWidth: 1080, margin: '0 auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <img src="assets/icons/icon-crayon.png" alt="" style={{ width: 42, height: 42, objectFit: 'contain' }} />
            <span style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 16, color: PALETTE.ink, lineHeight: 1, filter: 'url(#cr-text)' }}>Gossip<br />Garden</span>
          </div>
          <p style={{ fontFamily: t.bf, fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, opacity: .8 }}>{L(t.lang, 'No solo la riegues, escúchala.', 'Don’t just water it — listen to it.')}</p>
        </div>
        {[
          { t: L(t.lang, 'Producto', 'Product'), l: [{ n: L(t.lang, 'Cómo funciona', 'How it works'), h: 'how-it-works.html' }, { n: L(t.lang, 'Personalidades', 'Personalities'), h: 'personalities.html' }, { n: L(t.lang, 'Tienda', 'Store'), h: 'store.html' }] },
          { t: L(t.lang, 'Recursos', 'Resources'), l: [{ n: 'Blog', h: 'blog/index.html' }, { n: L(t.lang, 'Guías', 'Guides'), h: '#' }, { n: 'FAQ', h: 'store.html#faq' }] },
          { t: 'Legal', l: [{ n: L(t.lang, 'Términos', 'Terms'), h: 'terms.html' }, { n: L(t.lang, 'Privacidad', 'Privacy'), h: 'privacy.html' }, { n: L(t.lang, 'Contacto', 'Contact'), action: 'contact' }] }
        ].map(col => (
          <div key={col.t}>
            <h4 style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 13, color: PALETTE.ink, marginBottom: 10, letterSpacing: '.3px' }}>{col.t}</h4>
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

/* ═══ FLOATING WIDGETS (Crayon Storybook style) ═══ */

/* Bottom-right: chatbot. FAB + crayon chat panel. Bot replies are canned for
   now (no backend) — ready to wire to a real assistant later. */
const ChatWidget = ({ t }) => {
  const P = PALETTE;
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [msgs, setMsgs] = React.useState([
    { from: 'bot', text: L(t.lang, '¡Hola! Soy la asistente de Gossip Garden. ¿En qué te ayudo?', 'Hi! I’m the Gossip Garden assistant. How can I help?') },
  ]);
  const endRef = React.useRef(null);
  React.useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' }); }, [msgs, open]);

  const REPLIES = t.lang === 'en' ? [
    'Would you like to know about the sensors, the personalities or the store?',
    'Each pot measures moisture, light and temperature, and writes to you when it needs you.',
    'You can build yours in the store: pick a color and a personality.',
    'Great question! Soon a human from the team will be able to help you here.',
  ] : [
    '¿Quieres saber de los sensores, las personalidades o la tienda?',
    'Cada maceta mide humedad, luz y temperatura, y te escribe cuando te necesita.',
    'Puedes armar la tuya en la tienda: eliges color y personalidad.',
    '¡Buena pregunta! Pronto un humano del equipo podrá ayudarte por aquí.',
  ];
  const send = (e) => {
    e.preventDefault();
    const txt = input.trim();
    if (!txt) return;
    setMsgs(m => [...m, { from: 'user', text: txt }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { from: 'bot', text: REPLIES[Math.floor(Math.random() * REPLIES.length)] }]), 600);
  };

  const bubble = (from) => ({
    alignSelf: from === 'bot' ? 'flex-start' : 'flex-end',
    background: from === 'bot' ? `${P.leaf}30` : '#FFE6CC',
    border: `2px solid ${P.ink}`, borderRadius: 14, padding: '8px 12px', maxWidth: '85%',
    fontFamily: t.bf, fontSize: 13, color: P.ink, lineHeight: 1.4, filter: 'url(#cr)',
  });

  return (
    <>
      <style>{`
        @keyframes ggChatPop{from{opacity:0;transform:translateY(14px) scale(.92)}to{opacity:1;transform:none}}
        .gg-fab{transition:transform .22s cubic-bezier(.34,1.56,.64,1)}
        .gg-fab:hover{transform:translateY(-3px) scale(1.07)}
        .gg-fab:active{transform:scale(.93)}
      `}</style>
      {open && (
        <div style={{ position: 'fixed', right: 32, bottom: 108, zIndex: 220, width: 'min(340px,calc(100vw - 48px))', transformOrigin: 'bottom right', animation: 'ggChatPop .3s cubic-bezier(.34,1.56,.64,1)' }}>
          <CrayonCard fill={P.cream} stroke={P.ink} sw={3} radius={24} padding={0} hoverLift={false} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: `${P.leaf}33`, borderBottom: `2px solid ${P.ink}` }}>
              <img src="assets/pots/animated/1.webp" alt="" style={{ width: 38, height: 38, objectFit: 'contain' }} />
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontFamily: t.hf, fontWeight: 800, fontSize: 15, color: P.ink }}>Plantita</div>
                <div style={{ fontFamily: t.bf, fontSize: 11, color: P.inkSoft }}>{L(t.lang, 'Asistente de Gossip Garden', 'Gossip Garden assistant')}</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar chat" style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 24, lineHeight: 1, cursor: 'pointer', color: P.inkSoft }}>×</button>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, height: 300, overflowY: 'auto' }}>
              {msgs.map((m, i) => <div key={i} style={bubble(m.from)}>{m.text}</div>)}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} style={{ display: 'flex', gap: 10, padding: '14px 16px 16px', borderTop: `2px solid ${P.ink}` }}>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={L(t.lang, 'Escribe un mensaje…', 'Type a message…')}
                style={{ flex: 1, minWidth: 0, fontFamily: t.bf, fontSize: 13, color: P.ink, background: P.cream, border: `2px solid ${P.ink}`, borderRadius: 14, padding: '10px 14px', outline: 'none' }} />
              <button type="submit" aria-label="Enviar" style={{ flexShrink: 0, background: P.heart, border: `2px solid ${P.ink}`, borderRadius: 14, width: 44, height: 42, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HandIcon type="send" size={20} color={P.cream} />
              </button>
            </form>
          </CrayonCard>
        </div>
      )}
      <button className="gg-fab" onClick={() => setOpen(o => !o)} aria-label="Abrir chat" style={{ position: 'fixed', right: 32, bottom: 32, zIndex: 220, width: 62, height: 62, background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 6px 14px rgba(61,40,23,0.28))' }}>
        <svg viewBox="0 0 62 62" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <circle cx="31" cy="31" r="28" fill={P.heart} stroke={P.ink} strokeWidth="2.5" filter="url(#cr)" />
        </svg>
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <HandIcon type="chat" size={28} color={P.cream} />
        </span>
      </button>
    </>
  );
};

/* Bottom-left: language switcher ES / EN. Flags are emoji placeholders — the
   `flag` field is meant to be swapped for an <img> when the real flag images
   arrive. (Content i18n itself is not wired yet; this stores the choice.) */
const LangSwitcher = ({ t }) => {
  const P = PALETTE;
  const lang = useLang();
  const choose = (l) => {
    try { localStorage.setItem('gg_lang', l); } catch (e) {}
    window.dispatchEvent(new CustomEvent('gg-lang', { detail: l }));
  };
  const langs = [
    { id: 'es', flag: '🇪🇸', label: 'Español' },
    { id: 'en', flag: '🇬🇧', label: 'English' },
  ];
  return (
    <div style={{ position: 'fixed', left: 32, bottom: 32, zIndex: 220, display: 'flex', gap: 12 }}>
      <style>{`
        .gg-lang{transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
        .gg-lang:hover{transform:translateY(-4px) scale(1.07) rotate(-3deg)}
        .gg-lang:active{transform:scale(.92)}
        .gg-lang-on{animation:ggLangPop .45s cubic-bezier(.34,1.56,.64,1)}
        @keyframes ggLangPop{0%{transform:scale(.7)}55%{transform:scale(1.18) rotate(5deg)}100%{transform:scale(1)}}
      `}</style>
      {langs.map(item => {
        const on = lang === item.id;
        return (
          <button key={item.id + (on ? '-on' : '')} className={'gg-lang' + (on ? ' gg-lang-on' : '')} onClick={() => choose(item.id)} title={item.label} aria-label={item.label} aria-pressed={on}
            style={{ position: 'relative', width: 52, height: 52, background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 5px 12px rgba(61,40,23,0.22))' }}>
            <svg viewBox="0 0 52 52" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <circle cx="26" cy="26" r="23" fill={on ? P.cream : P.bgDark} stroke={P.ink} strokeWidth={on ? 3 : 2} filter="url(#cr)" />
            </svg>
            {/* TODO: reemplazar el emoji por <img src="…bandera…"/> cuando lleguen las imágenes */}
            <span style={{ position: 'relative', display: 'block', fontSize: 24, lineHeight: '52px', textAlign: 'center', opacity: on ? 1 : .65 }}>{item.flag}</span>
          </button>
        );
      })}
    </div>
  );
};

Object.assign(window, { Nav, ScrollStory, Features, Personalities, Variants, CTA, Footer, ContactModal, ChatWidget, LangSwitcher, AlegreCard, DormilonaCard, DramaticaCard, ExigenteCard });
