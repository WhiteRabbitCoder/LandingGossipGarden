/* Sections v3 — full crayon aesthetic, no emojis, scroll-driven motion graphic */

const Nav = ({ t }) => {
  const [s, setS] = React.useState(false);
  const [o, setO] = React.useState(false);
  React.useEffect(() => {
    const h = () => setS(window.scrollY > 40);
    window.addEventListener('scroll', h, {passive:true});
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [
    {l:'Inicio', href:'#top'},
    {l:'Cómo funciona', href:'Como funciona.html'},
    {l:'Personalidades', href:'Personalidades.html'},
    {l:'Tienda', href:'Tienda.html'},
  ];
  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,height:72,
      display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 clamp(16px,4vw,48px)',
      background: s ? 'rgba(250,241,218,0.92)' : 'transparent', backdropFilter: s ? 'blur(10px)' : 'none',
      transition:'all 0.3s'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <img src="assets/icons/icon-crayon.png" alt="" style={{width:46,height:46,objectFit:'contain'}}/>
        <span style={{fontFamily:t.hf,fontWeight:800,fontSize:19,color:PALETTE.ink,lineHeight:1,filter:'url(#cr-text)'}}>Gossip<br/>Garden</span>
      </div>
      <div className="gg-nav-d" style={{display:'flex',alignItems:'center',gap:24}}>
        {links.map(({l,href},i)=><a key={l} href={href} style={{color:PALETTE.ink,textDecoration:'none',fontSize:14,fontWeight:600,fontFamily:t.bf,
          position:'relative',padding:'4px 2px'}}>
          {l}
          {i===0 && <div style={{position:'absolute',left:0,right:0,bottom:-4}}><CrayonUnderline color={PALETTE.leafDk} w="100%" h={3}/></div>}
        </a>)}
        <a href="Tienda.html" style={{textDecoration:'none'}}><CrayonButton fill={PALETTE.heart} stroke={PALETTE.ink} color={PALETTE.cream}>Comprar</CrayonButton></a>
      </div>
      <button className="gg-nav-m" onClick={()=>setO(!o)} style={{display:'none',background:'none',border:'none',fontSize:24,cursor:'pointer',color:PALETTE.ink}}>{o?'×':'≡'}</button>
      {o && <div style={{position:'absolute',top:72,left:0,right:0,background:'rgba(250,241,218,0.98)',padding:24,
        display:'flex',flexDirection:'column',gap:18,borderBottom:`2px solid ${PALETTE.ink}33`}}>
        {links.map(({l,href})=><a key={l} href={href} onClick={()=>setO(false)} style={{color:PALETTE.ink,textDecoration:'none',fontSize:18,fontWeight:600,fontFamily:t.bf}}>{l}</a>)}
      </div>}
    </nav>
  );
};

/* ── Scroll-driven 360° turntable of the real pot ─────────────────────────────
   120 pre-rendered WebP frames in assets/materas/maceta360/ are scrubbed to scroll
   position via GSAP ScrollTrigger and painted to a <canvas>. Falls back to the
   React `progress` value if GSAP (loaded from CDN) is unavailable. */
const MACETA_FRAMES = 100;                  // clean 360° turntable (dup/frozen source frames removed)
const MACETA_ASPECT = '318 / 353';          // matches the cropped frame size
const macetaFrameSrc = i => `assets/materas/maceta360/${String(i + 1).padStart(3, '0')}.webp`;

const Maceta360 = ({ containerRef, curBeat, nextBeat, tE, t, progress }) => {
  const canvasRef  = React.useRef(null);
  const imagesRef  = React.useRef([]);
  const setFrameRef = React.useRef(() => {});
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
      frame = Math.max(0, Math.min(MACETA_FRAMES - 1, i | 0));
      draw();
    };
    setFrameRef.current = setFrame;

    const sizeCanvas = () => {
      const dpr  = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      draw();
    };

    // Preload every frame; size the canvas once the first one decodes.
    let firstLoaded = false;
    imagesRef.current = [];
    for (let i = 0; i < MACETA_FRAMES; i++) {
      const img = new Image();
      img.onload = () => { if (!firstLoaded) { firstLoaded = true; sizeCanvas(); } };
      img.src = macetaFrameSrc(i);
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
          f: MACETA_FRAMES - 1,
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
    if (!gsapActive.current) setFrameRef.current(Math.round(progress * (MACETA_FRAMES - 1)));
  }, [progress]);

  return (
    <div style={{position:'relative',width:'100%'}}>
      <div style={{position:'absolute',bottom:'-4%',left:'50%',transform:'translateX(-50%)',
        width:'78%',height:'8%',
        background:'radial-gradient(ellipse at center,rgba(61,40,23,0.28) 0%,rgba(61,40,23,0) 70%)',
        filter:'blur(4px)',zIndex:-1}}/>
      <canvas ref={canvasRef} aria-label={curBeat.personality}
        style={{width:'100%',aspectRatio:MACETA_ASPECT,display:'block',
          filter:'drop-shadow(0 8px 14px rgba(61,40,23,0.15)) drop-shadow(0 22px 36px rgba(61,40,23,0.22))'}}/>
      <div style={{position:'absolute',top:'2%',right:'-4%',animation:'floatB 4s ease-in-out infinite'}}>
        <SpeechBubble fill={PALETTE.cream} color={PALETTE.ink} style={{padding:'13px 20px'}}>
          <span style={{fontFamily:t.bf,fontSize:14,fontWeight:700,color:PALETTE.ink,whiteSpace:'nowrap'}}>
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
    <div style={{paddingBottom:44}}>
      <div style={{fontFamily:t.bf,fontSize:12,fontWeight:700,letterSpacing:'2px',
        color:SC,marginBottom:12,display:'flex',alignItems:'center',gap:10}}>
        <svg width="28" height="3">
          <path d="M0,1.5 Q14,0 28,1.5" stroke={SC} strokeWidth="2.5" fill="none" filter="url(#cr)"/>
        </svg>
        {beat.kicker}
      </div>
      <h1 style={{fontFamily:t.hf,fontSize:'clamp(30px,3.8vw,54px)',fontWeight:800,lineHeight:1.02,
        color:PALETTE.ink,letterSpacing:'-1px',whiteSpace:'pre-line',marginBottom:6}}>
        {beat.title.split('\n').map((line,i,arr)=>(
          <div key={i} style={{position:'relative'}}>
            {line}
            {i===arr.length-1 && <div style={{marginTop:2}}><CrayonUnderline color={SC} w="58%" h={5} delay={0}/></div>}
          </div>
        ))}
      </h1>
      <p style={{fontFamily:t.bf,fontSize:'clamp(13px,1.1vw,16px)',color:PALETTE.inkSoft,
        lineHeight:1.5,marginTop:14,opacity:.92,maxWidth:380}}>
        {beat.body}
      </p>
      {isFirst && (
        <div style={{display:'flex',gap:12,marginTop:20,flexWrap:'wrap'}}>
          <CrayonButton fill={PALETTE.leaf} stroke={PALETTE.ink}>Descargar app</CrayonButton>
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
    window.addEventListener('scroll', onScroll, {passive:true});
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
    { kicker:'HOLA, SOY TU PLANTA',       title:'Hola.\nSoy tu planta.',  body:'Por primera vez, puedo contarte cómo me siento. No solo me riegues — escúchame.',                            card:'alegre',    photo:'assets/materas/verde.png',   speech:'¡Soy feliz contigo!', personality:'Alegre'    },
    { kicker:'CUATRO SENTIDOS',            title:'Cuatro\nsensores.',      body:'Humedad del suelo, humedad del aire, temperatura y luz. Los mido en silencio, cada minuto.',              card:'dormilona', photo:'assets/materas/azul.png',    speech:'Déjame dormir...',    personality:'Dormilona' },
    { kicker:'YO INICIO LA CONVERSACIÓN', title:'Te toco\nla puerta.',    body:'Cuando tengo sed, frío o demasiada sombra, te lo digo. Sin abrir la app — yo hablo primero.',             card:'dramatica', photo:'assets/materas/morado.png',  speech:'¡Esto es un drama!',  personality:'Dramática' },
    { kicker:'MEMORIA DE PLANTA',          title:'Recuerdo\ntodo.',        body:'Guardo 30 días de mi vida. Cada mes, un informe de cómo crecí y qué tan feliz estuve contigo.',           card:'exigente',  photo:'assets/materas/naranja.png', speech:'¿Ya me diste agua?',  personality:'Exigente'  },
  ];

  const FADE_START = 0.75;   // beats stay solid across most of each segment; transition only in the last 25% (so the 1/3, 2/3 snap marks land solid, not grey)
  const rawBeat  = progress * beats.length * 0.9999;
  const curIdx   = Math.min(beats.length - 1, Math.floor(rawBeat));
  const nextIdx  = Math.min(beats.length - 1, curIdx + 1);
  const fraction = rawBeat % 1;
  const tRaw = curIdx === nextIdx ? 0 : Math.max(0, (fraction - FADE_START) / (1 - FADE_START));
  const tE   = tRaw < 0.5 ? 2*tRaw*tRaw : 1 - Math.pow(-2*tRaw+2,2)/2;
  const curBeat  = beats[curIdx];
  const nextBeat = beats[nextIdx];

  return (
    <div ref={containerRef} style={{position:'relative',height:'400vh'}}>
      <div style={{position:'sticky',top:0,height:'100vh',overflow:'hidden',
        display:'flex',alignItems:'center',justifyContent:'center',
        padding:'80px clamp(16px,4vw,48px) 24px'}}>

        <div style={{position:'absolute',inset:0,
          background:`radial-gradient(circle at 50% 50%, ${PALETTE.cream} 0%, ${PALETTE.bg} 70%)`,zIndex:0}}/>

        <div className="gg-story-grid" style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',
          gap:'clamp(20px,4vw,60px)',maxWidth:1240,width:'100%',
          alignItems:'center',position:'relative',zIndex:2}}>

          {/* LEFT — text, always render both layers so CrayonUnderline never remounts */}
          <div style={{maxWidth:440,position:'relative',height:'clamp(260px,38vh,360px)'}}>
            {/* Fade through blank: outgoing text clears before incoming appears,
                so the two never overlap and letters never superimpose. */}
            <div style={{position:'absolute',inset:0,
              opacity:Math.max(0,1-tE*2), transition:'none',
              pointerEvents:tE>0.5?'none':'auto'}}>
              <StoryTextContent beat={curBeat} isFirst={curIdx===0} t={t}/>
            </div>
            <div style={{position:'absolute',inset:0,
              opacity:Math.max(0,tE*2-1), transition:'none',
              pointerEvents:tE<0.5?'none':'auto'}}>
              <StoryTextContent beat={nextBeat} isFirst={nextIdx===0} t={t}/>
            </div>
            {/* Progress dots */}
            <div style={{position:'absolute',bottom:'-36px',left:0,display:'flex',gap:6}}>
              {beats.map((_,i)=>{
                const dist=Math.abs(rawBeat-i);
                const w=dist<1?8+20*Math.max(0,1-dist):8;
                const op=dist<1?0.2+0.8*Math.max(0,1-dist):0.2;
                return <div key={i} style={{width:w,height:8,borderRadius:4,background:PALETTE.ink,opacity:op,transition:'none'}}/>;
              })}
            </div>
          </div>

          {/* CENTER — plant drifts vertically between beats */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div style={{
              width:'clamp(320px,42vw,560px)',
              transform:'none',
              transition:'none',
            }}>
              <Maceta360 containerRef={containerRef} curBeat={curBeat} nextBeat={nextBeat} tE={tE} t={t} progress={progress}/>
            </div>
          </div>

          {/* RIGHT — cards. Fade through blank (like the left text) so two
              different cards never overlap mid-transition. */}
          <div style={{display:'flex',justifyContent:'flex-start',position:'relative'}}>
            <div style={{
              position:curIdx===nextIdx?'relative':'absolute',
              opacity:Math.max(0,1-tE*2), transition:'none',
              pointerEvents:tE>0.5?'none':'auto'}}>
              {curBeat.card==='alegre'    && <AlegreCard    key={'c'+curIdx} t={t}/>}
              {curBeat.card==='dormilona' && <DormilonaCard key={'c'+curIdx} t={t}/>}
              {curBeat.card==='dramatica' && <DramaticaCard key={'c'+curIdx} t={t}/>}
              {curBeat.card==='exigente'  && <ExigenteCard  key={'c'+curIdx} t={t}/>}
            </div>
            {curIdx !== nextIdx && (
              <div style={{
                opacity:Math.max(0,tE*2-1), transition:'none',
                pointerEvents:tE<0.5?'none':'auto'}}>
                {nextBeat.card==='alegre'    && <AlegreCard    key={'n'+nextIdx} t={t}/>}
                {nextBeat.card==='dormilona' && <DormilonaCard key={'n'+nextIdx} t={t}/>}
                {nextBeat.card==='dramatica' && <DramaticaCard key={'n'+nextIdx} t={t}/>}
                {nextBeat.card==='exigente'  && <ExigenteCard  key={'n'+nextIdx} t={t}/>}
              </div>
            )}
          </div>
        </div>

        <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',
          fontFamily:t.bf,fontSize:12,fontWeight:600,color:PALETTE.inkSoft,letterSpacing:'2px',
          display:'flex',flexDirection:'column',alignItems:'center',gap:8,animation:'bounce 2s infinite',filter:'url(#cr-text)'}}>
          DESLIZA PARA DESCUBRIR
          <svg width="20" height="24" viewBox="0 0 20 24" style={{filter:'url(#cr)'}}>
            <path d="M10,4 L10,18 M4,12 L10,20 L16,12" stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const AlegreCard = ({ t }) => (
  <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={20} style={{minWidth:240,maxWidth:280}}>
    <div style={{fontFamily:t.hf,fontWeight:800,fontSize:14,color:PALETTE.ink,marginBottom:12,letterSpacing:'.5px'}}>HOY ME SIENTO...</div>
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{fontFamily:t.hf,fontWeight:800,fontSize:17,color:PALETTE.ink}}>¡Feliz!</div>
      <div style={{fontFamily:t.bf,fontSize:12,color:PALETTE.inkSoft}}>Tierra húmeda · Buen sol</div>
    </div>
    <div style={{height:1,background:PALETTE.ink+'22',margin:'10px 0'}}></div>
    <div style={{fontFamily:t.bf,fontSize:13,color:PALETTE.ink,fontStyle:'italic',lineHeight:1.4}}>
      "Hola humano. Hoy tengo todo lo que necesito gracias a ti."
    </div>
  </CrayonCard>
);

