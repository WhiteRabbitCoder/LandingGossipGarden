/* Crayon effects v2 — hand-drawn visual system */

const CrayonFilter = () => (
  <svg style={{position:'absolute',width:0,height:0}} aria-hidden="true">
    <defs>
      <filter id="crayon">
        <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="3" result="n" seed="2"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="crayon-heavy">
        <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="4" result="n" seed="5"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" result="n"/>
        <feColorMatrix type="saturate" values="0" in="n" result="g"/>
        <feBlend in="SourceGraphic" in2="g" mode="multiply"/>
      </filter>
    </defs>
  </svg>
);

/* Scroll-triggered reveal */
const Reveal = ({ children, delay=0, y=30, className='', style={} }) => {
  const [vis, setVis] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting){setVis(true);o.disconnect();} }, {threshold:0.12});
    if(ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      ...style, opacity:vis?1:0, transform:vis?'none':`translateY(${y}px)`,
      transition:`opacity 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>{children}</div>
  );
};

/* Animated crayon underline */
const CrayonLine = ({ color='#E8804C', w='100%', delay=0, h=4 }) => {
  const [on, setOn] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting){setTimeout(()=>setOn(true),delay);o.disconnect();} }, {threshold:0.5});
    if(ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [delay]);
  return (
    <svg ref={ref} viewBox="0 0 200 12" style={{width:w,height:h+8,display:'block',overflow:'visible',filter:'url(#crayon)'}} preserveAspectRatio="none">
      <path d={`M2,6 Q50,2 100,8 T198,5`} fill="none" stroke={color} strokeWidth={h} strokeLinecap="round"
        strokeDasharray="200" strokeDashoffset={on?0:200}
        style={{transition:`stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1) ${delay}ms`}}/>
    </svg>
  );
};

/* Hand-drawn border that draws on hover */
const CrayonBox = ({ children, color='#c4a882', sw=2, hover=false, className='', style={} }) => {
  const [on, setOn] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if(hover) return;
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting){setOn(true);o.disconnect();} }, {threshold:0.25});
    if(ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [hover]);
  return (
    <div ref={ref} className={className} style={{position:'relative',...style}}
      onMouseEnter={hover?()=>setOn(true):undefined} onMouseLeave={hover?()=>setOn(false):undefined}>
      <svg style={{position:'absolute',inset:-4,width:'calc(100% + 8px)',height:'calc(100% + 8px)',pointerEvents:'none',filter:'url(#crayon)'}}
        viewBox="0 0 200 200" preserveAspectRatio="none">
        <path d="M6,6 L194,4 L196,194 L4,196 Z" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="800" strokeDashoffset={on?0:800} style={{transition:'stroke-dashoffset 0.5s ease'}}/>
      </svg>
      {children}
    </div>
  );
};

/* Floating crayon leaves */
const Leaves = () => {
  const items = React.useMemo(() => Array.from({length:6},(_,i)=>({
    id:i, x:Math.random()*100, sz:14+Math.random()*14,
    dur:14+Math.random()*10, del:Math.random()*-20, op:0.12+Math.random()*0.15
  })),[]);
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
      {items.map(l=>(
        <div key={l.id} style={{position:'absolute',left:`${l.x}%`,top:'-30px',fontSize:l.sz,opacity:l.op,
          animation:`leafDrift ${l.dur}s linear ${l.del}s infinite`,filter:'url(#crayon)'}}>🍃</div>
      ))}
    </div>
  );
};

/* Doodle icons */
const Doodle = ({ type, size=48, color='#5B8C5A' }) => {
  const paths = {
    water: <><circle cx="24" cy="28" r="12" fill="none" stroke={color} strokeWidth="2.5"/><path d="M24,8 Q18,18 24,28 Q30,18 24,8Z" fill={color} opacity=".3" stroke={color} strokeWidth="2"/></>,
    chat: <><path d="M8,12 Q8,6 16,6 L32,6 Q40,6 40,12 L40,26 Q40,32 32,32 L20,32 L13,40 L15,32 Q8,32 8,26Z" fill="none" stroke={color} strokeWidth="2.5"/><line x1="15" y1="15" x2="33" y2="15" stroke={color} strokeWidth="2" opacity=".4"/><line x1="15" y1="21" x2="27" y2="21" stroke={color} strokeWidth="2" opacity=".4"/></>,
    heart: <><path d="M24,38 C8,26 4,16 12,10 C18,6 24,12 24,12 C24,12 30,6 36,10 C44,16 40,26 24,38Z" fill={color} opacity=".2" stroke={color} strokeWidth="2.5"/></>,
    bell: <><path d="M18,28 L14,28 Q12,28 14,24 L16,16 Q17,8 24,8 Q31,8 32,16 L34,24 Q36,28 34,28 L30,28" fill="none" stroke={color} strokeWidth="2.5"/><circle cx="24" cy="32" r="3" fill={color}/><line x1="24" y1="4" x2="24" y2="8" stroke={color} strokeWidth="2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 48 48" style={{filter:'url(#crayon)'}}>{paths[type]||paths.heart}</svg>;
};

Object.assign(window, { CrayonFilter, Reveal, CrayonLine, CrayonBox, Leaves, Doodle });
