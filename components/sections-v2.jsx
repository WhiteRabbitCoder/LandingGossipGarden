/* Sections v2 — layout matched to reference image, real pot photo */
const C = { cream:'#FDF6EC', warm:'#FAF0E2', brown:'#6B5344', green:'#5B8C5A', greenDk:'#3D6B3A',
  orange:'#E8804C', pink:'#E88098', beige:'#E8D5B7', paper:'#FFF8EF', dark:'#3A2F26' };

/* ═══ NAVBAR ═══ */
const Navbar = ({ t }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, {passive:true});
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = ['Inicio','Cómo funciona','Personalidades','Tienda','FAQ'];
  return (
    <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,height:64,
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'0 clamp(16px,4vw,48px)',
      background: scrolled ? 'rgba(253,246,236,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(107,83,68,0.08)' : 'none',
      transition:'all 0.3s',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:26}}>🌱</span>
        <span style={{fontFamily:t.hf,fontWeight:800,fontSize:20,color:C.brown,letterSpacing:'-0.5px'}}>Gossip<br style={{lineHeight:0.8}}/>Garden</span>
      </div>
      <div className="gg-nav-desk" style={{display:'flex',alignItems:'center',gap:28}}>
        {links.map(l=><a key={l} href="#" style={{color:C.brown,textDecoration:'none',fontSize:14,fontWeight:500,fontFamily:t.bf,
          borderBottom:'2px solid transparent',paddingBottom:2,transition:'border-color 0.2s'}}
          onMouseEnter={e=>e.target.style.borderColor=C.green} onMouseLeave={e=>e.target.style.borderColor='transparent'}>{l}</a>)}
        <button style={{background:C.green,color:'#fff',border:'none',borderRadius:20,padding:'10px 20px',fontSize:14,fontWeight:600,
          cursor:'pointer',fontFamily:t.bf,display:'flex',alignItems:'center',gap:6,
          boxShadow:'0 2px 12px rgba(91,140,90,0.3)',transition:'transform 0.2s'}}
          onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}
        >💚 Descargar app</button>
      </div>
      <button className="gg-nav-mob" onClick={()=>setOpen(!open)} style={{display:'none',background:'none',border:'none',fontSize:26,cursor:'pointer',color:C.brown}}>{open?'✕':'☰'}</button>
      {open&&<div style={{position:'absolute',top:64,left:0,right:0,background:'rgba(253,246,236,0.98)',backdropFilter:'blur(12px)',
        padding:24,display:'flex',flexDirection:'column',gap:18,borderBottom:'1px solid rgba(107,83,68,0.08)'}}>
        {links.map(l=><a key={l} href="#" onClick={()=>setOpen(false)} style={{color:C.brown,textDecoration:'none',fontSize:18,fontWeight:500,fontFamily:t.bf}}>{l}</a>)}
      </div>}
    </nav>
  );
};