const DormilonaCard = ({ t }) => (
  <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={20} style={{minWidth:240,maxWidth:280}}>
    <div style={{fontFamily:t.hf,fontWeight:800,fontSize:14,color:PALETTE.ink,marginBottom:12,letterSpacing:'.5px'}}>4 SENSORES, 1 PLANTA TRANQUILA</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
      {[{icon:'drop',label:'Humedad'},{icon:'thermo',label:'Temperatura'},{icon:'sun',label:'Luz'},{icon:'cloud',label:'Aire'}].map((s,i)=>(
        <div key={i} style={{textAlign:'center',padding:'10px 6px',background:'#B8C9E820',borderRadius:12,filter:'url(#cr)'}}>
          <HandIcon type={s.icon} size={32} color={PALETTE.ink}/>
          <div style={{fontFamily:t.bf,fontSize:11,fontWeight:700,color:PALETTE.ink,marginTop:3}}>{s.label}</div>
        </div>
      ))}
    </div>
    <div style={{fontFamily:t.bf,fontSize:12,color:PALETTE.inkSoft,fontStyle:'italic',marginTop:12,textAlign:'center'}}>
      Los mido mientras duermo.
    </div>
  </CrayonCard>
);

const DramaticaCard = ({ t }) => {
  const [m, setM] = React.useState(0);
  React.useEffect(() => {
    const ts = [setTimeout(()=>setM(1),400), setTimeout(()=>setM(2),1400), setTimeout(()=>setM(3),2600)];
    return () => ts.forEach(clearTimeout);
  }, []);
  const msgs = [
    {from:'plant',text:'¡EMERGENCIA! Llevo 3 horas sin agua.'},
    {from:'user',text:'Voy corriendo.'},
    {from:'plant',text:'Ya era hora.'},
  ];
  return (
    <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={18} style={{minWidth:240,maxWidth:280}}>
      <div style={{fontFamily:t.hf,fontWeight:800,fontSize:14,color:PALETTE.ink,marginBottom:10,letterSpacing:'.5px'}}>HOY, 3:12 PM</div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {msgs.slice(0,m).map((mg,i)=>(
          <div key={i} style={{alignSelf:mg.from==='plant'?'flex-start':'flex-end',
            background:mg.from==='plant'?'#E0B8E040':'#FFE6CC',
            border:`2px solid ${PALETTE.ink}`,borderRadius:14,padding:'8px 12px',maxWidth:'85%',
            fontFamily:t.bf,fontSize:12.5,color:PALETTE.ink,lineHeight:1.4,filter:'url(#cr)',
            animation:'fadeUp 0.4s ease-out'}}>
            {mg.text}
          </div>
        ))}
      </div>
    </CrayonCard>
  );
};

