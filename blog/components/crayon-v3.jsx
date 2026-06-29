/* Crayon system v3 — matching icon aesthetic: cream bg, dark brown outlines, textured fills, no emojis */

const PALETTE = {
  bg: '#FAF1DA',          // cream paper background (like icon)
  bgDark: '#F0E2C0',
  ink: '#3D2817',         // dark brown outline (like icon)
  inkSoft: '#6B4A2E',
  pot: '#E8A95C',         // pot orange/tan
  potDk: '#C68A40',
  leaf: '#8AC553',
  leafDk: '#5FA037',
  heart: '#E85D52',
  cream: '#FFF8E7',
  shadow: 'rgba(61,40,23,0.08)',
};

/* SVG defs: turbulence for hand-drawn jitter + crayon paper texture pattern */
const CrayonDefs = () => (
  <svg style={{position:'absolute',width:0,height:0}} aria-hidden="true">
    <defs>
      {/* Subtle crayon jitter — reduced amplitude */}
      <filter id="cr">
        <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="2" result="n" seed="3"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="0.9" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      {/* Soft crayon TEXTURE filter for type — adds grain without distorting silhouettes */}
      <filter id="cr-text" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="2" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" result="grain"/>
        <feComposite in="grain" in2="SourceGraphic" operator="in" result="texturedGrain"/>
        <feMerge>
          <feMergeNode in="SourceGraphic"/>
          <feMergeNode in="texturedGrain"/>
        </feMerge>
      </filter>
      {/* Crayon stroke texture — coarse noise on a tinted fill */}
      <filter id="crayon-fill" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" result="alpha"/>
        <feComposite in="alpha" in2="SourceGraphic" operator="in" result="texturedNoise"/>
        <feBlend in="SourceGraphic" in2="texturedNoise" mode="multiply"/>
      </filter>
    </defs>
  </svg>
);

/* Reveal on scroll */
const Reveal = ({ children, delay=0, y=24, className='', style={} }) => {
  const [v, setV] = React.useState(false);
  const r = React.useRef(null);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);o.disconnect();} }, {threshold:0.12});
    if(r.current) o.observe(r.current);
    return () => o.disconnect();
  }, []);
  return <div ref={r} className={className} style={{...style,opacity:v?1:0,transform:v?'none':`translateY(${y}px)`,
    transition:`opacity 0.8s cubic-bezier(.4,0,.2,1) ${delay}ms,transform 0.8s cubic-bezier(.4,0,.2,1) ${delay}ms`}}>{children}</div>;
};

/* Hand-drawn box: rounded, jittery dark-brown outline, paper-textured fill */
const CrayonCard = ({ children, fill=PALETTE.cream, stroke=PALETTE.ink, sw=3, radius=24, padding=24, style={}, hover=false, hoverLift=true }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <div style={{position:'relative',padding,borderRadius:radius,
      transition:'transform 0.3s cubic-bezier(.4,0,.2,1)',
      transform: hov && hoverLift ? 'translateY(-4px)' : 'none',
      ...style}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}
        viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="2" y="2" width="96" height="96" rx={radius/4} ry={radius/4}
          fill={fill} stroke={stroke} strokeWidth={sw*0.4} strokeLinejoin="round"
          filter="url(#cr)" vectorEffect="non-scaling-stroke" style={{strokeWidth:sw}}/>
      </svg>
      <div style={{position:'relative',zIndex:1}}>{children}</div>
    </div>
  );
};

/* Crayon pill button */
const CrayonButton = ({ children, fill=PALETTE.pot, stroke=PALETTE.ink, color=PALETTE.ink, onClick, style={} }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} style={{position:'relative',padding:'12px 28px',background:'none',border:'none',cursor:'pointer',
      fontFamily:'inherit',fontSize:15,fontWeight:700,color,letterSpacing:'.3px',
      transition:'transform 0.2s', transform: h?'translateY(-2px) rotate(-0.5deg)':'none', ...style}}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0}} viewBox="0 0 200 50" preserveAspectRatio="none">
        <rect x="3" y="3" width="194" height="44" rx="22" ry="22" fill={fill} stroke={stroke} strokeWidth="2.5" filter="url(#cr)"/>
        <rect x="3" y="3" width="194" height="44" rx="22" ry="22" fill="url(#crayon-grain)" opacity="0.3"/>
      </svg>
      <span style={{position:'relative',zIndex:1}}>{children}</span>
    </button>
  );
};