/* ═══ HERO — 3-column layout like reference ═══ */
const Hero = ({ scrollY, t }) => {
  const [msgs, setMsgs] = React.useState([]);
  React.useEffect(() => {
    const t1 = setTimeout(()=>setMsgs(m=>[...m,{from:'plant',text:'¡Hola! Hoy tengo sed y me vendría bien un poco más de luz 🌞'}]),1200);
    const t2 = setTimeout(()=>setMsgs(m=>[...m,{from:'user',text:'¡Claro! Ahora mismo te trato mejor 🌿💚'}]),2800);
    return ()=>{clearTimeout(t1);clearTimeout(t2);};
  }, []);

  return (
    <section style={{ minHeight:'100vh', padding:'100px clamp(20px,5vw,80px) 40px', position:'relative', overflow:'hidden' }}>
      {/* Warm ambient bg */}
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#FDF6EC 0%,#F8ECD8 50%,#F5E6CE 100%)',zIndex:-1}}></div>

      {/* Main hero grid: text-left | pot-center | dashboard-right */}
      <div className="gg-hero-grid" style={{
        display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'clamp(16px,3vw,40px)',
        maxWidth:1200, margin:'0 auto', alignItems:'center', position:'relative',
      }}>
        {/* LEFT — copy + chat */}
        <div style={{maxWidth:400}}>
          <Reveal>
            <h1 style={{fontFamily:t.hf,fontSize:'clamp(32px,4.8vw,64px)',fontWeight:800,lineHeight:1.05,color:C.dark,letterSpacing:'-1px'}}>
              Tu planta<br/><span style={{color:t.accent}}>por fin</span><br/>te habla.
            </h1>
            <CrayonLine color={t.accent} w="55%" delay={500} h={4}/>
          </Reveal>
          <Reveal delay={150}>
            <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.5vw,18px)',color:C.brown,lineHeight:1.6,marginTop:16,opacity:0.85}}>
              La maceta inteligente con IA y sensores que entiende, cuida y conversa con tu planta.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div style={{display:'flex',gap:10,marginTop:24,flexWrap:'wrap'}}>
              {['App Store','Google Play'].map(s=>(
                <button key={s} style={{background:C.dark,color:'#fff',border:'none',borderRadius:10,padding:'11px 22px',
                  fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:t.bf,display:'flex',alignItems:'center',gap:8,
                  transition:'transform 0.2s'}}
                  onMouseEnter={e=>e.target.style.transform='translateY(-2px)'} onMouseLeave={e=>e.target.style.transform='none'}
                >{s==='App Store'?'🍎':'▶️'} {s}</button>
              ))}
            </div>
          </Reveal>
          {/* Chat preview */}
          <Reveal delay={400}>
            <CrayonBox color={C.beige} sw={2} style={{marginTop:28,background:'#fff',borderRadius:16,padding:14,
              boxShadow:'0 4px 24px rgba(0,0,0,0.05)',maxWidth:340}}>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{alignSelf:m.from==='plant'?'flex-start':'flex-end',
                    background:m.from==='plant'?'#E8F5E2':'#FFF3E8',borderRadius:12,padding:'9px 13px',maxWidth:'88%',
                    fontSize:12.5,color:C.dark,fontFamily:t.bf,lineHeight:1.4,filter:'url(#crayon)',
                    animation:'fadeUp 0.4s ease-out'}}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div style={{marginTop:8,display:'flex',gap:8,alignItems:'center',borderTop:'1px solid rgba(0,0,0,0.05)',paddingTop:8}}>
                <input placeholder="Escribe algo a tu planta..." style={{flex:1,border:'none',outline:'none',fontSize:12.5,
                  color:C.brown,fontFamily:t.bf,background:'transparent'}}/>
                <span style={{fontSize:18,cursor:'pointer'}}>🌿</span>
              </div>
            </CrayonBox>
          </Reveal>
        </div>

        {/* CENTER — real pot image */}
        <div style={{position:'relative',display:'flex',justifyContent:'center',alignItems:'flex-end'}}>
          {/* Speech bubble */}
          <div style={{position:'absolute',top:'-5%',right:'5%',animation:'floatB 3s ease-in-out infinite',zIndex:2}}>
            <svg width="52" height="52" viewBox="0 0 48 48" style={{filter:'url(#crayon)'}}>
              <path d="M24,4 Q6,4 6,18 Q6,30 16,30 L18,38 L22,30 Q42,30 42,18 Q42,4 24,4Z" fill="#fff" stroke={C.orange} strokeWidth="2.5"/>
              <text x="24" y="21" textAnchor="middle" fontSize="16">💕</text>
            </svg>
          </div>
          <img src="assets/pot-hero.png" alt="Gossip Garden maceta inteligente"
            style={{
              width:'clamp(220px,28vw,380px)', height:'auto', position:'relative', zIndex:1,
              transform:`translateY(${scrollY*0.03}px) rotateY(${Math.sin(scrollY*0.002)*4}deg)`,
              transition:'transform 0.4s ease-out',
              filter:'drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
            }}/>
        </div>

        {/* RIGHT — dashboard card */}
        <div style={{display:'flex',justifyContent:'flex-start'}}>
          <Reveal delay={500} y={20}>
            <CrayonBox color="rgba(107,83,68,0.15)" sw={1.5} hover
              style={{background:'#fff',borderRadius:18,padding:'18px 22px',boxShadow:'0 4px 28px rgba(0,0,0,0.07)',minWidth:200}}>
              <div style={{fontFamily:t.hf,fontWeight:700,fontSize:15,color:C.dark,marginBottom:14}}>Estado actual</div>
              {[
                {label:'Humedad tierra',val:45,color:'#5B8C5A',icon:'💧'},
                {label:'Humedad aire',val:60,color:'#6BABCF',icon:'🌫️'},
                {label:'Temperatura',val:24,unit:'°C',color:'#E8804C',icon:'🌡️'},
                {label:'Luz',val:800,unit:' lux',color:'#E8C44C',icon:'☀️'},
              ].map((m,i)=>(
                <div key={i} style={{marginBottom:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.brown,fontFamily:t.bf}}>
                    <span style={{fontSize:13}}>{m.icon}</span>{m.label}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
                    <span style={{fontSize:14,fontWeight:700,color:C.dark,fontFamily:t.hf,minWidth:52}}>{m.val}{m.unit||'%'}</span>
                    <div style={{flex:1,height:6,background:'#f0ebe4',borderRadius:3,overflow:'hidden'}}>
                      <div style={{width:`${Math.min(m.val,100)}%`,height:'100%',borderRadius:3,
                        background:`linear-gradient(90deg,${m.color}88,${m.color})`,filter:'url(#crayon)',
                        transition:'width 1.2s ease-out'}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </CrayonBox>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ═══ FEATURES — 4 columns ═══ */
const Features = ({ t }) => {
  const items = [
    {icon:'water',title:'Sensores inteligentes',desc:'Monitorea humedad de la tierra, humedad del aire, temperatura y luz en tiempo real.'},
    {icon:'chat',title:'IA que conversa',desc:'Chatea con tu planta y recibe respuestas basadas en sus necesidades reales.'},
    {icon:'heart',title:'Personalidades únicas',desc:'Cada planta tiene su propio carácter y te dirá lo que necesita... a su manera.'},
    {icon:'bell',title:'Recordatorios inteligentes',desc:'Te avisa cuando necesita agua, luz, cariño o... que la dejes en paz un rato 🌿'},
  ];
  return (
    <section style={{padding:'clamp(48px,8vh,100px) clamp(20px,5vw,80px)',textAlign:'center'}}>
      <Reveal>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:6}}>
          <span style={{fontSize:18}}>💕</span>
          <h2 style={{fontFamily:t.hf,fontSize:'clamp(26px,3.5vw,42px)',fontWeight:800,color:C.dark}}>Tecnología que cuida con amor</h2>
          <span style={{fontSize:18}}>💕</span>
        </div>
        <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.4vw,17px)',color:C.brown,opacity:.7}}>
          Sensores + IA para entender a tu planta como nunca antes.
        </p>
      </Reveal>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20,maxWidth:920,margin:'40px auto 0'}}>
        {items.map((f,i)=>(
          <Reveal key={i} delay={i*100}>
            <CrayonBox color={C.beige} hover sw={1.5} style={{background:'#fff',borderRadius:18,padding:'28px 20px',
              boxShadow:'0 2px 14px rgba(0,0,0,0.03)',transition:'transform 0.3s',cursor:'default'}}
            >
              <div style={{width:56,height:56,margin:'0 auto 14px',borderRadius:'50%',background:`${t.accent}12`,
                display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Doodle type={f.icon} size={36} color={t.accent}/>
              </div>
              <h3 style={{fontFamily:t.hf,fontWeight:700,fontSize:16,color:C.dark,marginBottom:6}}>{f.title}</h3>
              <p style={{fontFamily:t.bf,fontSize:13,color:C.brown,lineHeight:1.5,opacity:.8}}>{f.desc}</p>
            </CrayonBox>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ═══ PERSONALITIES — 4 cards with colored bgs ═══ */
const Personalities = ({ t }) => {
  const ppl = [
    {name:'Alegre',color:'#A8D5A2',speech:'¡Soy feliz contigo!',desc:'Siempre positiva y agradecida. Le encanta la luz y la compañía.'},
    {name:'Dormilona',color:'#B8C9E8',speech:'Déjame dormir...',desc:'Le gusta la sombra y la tranquilidad. No hables mucho temprano 🌙'},
    {name:'Dramática',color:'#E0B8E0',speech:'¡Esto es un drama!',desc:'Todo le afecta. Pero con atención, se vuelve inseparable.'},
    {name:'Exigente',color:'#F5C2C2',speech:'¿Ya me diste agua?',desc:'Sabe lo que quiere y no tiene miedo de pedirlo. ¡Directa y honesta!'},
  ];
  return (
    <section style={{padding:'clamp(48px,8vh,100px) clamp(20px,5vw,80px)',textAlign:'center'}}>
      <Reveal>
        <h2 style={{fontFamily:t.hf,fontSize:'clamp(26px,3.5vw,42px)',fontWeight:800,color:C.dark}}>Cada planta, una personalidad</h2>
        <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.4vw,17px)',color:C.brown,opacity:.7,marginTop:6}}>
          Conócelas, entiéndelas y conviértete en su persona favorita.
        </p>
      </Reveal>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:22,maxWidth:920,margin:'40px auto 0'}}>
        {ppl.map((p,i)=>(
          <Reveal key={i} delay={i*120}>
            <div style={{background:`${p.color}35`,borderRadius:22,padding:'28px 16px 20px',position:'relative',
              border:`2px solid ${p.color}55`,transition:'transform 0.3s',cursor:'default'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-5px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              {/* Speech bubble */}
              <div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',
                background:'#fff',borderRadius:10,padding:'5px 12px',fontSize:12,fontWeight:600,color:C.dark,
                fontFamily:t.bf,boxShadow:'0 2px 8px rgba(0,0,0,0.06)',whiteSpace:'nowrap',
                border:`1.5px solid ${p.color}`,filter:'url(#crayon)'}}>
                {p.speech}
              </div>
              {/* Pot image — reuse hero with tint overlay */}
              <div style={{width:90,height:100,margin:'14px auto 10px',position:'relative',overflow:'hidden',borderRadius:12}}>
                <img src="assets/pot-hero.png" alt={p.name}
                  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 30%'}}/>
                <div style={{position:'absolute',inset:0,background:`${p.color}20`,mixBlendMode:'multiply',borderRadius:12}}></div>
              </div>
              <h3 style={{fontFamily:t.hf,fontWeight:700,fontSize:17,color:C.dark,marginBottom:4}}>{p.name}</h3>
              <CrayonLine color={p.color} w="40%" delay={200+i*80} h={3}/>
              <p style={{fontFamily:t.bf,fontSize:12.5,color:C.brown,lineHeight:1.5,marginTop:6,opacity:.8}}>{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ═══ VARIANTS — 4 color options ═══ */
const Variants = ({ t }) => {
  const vars = [
    {name:'Arena',colors:['#E8D5B7','#D4C4A0','#C4B090'],bg:'#F5EDE0'},
    {name:'Menta',colors:['#A8D5A2','#8BC5A0','#6BAF80'],bg:'#E8F5E8'},
    {name:'Rosé',colors:['#E8B0A8','#D4988E','#C48878'],bg:'#F8EAE8'},
    {name:'Piedra',colors:['#B8B4B0','#A09C98','#888480'],bg:'#F0EEEC'},
  ];
  return (
    <section style={{padding:'clamp(48px,8vh,100px) clamp(20px,5vw,80px)',textAlign:'center'}}>
      <Reveal>
        <h2 style={{fontFamily:t.hf,fontSize:'clamp(26px,3.5vw,42px)',fontWeight:800,color:C.dark}}>Diseñada para tu espacio</h2>
        <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.4vw,17px)',color:C.brown,opacity:.7,marginTop:6}}>
          Macetas inteligentes que se ven bien en cualquier lugar.
        </p>
      </Reveal>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:20,maxWidth:860,margin:'40px auto 0'}}>
        {vars.map((v,i)=>(
          <Reveal key={i} delay={i*100}>
            <div style={{background:v.bg,borderRadius:20,padding:'28px 14px 18px',cursor:'pointer',transition:'transform 0.3s',
              border:'2px dashed transparent',position:'relative'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=v.colors[0];}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='transparent';}}>
              {/* Pot with color tint */}
              <div style={{width:80,height:90,margin:'0 auto 14px',position:'relative',overflow:'hidden',borderRadius:10}}>
                <img src="assets/pot-hero.png" alt={v.name}
                  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%'}}/>
                <div style={{position:'absolute',inset:0,background:`${v.colors[0]}30`,mixBlendMode:'multiply'}}></div>
              </div>
              <h3 style={{fontFamily:t.hf,fontWeight:700,fontSize:15,color:C.dark}}>{v.name}</h3>
              <div style={{display:'flex',gap:5,justifyContent:'center',marginTop:6}}>
                {v.colors.map((c,j)=><div key={j} style={{width:13,height:13,borderRadius:'50%',background:c,border:'1.5px solid rgba(0,0,0,0.08)'}}></div>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ═══ CTA ═══ */
const CTA = ({ t }) => (
  <section style={{padding:'clamp(60px,10vh,120px) clamp(20px,5vw,80px)',
    background:`linear-gradient(135deg,${C.green}14,${C.cream})`,textAlign:'center',position:'relative'}}>
    <Reveal>
      <h2 style={{fontFamily:t.hf,fontSize:'clamp(30px,4.5vw,52px)',fontWeight:800,color:C.dark,lineHeight:1.1,maxWidth:560,margin:'0 auto'}}>
        Haz que tu planta se sienta escuchada. <span style={{fontSize:'0.65em'}}>💕</span>
      </h2>
      <CrayonLine color={t.accent} w="35%" delay={200} h={4}/>
      <p style={{fontFamily:t.bf,fontSize:'clamp(14px,1.5vw,18px)',color:C.brown,opacity:.8,marginTop:18,maxWidth:440,marginLeft:'auto',marginRight:'auto'}}>
        Descarga Gossip Garden y empieza a construir una relación única.
      </p>
      <button style={{marginTop:28,background:t.accent,color:'#fff',border:'none',borderRadius:16,padding:'15px 40px',
        fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:t.hf,boxShadow:`0 4px 24px ${t.accent}44`,
        transition:'transform 0.2s'}}
        onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}
      >🌿 Descargar ahora</button>
    </Reveal>
    <Reveal delay={300}>
      <img src="assets/pot-hero.png" alt="Gossip Garden" style={{width:140,height:'auto',marginTop:36,
        filter:'drop-shadow(0 12px 30px rgba(0,0,0,0.1))'}}/>
    </Reveal>
  </section>
);

/* ═══ FOOTER ═══ */
const Footer = ({ t }) => (
  <footer style={{padding:'44px clamp(20px,5vw,80px) 28px',borderTop:'2px dashed rgba(107,83,68,0.12)',
    display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:28,maxWidth:1060,margin:'0 auto'}}>
    <div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
        <span style={{fontSize:22}}>🌱</span>
        <span style={{fontFamily:t.hf,fontWeight:800,fontSize:17,color:C.brown}}>Gossip Garden</span>
      </div>
      <p style={{fontFamily:t.bf,fontSize:12.5,color:C.brown,opacity:.55,lineHeight:1.5}}>No solo la riegues, escúchala.</p>
    </div>
    {[{t:'Producto',l:['Cómo funciona','Personalidades','Tienda']},{t:'Recursos',l:['Blog','Guías','FAQ']},{t:'Legal',l:['Términos','Privacidad','Contacto']}].map(col=>(
      <div key={col.t}>
        <h4 style={{fontFamily:t.hf,fontWeight:700,fontSize:13,color:C.dark,marginBottom:10}}>{col.t}</h4>
        {col.l.map(l=><a key={l} href="#" style={{display:'block',fontFamily:t.bf,fontSize:12.5,color:C.brown,opacity:.55,
          textDecoration:'none',marginBottom:7,transition:'opacity 0.2s'}}
          onMouseEnter={e=>e.target.style.opacity=1} onMouseLeave={e=>e.target.style.opacity=0.55}>{l}</a>)}
      </div>
    ))}
  </footer>
);

Object.assign(window, { Navbar, Hero, Features, Personalities, Variants, CTA, Footer, C });