const ExigenteCard = ({ t }) => (
  <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={20} padding={20} style={{minWidth:240,maxWidth:280}}>
    <div style={{fontFamily:t.hf,fontWeight:800,fontSize:14,color:PALETTE.ink,marginBottom:12,letterSpacing:'.5px'}}>MIS ÚLTIMOS 30 DÍAS</div>
    <svg viewBox="0 0 220 80" style={{width:'100%',height:70,filter:'url(#cr)'}}>
      <path d="M0,60 Q20,55 40,50 T80,40 Q100,35 120,38 T160,30 Q180,28 220,20" stroke={PALETTE.leafDk} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M0,60 Q20,55 40,50 T80,40 Q100,35 120,38 T160,30 Q180,28 220,20 L220,80 L0,80 Z" fill="#F5C2C2" opacity="0.35"/>
      {[0,40,80,120,160,200].map(x=><circle key={x} cx={x} cy={70-x*0.2} r="2.5" fill={PALETTE.leafDk}/>)}
    </svg>
    <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontFamily:t.bf,fontSize:11,color:PALETTE.inkSoft,fontWeight:600}}>
      <span>Día 1</span><span>Día 30</span>
    </div>
    <div style={{marginTop:10,padding:'8px 12px',background:'#F5C2C220',borderRadius:10,border:`1.5px solid ${PALETTE.ink}33`}}>
      <div style={{fontFamily:t.bf,fontSize:12,color:PALETTE.ink,fontWeight:700}}>Hidratación: 78% · Exijo al menos 85%.</div>
    </div>
  </CrayonCard>
);