/* Crayon underline */
const CrayonUnderline = ({ color=PALETTE.heart, w='60%', delay=0, h=5 }) => {
  const [on, setOn] = React.useState(false);
  const r = React.useRef(null);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting){setTimeout(()=>setOn(true),delay);o.disconnect();} }, {threshold:0.5});
    if(r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [delay]);
  return (
    <svg ref={r} viewBox="0 0 200 14" style={{width:w,height:h+10,display:'block',overflow:'visible',filter:'url(#cr)'}} preserveAspectRatio="none">
      <path d="M3,8 Q40,2 90,9 T196,5" fill="none" stroke={color} strokeWidth={h} strokeLinecap="round"
        strokeDasharray="220" strokeDashoffset={on?0:220}
        style={{transition:`stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1) ${delay}ms`}}/>
    </svg>
  );
};

/* Hand-drawn icons: water drop, chat bubble, heart, bell — replacing emojis */
const HandIcon = ({ type, size=48, color=PALETTE.ink, fill=null }) => {
  const f = fill || PALETTE.cream;
  const icons = {
    drop: <g><path d="M24,6 C24,6 12,20 12,30 A12 12 0 0 0 36 30 C36,20 24,6 24,6Z" fill="#9DC8E8" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/><ellipse cx="20" cy="26" rx="3" ry="5" fill="#fff" opacity=".4"/></g>,
    chat: <g><path d="M8,14 Q8,8 16,8 L34,8 Q40,8 40,14 L40,26 Q40,32 34,32 L22,32 L14,40 L16,32 Q8,32 8,26Z" fill={f} stroke={color} strokeWidth="2.5" strokeLinejoin="round"/><circle cx="18" cy="20" r="1.8" fill={color}/><circle cx="24" cy="20" r="1.8" fill={color}/><circle cx="30" cy="20" r="1.8" fill={color}/></g>,
    heart: <path d="M24,40 C8,28 4,18 10,12 C16,6 22,10 24,16 C26,10 32,6 38,12 C44,18 40,28 24,40Z" fill={PALETTE.heart} stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>,
    bell: <g><path d="M16,30 Q12,30 14,26 L16,18 Q17,8 24,8 Q31,8 32,18 L34,26 Q36,30 32,30 Z" fill="#F4D06F" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/><circle cx="24" cy="34" r="3" fill={color}/><line x1="24" y1="4" x2="24" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></g>,
    sun: <g><circle cx="24" cy="24" r="9" fill="#F4D06F" stroke={color} strokeWidth="2.5"/>{[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={24+12*Math.cos(a*Math.PI/180)} y1={24+12*Math.sin(a*Math.PI/180)} x2={24+18*Math.cos(a*Math.PI/180)} y2={24+18*Math.sin(a*Math.PI/180)} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>)}</g>,
    thermo: <g><rect x="20" y="6" width="8" height="26" rx="4" fill={f} stroke={color} strokeWidth="2.5"/><circle cx="24" cy="36" r="6" fill={PALETTE.heart} stroke={color} strokeWidth="2.5"/><line x1="24" y1="14" x2="24" y2="32" stroke={PALETTE.heart} strokeWidth="3" strokeLinecap="round"/></g>,
    cloud: <g><path d="M14,28 Q6,28 8,20 Q10,14 18,16 Q20,10 28,12 Q36,12 38,20 Q44,22 42,28 Z" fill={f} stroke={color} strokeWidth="2.5" strokeLinejoin="round"/></g>,
    leaf: <path d="M10,38 Q4,20 22,8 Q40,18 38,38 Q24,32 10,38Z M22,8 Q24,28 22,38" fill={PALETTE.leaf} stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>,
    sensor: <g><rect x="8" y="10" width="32" height="28" rx="4" fill={f} stroke={color} strokeWidth="2.5"/><circle cx="24" cy="20" r="5" fill={PALETTE.leaf} stroke={color} strokeWidth="2"/><path d="M14,32 L18,28 L24,32 L34,24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/></g>,
    arrow: <path d="M14,24 L34,24 M28,16 L34,24 L28,32" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>,
    sparkle: <g><path d="M24,6 L26,20 L40,24 L26,28 L24,42 L22,28 L8,24 L22,20 Z" fill="#F4D06F" stroke={color} strokeWidth="2"/></g>,
    apple: <g><path d="M16,14 Q24,10 32,14 Q40,18 38,30 Q34,40 24,40 Q14,40 10,30 Q8,18 16,14Z" fill={f} stroke={color} strokeWidth="2.5"/><path d="M24,14 Q24,8 28,6" fill="none" stroke={color} strokeWidth="2"/></g>,
    play: <path d="M14,10 L36,24 L14,38 Z" fill={f} stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>,
    send: <path d="M6,24 L42,8 L34,42 L24,28 L6,24 Z M24,28 L42,8" fill={f} stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 48 48" style={{filter:'url(#cr)'}}>{icons[type]||icons.heart}</svg>;
};

/* Hand-drawn pot with face — SVG-based crayon style matching icon */
const CrayonPot = ({ size=200, mood='happy', tint=null }) => {
  const moods = {
    happy: { eye:'arc', mouth:'M20,30 Q24,33 28,30' },
    sleepy:{ eye:'line', mouth:'M21,30 Q24,32 27,30' },
    drama: { eye:'wide', mouth:'M22,28 Q24,32 26,28' },
    stern: { eye:'dot',  mouth:'M21,31 L27,31' },
  };
  const m = moods[mood] || moods.happy;
  const potFill = tint || PALETTE.pot;
  return (
    <svg width={size} height={size*1.05} viewBox="0 0 100 105" style={{display:'block'}}>
      {/* Leaves */}
      <g filter="url(#cr)">
        <path d="M44,30 Q30,24 28,38 Q32,46 44,42 Q46,36 44,30Z" fill={PALETTE.leaf} stroke={PALETTE.ink} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M56,30 Q70,24 72,38 Q68,46 56,42 Q54,36 56,30Z" fill={PALETTE.leafDk} stroke={PALETTE.ink} strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="50" y1="40" x2="50" y2="58" stroke={PALETTE.leafDk} strokeWidth="2" strokeLinecap="round"/>
      </g>
      {/* Pot */}
      <g filter="url(#cr)">
        <path d="M24,58 L76,58 L72,98 Q72,100 50,100 Q28,100 28,98 Z"
          fill={potFill} stroke={PALETTE.ink} strokeWidth="2"/>
        {/* Pot rim */}
        <path d="M22,58 Q22,54 26,54 L74,54 Q78,54 78,58 L76,62 Q76,64 50,64 Q24,64 24,62 Z"
          fill={potFill} stroke={PALETTE.ink} strokeWidth="2"/>
        {/* Soil */}
        <ellipse cx="50" cy="58" rx="22" ry="2.5" fill="#5C3D2E" stroke={PALETTE.ink} strokeWidth="1.5"/>
        {/* Texture lines */}
        <path d="M30,72 L34,90 M44,68 L46,94 M58,68 L56,94 M70,72 L66,90" stroke={PALETTE.potDk} strokeWidth="0.8" opacity="0.5"/>
        {/* Face */}
        <g>
          {m.eye === 'arc' && <><path d="M38,76 Q40,78 42,76" stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M58,76 Q60,78 62,76" stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round"/></>}
          {m.eye === 'line' && <><line x1="38" y1="78" x2="42" y2="78" stroke={PALETTE.ink} strokeWidth="2" strokeLinecap="round"/><line x1="58" y1="78" x2="62" y2="78" stroke={PALETTE.ink} strokeWidth="2" strokeLinecap="round"/></>}
          {m.eye === 'wide' && <><circle cx="40" cy="77" r="2" fill={PALETTE.ink}/><circle cx="60" cy="77" r="2" fill={PALETTE.ink}/></>}
          {m.eye === 'dot' && <><circle cx="40" cy="77" r="1.2" fill={PALETTE.ink}/><circle cx="60" cy="77" r="1.2" fill={PALETTE.ink}/></>}
          <ellipse cx="36" cy="83" rx="2.5" ry="1.5" fill={PALETTE.heart} opacity="0.35"/>
          <ellipse cx="64" cy="83" rx="2.5" ry="1.5" fill={PALETTE.heart} opacity="0.35"/>
          <path d="M44,84 Q50,88 56,84" stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  );
};

/* Speech bubble with crayon outline */
const SpeechBubble = ({ children, color=PALETTE.ink, fill=PALETTE.cream, style={} }) => (
  <div style={{position:'relative',display:'inline-block',padding:'10px 16px',...style}}>
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0}} viewBox="0 0 100 60" preserveAspectRatio="none">
      <path d="M10,8 Q4,8 4,18 L4,38 Q4,48 14,48 L24,48 L20,58 L32,48 L86,48 Q96,48 96,38 L96,18 Q96,8 86,8 Z"
        fill={fill} stroke={color} strokeWidth="2" filter="url(#cr)"/>
    </svg>
    <span style={{position:'relative',zIndex:1}}>{children}</span>
  </div>
);

