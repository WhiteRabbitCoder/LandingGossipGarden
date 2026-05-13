/* Crayon / hand-drawn visual effects & utilities */

// SVG filter for hand-drawn jitter effect
const CrayonFilter = () => (
  <svg style={{position:'absolute',width:0,height:0}}>
    <defs>
      <filter id="crayon-jitter">
        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="crayon-heavy">
        <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" result="noise" seed="5"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="paper-texture">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" stitchTiles="stitch" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
        <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="textured"/>
      </filter>
    </defs>
  </svg>
);

// Animated hand-drawn underline
const CrayonUnderline = ({ color = '#E8804C', width = '100%', delay = 0, thickness = 3 }) => {
  const [drawn, setDrawn] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setDrawn(true), delay); obs.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  const pathD = `M2,${thickness + 4} Q${50},${thickness - 2} ${100},${thickness + 6} T${200},${thickness + 2}`;

  return (
    <svg ref={ref} viewBox={`0 0 200 ${thickness + 14}`}
      style={{ width, height: thickness + 14, display: 'block', overflow: 'visible', filter: 'url(#crayon-jitter)' }}
      preserveAspectRatio="none">
      <path d={pathD} fill="none" stroke={color} strokeWidth={thickness}
        strokeLinecap="round" strokeDasharray="200"
        strokeDashoffset={drawn ? 0 : 200}
        style={{ transition: `stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }}/>
    </svg>
  );
};

// Hand-drawn border box (draws on hover or on scroll-in)
const CrayonBorder = ({ children, color = '#8B7355', strokeWidth = 2, className = '', style = {}, hoverDraw = false }) => {
  const [drawn, setDrawn] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hoverDraw) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setDrawn(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [hoverDraw]);

  const boxStyle = {
    position: 'relative', ...style,
  };

  const svgStyle = {
    position: 'absolute', inset: -4, width: 'calc(100% + 8px)', height: 'calc(100% + 8px)',
    pointerEvents: 'none', filter: 'url(#crayon-jitter)',
  };

  const pathLen = 800;

  return (
    <div ref={ref} className={className} style={boxStyle}
      onMouseEnter={hoverDraw ? () => setDrawn(true) : undefined}
      onMouseLeave={hoverDraw ? () => setDrawn(false) : undefined}>
      <svg style={svgStyle} viewBox="0 0 200 200" preserveAspectRatio="none">
        <path d="M4,4 L196,6 L194,196 L6,194 Z" fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={pathLen} strokeDashoffset={drawn ? 0 : pathLen}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}/>
      </svg>
      {children}
    </div>
  );
};

// Scroll-triggered fade-in with parallax
const ScrollReveal = ({ children, delay = 0, direction = 'up', distance = 40, className = '', style = {} }) => {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const transforms = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };

  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[direction],
      transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

// Floating leaf particles
const FloatingLeaves = () => {
  const leaves = React.useMemo(() =>
    Array.from({length: 8}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 16,
      duration: 12 + Math.random() * 10,
      delay: Math.random() * -20,
      rotate: Math.random() * 360,
      opacity: 0.15 + Math.random() * 0.2,
    })), []);

  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
      {leaves.map(l => (
        <div key={l.id} style={{
          position:'absolute', left:`${l.x}%`, top:'-30px',
          fontSize: l.size, opacity: l.opacity,
          animation: `leafFall ${l.duration}s linear ${l.delay}s infinite`,
          filter: 'url(#crayon-jitter)',
        }}>🍃</div>
      ))}
    </div>
  );
};

// Doodle icon component — simple SVG icons drawn in crayon style
const DoodleIcon = ({ type, size = 48, color = '#5B8C5A' }) => {
  const icons = {
    water: <><circle cx="24" cy="30" r="14" fill="none" stroke={color} strokeWidth="2.5"/><path d="M24,8 Q24,24 24,24" stroke={color} strokeWidth="2.5" fill="none"/><path d="M16,20 Q24,6 32,20" fill={color} opacity="0.3"/></>,
    chat: <><path d="M8,12 Q8,6 16,6 L32,6 Q40,6 40,12 L40,28 Q40,34 32,34 L20,34 L12,42 L14,34 L16,34 Q8,34 8,28 Z" fill="none" stroke={color} strokeWidth="2.5"/><line x1="14" y1="16" x2="34" y2="16" stroke={color} strokeWidth="2" opacity="0.5"/><line x1="14" y1="22" x2="28" y2="22" stroke={color} strokeWidth="2" opacity="0.5"/></>,
    heart: <><path d="M24,38 Q4,24 12,12 Q20,4 24,14 Q28,4 36,12 Q44,24 24,38 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="2.5"/></>,
    bell: <><path d="M24,6 L24,10 M16,30 Q12,30 14,26 L16,16 Q16,8 24,8 Q32,8 32,16 L34,26 Q36,30 32,30 Z" fill="none" stroke={color} strokeWidth="2.5"/><circle cx="24" cy="34" r="3" fill={color}/></>,
    sun: <><circle cx="24" cy="24" r="8" fill={color} opacity="0.25" stroke={color} strokeWidth="2"/>{[0,45,90,135,180,225,270,315].map(a=><line key={a} x1="24" y1="24" x2={24+16*Math.cos(a*Math.PI/180)} y2={24+16*Math.sin(a*Math.PI/180)} stroke={color} strokeWidth="2" opacity="0.5"/>)}</>,
    leaf: <><path d="M12,36 Q8,20 24,8 Q40,20 36,36" fill={color} opacity="0.2" stroke={color} strokeWidth="2.5"/><path d="M24,8 L24,36 M18,18 L24,24 M30,16 L24,22" fill="none" stroke={color} strokeWidth="1.5"/></>,
    sensor: <><rect x="10" y="10" width="28" height="28" rx="4" fill="none" stroke={color} strokeWidth="2.5"/><circle cx="24" cy="20" r="5" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5"/><path d="M16,30 L20,26 L28,32 L34,24" fill="none" stroke={color} strokeWidth="2"/></>,
    star: <><path d="M24,6 L28,18 L40,18 L30,26 L34,38 L24,30 L14,38 L18,26 L8,18 L20,18 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{filter:'url(#crayon-jitter)'}}>
      {icons[type] || icons.leaf}
    </svg>
  );
};

Object.assign(window, { CrayonFilter, CrayonUnderline, CrayonBorder, ScrollReveal, FloatingLeaves, DoodleIcon });