/* ═══ FEATURES ═══ */
const Features = ({ t }) => {
  const items = [
    {icon:'sensor',title:'Sensores inteligentes',desc:'Monitorea humedad, temperatura y luz en tiempo real.'},
    {icon:'chat',title:'IA que conversa',desc:'Chatea con tu planta y recibe respuestas reales.'},
    {icon:'heart',title:'Personalidades únicas',desc:'Cada planta tiene su propio carácter y manera de ser.'},
    {icon:'bell',title:'Recordatorios',desc:'Te avisa cuando necesita agua, luz o cariño.'},
  ];
  return (
    <section style={{padding:'clamp(60px,9vh,120px) clamp(20px,5vw,80px)',textAlign:'center'}}>
      <Reveal>
        <div style={{fontFamily:t.bf,fontSize:13,fontWeight:700,letterSpacing:'2px',color:PALETTE.heart,marginBottom:12}}>POR QUÉ FUNCIONA</div>
        <h2 style={{fontFamily:t.hf,fontSize:'clamp(28px,4vw,46px)',fontWeight:800,color:PALETTE.ink,letterSpacing:'-.5px'}}>
          Tecnología que cuida con amor
        </h2>
        <CrayonUnderline color={PALETTE.heart} w="240px" delay={300} h={5}/>
        <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.4vw,17px)',color:PALETTE.inkSoft,marginTop:14,opacity:.85}}>
          Sensores + IA para entender a tu planta como nunca antes.
        </p>
      </Reveal>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:24,maxWidth:980,margin:'48px auto 0'}}>
        {items.map((f,i)=>(
          <Reveal key={i} delay={i*100}>
            <CrayonCard fill={PALETTE.cream} stroke={PALETTE.ink} sw={2.5} radius={22} padding={28}>
              <div style={{width:64,height:64,margin:'0 auto 14px',borderRadius:'50%',background:PALETTE.bg,
                display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${PALETTE.ink}`,filter:'url(#cr)'}}>
                <HandIcon type={f.icon} size={40} color={PALETTE.ink}/>
              </div>
              <h3 style={{fontFamily:t.hf,fontWeight:800,fontSize:17,color:PALETTE.ink,marginBottom:8}}>{f.title}</h3>
              <p style={{fontFamily:t.bf,fontSize:13.5,color:PALETTE.inkSoft,lineHeight:1.5}}>{f.desc}</p>
            </CrayonCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ═══ PERSONALITIES ═══ */
// Moodboard collage: interlocking tiles of different sizes over a soft circle
// accent, with depth from drop shadows.
const Personalities = ({ t }) => {
  // area = celda en el mosaico (a/d son altas, b/c chicas apiladas en medio).
  const ppl = [
    { area:'a', name:'Alegre',    color:'#F4D06F', photo:'assets/personalidades/alegre.webp',    trait:'Luminosa',  desc:'Te saluda cada mañana con buen humor.' },
    { area:'b', name:'Dormilona', color:'#8FBEEE', photo:'assets/personalidades/dormilona.webp', trait:'Tranquila', desc:'Calladita; rara vez pide algo.' },
    { area:'c', name:'Dramática', color:'#E0B8E0', photo:'assets/personalidades/dramatica.webp', trait:'Intensa',   desc:'Lo siente todo y te lo cuenta.' },
    { area:'d', name:'Exigente',  color:'#A8C88A', photo:'assets/personalidades/exigente.webp',  trait:'Directa',   desc:'Sabe lo que quiere y lo pide.' },
  ];
  return (
    <section style={{padding:'clamp(60px,9vh,120px) clamp(20px,5vw,80px)',textAlign:'center',overflow:'hidden'}}>
      <Reveal>
        <div style={{fontFamily:t.bf,fontSize:13,fontWeight:700,letterSpacing:'2px',color:PALETTE.leafDk,marginBottom:12}}>EL CARÁCTER DE TU PLANTA</div>
        <h2 style={{fontFamily:t.hf,fontSize:'clamp(28px,4vw,46px)',fontWeight:800,color:PALETTE.ink}}>
          Tu planta tiene personalidad
        </h2>
        <CrayonUnderline color={PALETTE.leafDk} w="340px" delay={300} h={5}/>
        <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.4vw,17px)',color:PALETTE.inkSoft,marginTop:14,opacity:.85}}>
          Cada maceta desarrolla su propio carácter. ¿Cuál va contigo?
        </p>
      </Reveal>
      <Reveal>
        <div style={{position:'relative',maxWidth:960,margin:'56px auto 0'}}>
          {/* círculo de color detrás del collage */}
          <div style={{position:'absolute',width:'min(560px,86%)',aspectRatio:'1 / 1',borderRadius:'50%',
            background:'#F4D06F55',top:'46%',left:'60%',transform:'translate(-50%,-50%)',zIndex:0}}/>
          <div className="gg-pers-mosaic" style={{position:'relative',zIndex:1,display:'grid',
            gridTemplateColumns:'1.15fr 1fr 1.15fr',
            gridTemplateRows:'1fr 1fr',
            gridTemplateAreas:'"a b d" "a c d"',
            gap:16,height:'clamp(440px,50vw,560px)'}}>
            {ppl.map((p,i)=>(
              /* Custom crayon tile (not CrayonCard) so the flex layout reaches the
                 content directly and the text can never overflow the fixed-height tile. */
              <div key={p.area} style={{gridArea:p.area,minHeight:0,filter:'drop-shadow(0 12px 22px rgba(61,40,23,0.20))'}}>
                <div style={{position:'relative',height:'100%',borderRadius:24,padding:14,
                  display:'flex',flexDirection:'column',overflow:'hidden'}}>
                  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}}
                    viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="2" y="2" width="96" height="96" rx="6" ry="6" fill={`${p.color}55`}
                      stroke={PALETTE.ink} strokeWidth="2.5" filter="url(#cr)" vectorEffect="non-scaling-stroke"/>
                  </svg>
                  <div style={{position:'relative',zIndex:1,flex:1,minHeight:0,display:'flex',flexDirection:'column'}}>
                    <div style={{flex:1,minHeight:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <img src={p.photo} alt={p.name}
                        style={{maxHeight:'100%',maxWidth:'100%',objectFit:'contain',
                          filter:'drop-shadow(0 4px 8px rgba(61,40,23,0.18))'}}/>
                    </div>
                    <h3 style={{fontFamily:t.hf,fontWeight:800,fontSize:'clamp(16px,1.5vw,20px)',color:PALETTE.ink,margin:'4px 0 2px'}}>{p.name}</h3>
                    <div style={{fontFamily:t.bf,fontSize:11,color:PALETTE.inkSoft,fontWeight:700,letterSpacing:'.5px'}}>{p.trait}</div>
                    <p style={{fontFamily:t.bf,fontSize:12,color:PALETTE.inkSoft,lineHeight:1.4,margin:'4px 0 0'}}>{p.desc}</p>
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
    {name:'Coral',   photo:'assets/materas/sincara/1.webp', bg:'#FBE9EC'},
    {name:'Cielo',   photo:'assets/materas/sincara/2.webp', bg:'#E9F1F6'},
    {name:'Lavanda', photo:'assets/materas/sincara/3.webp', bg:'#F1EAF7'},
    {name:'Sunny',   photo:'assets/materas/sincara/4.webp', bg:'#FBF5DC'},
  ];
  return (
    <section style={{padding:'clamp(60px,9vh,120px) clamp(20px,5vw,80px)',textAlign:'center'}}>
      <Reveal>
        <div style={{fontFamily:t.bf,fontSize:13,fontWeight:700,letterSpacing:'2px',color:PALETTE.pot,marginBottom:12}}>ELIGE LA TUYA</div>
        <h2 style={{fontFamily:t.hf,fontSize:'clamp(28px,4vw,46px)',fontWeight:800,color:PALETTE.ink}}>Diseñada para tu espacio</h2>
        <CrayonUnderline color={PALETTE.pot} w="240px" delay={300} h={5}/>
        <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.4vw,17px)',color:PALETTE.inkSoft,marginTop:14,opacity:.85}}>
          Macetas inteligentes que se ven bien en cualquier lugar.
        </p>
      </Reveal>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:22,maxWidth:920,margin:'48px auto 0'}}>
        {vars.map((v,i)=>(
          <Reveal key={i} delay={i*100}>
            <CrayonCard fill={v.bg} stroke={PALETTE.ink} sw={2.5} radius={22} padding={20}>
              <div style={{margin:'0 auto 10px',display:'flex',justifyContent:'center'}}>
                <img src={v.photo} alt={v.name}
                  style={{height:120,width:'auto',objectFit:'contain',
                    filter:'saturate(0.82) drop-shadow(0 4px 10px rgba(61,40,23,0.18))'}}/>
              </div>
              <h3 style={{fontFamily:t.hf,fontWeight:800,fontSize:17,color:PALETTE.ink,marginBottom:8}}>{v.name}</h3>
            </CrayonCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ═══ CTA ═══ */
const ROTATOR_IMGS = [
  'assets/materas/animadas/1.webp',   // rosada · feliz
  'assets/materas/animadas/2.webp',   // lila · dramática
  'assets/materas/animadas/3.webp',   // azul · dormilona
  'assets/materas/animadas/4.webp',   // amarilla · exigente
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
    <div style={{position:'relative',width:'clamp(140px,18vw,200px)',height:'clamp(140px,18vw,200px)',margin:'0 auto'}}>
      {ROTATOR_IMGS.map((src, i) => (
        <img key={src} src={src} alt=""
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',
            filter:'drop-shadow(0 8px 18px rgba(61,40,23,0.22))',
            opacity: i === active ? 1 : 0,
            transform: i === active ? 'scale(1) translateY(0)' : i === prev ? 'scale(0.94) translateY(6px)' : 'scale(0.94) translateY(6px)',
            transition: i === active
              ? 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)'
              : 'opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.4s cubic-bezier(.4,0,.2,1)',
          }}/>
      ))}
    </div>
  );
};

const CTA = ({ t }) => (
  <section style={{padding:'clamp(70px,11vh,140px) clamp(20px,5vw,80px)',textAlign:'center',position:'relative'}}>
    <div style={{maxWidth:760,margin:'0 auto'}}>
      <CrayonCard fill={`${PALETTE.leaf}30`} stroke={PALETTE.ink} sw={3} radius={32} padding={48}>
        <Reveal>
          <div style={{fontFamily:t.bf,fontSize:13,fontWeight:700,letterSpacing:'2px',color:PALETTE.heart,marginBottom:14}}>LLÉVATELA A CASA</div>
          <h2 style={{fontFamily:t.hf,fontSize:'clamp(30px,4.5vw,52px)',fontWeight:800,color:PALETTE.ink,lineHeight:1.05}}>
            Tu nueva amiga
            <br/>te está esperando.
          </h2>
          <CrayonUnderline color={PALETTE.heart} w="260px" delay={200} h={5}/>
          <p style={{fontFamily:t.bf,fontSize:'clamp(15px,1.5vw,18px)',color:PALETTE.inkSoft,marginTop:18,maxWidth:520,marginLeft:'auto',marginRight:'auto'}}>
            Pide tu Gossip Garden hoy. Llega con planta, sustrato, sensores y la app lista para que empiecen a hablarse.
          </p>
          <div style={{display:'flex',gap:6,justifyContent:'center',marginTop:24,alignItems:'baseline',flexWrap:'wrap'}}>
            <span style={{fontFamily:t.hf,fontSize:'clamp(34px,5vw,52px)',fontWeight:900,color:PALETTE.ink,filter:'url(#cr-text)'}}>$49</span>
            <span style={{fontFamily:t.bf,fontSize:14,color:PALETTE.inkSoft,opacity:.7,textDecoration:'line-through'}}>$69</span>
            <span style={{fontFamily:t.bf,fontSize:13,color:PALETTE.heart,fontWeight:700,marginLeft:8}}>· envío gratis</span>
          </div>
          <div style={{display:'flex',gap:14,justifyContent:'center',marginTop:24,flexWrap:'wrap'}}>
            <a href="Tienda.html" style={{textDecoration:'none'}}><CrayonButton fill={PALETTE.heart} stroke={PALETTE.ink} color={PALETTE.cream}>Comprar maceta</CrayonButton></a>
            <a href="Tienda.html" style={{textDecoration:'none'}}><CrayonButton fill={PALETTE.cream} stroke={PALETTE.ink}>Ver la tienda</CrayonButton></a>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div style={{marginTop:36}}>
            <PlantRotator/>
          </div>
        </Reveal>
      </CrayonCard>
    </div>
  </section>
);

/* ═══ FOOTER ═══ */
const Footer = ({ t }) => (
  <footer style={{padding:'40px clamp(20px,5vw,80px) 28px',marginTop:30,
    borderTop:`2px dashed ${PALETTE.ink}33`}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:28,maxWidth:1080,margin:'0 auto'}}>
      <div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <img src="assets/icons/icon-crayon.png" alt="" style={{width:42,height:42,objectFit:'contain'}}/>
          <span style={{fontFamily:t.hf,fontWeight:800,fontSize:16,color:PALETTE.ink,lineHeight:1,filter:'url(#cr-text)'}}>Gossip<br/>Garden</span>
        </div>
        <p style={{fontFamily:t.bf,fontSize:12.5,color:PALETTE.inkSoft,lineHeight:1.5,opacity:.8}}>No solo la riegues, escúchala.</p>
      </div>
      {[
        {t:'Producto',l:[{n:'Cómo funciona',h:'Como funciona.html'},{n:'Personalidades',h:'Personalidades.html'},{n:'Tienda',h:'Tienda.html'}]},
        {t:'Recursos',l:[{n:'Blog',h:'#'},{n:'Guías',h:'#'},{n:'FAQ',h:'#'}]},
        {t:'Legal',l:[{n:'Términos',h:'#'},{n:'Privacidad',h:'#'},{n:'Contacto',h:'#'}]}
      ].map(col=>(
        <div key={col.t}>
          <h4 style={{fontFamily:t.hf,fontWeight:800,fontSize:13,color:PALETTE.ink,marginBottom:10,letterSpacing:'.3px'}}>{col.t}</h4>
          {col.l.map(({n,h})=><a key={n} href={h} style={{display:'block',fontFamily:t.bf,fontSize:13,color:PALETTE.inkSoft,opacity:.75,
            textDecoration:'none',marginBottom:6}}>{n}</a>)}
        </div>
      ))}
    </div>
  </footer>
);

Object.assign(window, { Nav, ScrollStory, Features, Personalities, Variants, CTA, Footer, AlegreCard, DormilonaCard, DramaticaCard, ExigenteCard });