/* Real pot photo with crayon-circle backdrop + mood expression overlay */
const RealPot = ({ size=140, mood='happy', tint='#A8D5A2' }) => {
  const moods = {
    happy:  { eyes:'arc',  mouth:'M42,62 Q50,68 58,62' },
    sleepy: { eyes:'line', mouth:'M44,63 Q50,66 56,63' },
    drama:  { eyes:'wide', mouth:'M44,60 Q50,68 56,60' },
    stern:  { eyes:'dot',  mouth:'M44,64 L56,64' },
  };
  const m = moods[mood] || moods.happy;
  return (
    <div style={{position:'relative',width:size,height:size,display:'inline-block'}}>
      {/* Crayon circle backdrop */}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position:'absolute',inset:0}}>
        <circle cx="50" cy="50" r="44" fill={tint} stroke={PALETTE.ink} strokeWidth="2.5" filter="url(#cr)" opacity="0.85"/>
        {/* Decorative crayon scribbles around */}
        <path d="M14,30 Q10,26 14,22" stroke={PALETTE.ink} strokeWidth="1.5" fill="none" filter="url(#cr)" opacity="0.5"/>
        <path d="M86,32 L92,28 M88,26 L92,30" stroke={PALETTE.ink} strokeWidth="1.5" fill="none" filter="url(#cr)" opacity="0.5"/>
        <path d="M16,76 L12,82" stroke={PALETTE.ink} strokeWidth="1.5" fill="none" filter="url(#cr)" opacity="0.5"/>
      </svg>
      {/* Real pot image, clipped/contained inside circle */}
      <img src="assets/pots/hero/pot-real.png" alt=""
        style={{position:'absolute',top:'8%',left:'10%',width:'80%',height:'80%',objectFit:'contain',
          filter:'drop-shadow(0 3px 6px rgba(61,40,23,0.25))'}}/>
      {/* Mood expression overlaid on pot body (lower portion) */}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <g filter="url(#cr)">
          {m.eyes === 'arc'  && <><path d="M40,55 Q42,57 44,55" stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M56,55 Q58,57 60,55" stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round"/></>}
          {m.eyes === 'line' && <><line x1="40" y1="56" x2="44" y2="56" stroke={PALETTE.ink} strokeWidth="2" strokeLinecap="round"/><line x1="56" y1="56" x2="60" y2="56" stroke={PALETTE.ink} strokeWidth="2" strokeLinecap="round"/></>}
          {m.eyes === 'wide' && <><circle cx="42" cy="56" r="2" fill={PALETTE.ink}/><circle cx="58" cy="56" r="2" fill={PALETTE.ink}/></>}
          {m.eyes === 'dot'  && <><circle cx="42" cy="56" r="1.3" fill={PALETTE.ink}/><circle cx="58" cy="56" r="1.3" fill={PALETTE.ink}/></>}
          <ellipse cx="38" cy="61" rx="2.4" ry="1.4" fill={PALETTE.heart} opacity="0.4"/>
          <ellipse cx="62" cy="61" rx="2.4" ry="1.4" fill={PALETTE.heart} opacity="0.4"/>
          <path d={m.mouth} stroke={PALETTE.ink} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
};

/* ═══ i18n (copia autónoma para el blog; el sitio raíz lo define en sections-v3.jsx) ═══
   L(lang, es, en) devuelve el string del idioma activo. La preferencia se guarda
   en localStorage('gg_lang') y se comparte con el sitio raíz vía el evento 'gg-lang'. */
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
            <span style={{ position: 'relative', display: 'block', fontSize: 24, lineHeight: '52px', textAlign: 'center', opacity: on ? 1 : .65 }}>{item.flag}</span>
          </button>
        );
      })}
    </div>
  );
};

Object.assign(window, { L, useLang, LangSwitcher, CrayonDefs, Reveal, CrayonCard, CrayonButton, CrayonUnderline, HandIcon, CrayonPot, RealPot, SpeechBubble, PALETTE });
