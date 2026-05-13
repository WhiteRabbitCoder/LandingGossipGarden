/* Section components: Navbar, Hero, Dashboard, Chat, Features, Personalities, Variants, CTA, Footer */

const COLORS = {
  cream: '#FDF6EC', warmBg: '#FAF0E2', brown: '#6B5344', green: '#5B8C5A',
  greenDark: '#3D6B3A', orange: '#E8804C', orangeLight: '#F4A97B',
  pink: '#E88098', beige: '#E8D5B7', paper: '#FFF8EF', darkText: '#3A2F26',
};

/* ─── Navbar ─── */
const Navbar = ({ tweaks }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 clamp(16px, 4vw, 48px)',
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(253,246,236,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(107,83,68,0.1)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 28 }}>🌱</span>
        <span style={{ fontFamily: tweaks.headingFont, fontWeight: 800, fontSize: 22, color: COLORS.brown, letterSpacing: '-0.5px' }}>
          Gossip Garden
        </span>
      </div>
      <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {['Inicio','Cómo funciona','Personalidades','Tienda','FAQ'].map(l => (
          <a key={l} href="#" style={{ color: COLORS.brown, textDecoration: 'none', fontSize: 14, fontWeight: 500,
            fontFamily: tweaks.bodyFont, position: 'relative' }}
            onMouseEnter={e => e.target.style.color = COLORS.green}
            onMouseLeave={e => e.target.style.color = COLORS.brown}>{l}</a>
        ))}
        <button style={{
          background: COLORS.green, color: '#fff', border: 'none', borderRadius: 20,
          padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: tweaks.bodyFont, display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 12px rgba(91,140,90,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 4px 20px rgba(91,140,90,0.4)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 2px 12px rgba(91,140,90,0.3)'; }}
        >🌿 Descargar app</button>
      </div>
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
        display: 'none', background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: COLORS.brown,
      }}>{menuOpen ? '✕' : '☰'}</button>
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'rgba(253,246,236,0.98)', backdropFilter: 'blur(12px)',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: 20,
          borderBottom: '1px solid rgba(107,83,68,0.1)',
        }}>
          {['Inicio','Cómo funciona','Personalidades','Tienda','FAQ'].map(l => (
            <a key={l} href="#" onClick={() => setMenuOpen(false)}
              style={{ color: COLORS.brown, textDecoration: 'none', fontSize: 18, fontWeight: 500, fontFamily: tweaks.bodyFont }}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
};

/* ─── Hero ─── */
const HeroSection = ({ scrollY, tweaks }) => {
  const [chatTyping, setChatTyping] = React.useState(false);
  const [chatMsg, setChatMsg] = React.useState('');
  const msgs = [
    { from: 'plant', text: '¡Hola! Hoy tengo sed y me vendría bien un poco más de luz 🌞' },
    { from: 'user', text: '¡Claro! Ahora mismo te trato mejor 🌿💚' },
  ];
  const [visibleMsgs, setVisibleMsgs] = React.useState([]);

  React.useEffect(() => {
    const t1 = setTimeout(() => setVisibleMsgs([msgs[0]]), 1200);
    const t2 = setTimeout(() => setVisibleMsgs([msgs[0], msgs[1]]), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: 'clamp(80px, 12vh, 140px) clamp(20px, 5vw, 80px) 60px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Paper texture bg */}
      <div style={{
        position: 'absolute', inset: 0, filter: 'url(#paper-texture)', opacity: 0.03,
        background: COLORS.cream, pointerEvents: 'none',
      }}></div>

      {/* Decorative crayon scribbles */}
      <svg style={{ position:'absolute', top:'8%', right:'5%', width:120, height:120, opacity:0.12, filter:'url(#crayon-jitter)' }}>
        <path d="M20,60 Q60,10 100,60 Q60,110 20,60" stroke={COLORS.orange} fill="none" strokeWidth="3"/>
      </svg>
      <svg style={{ position:'absolute', bottom:'15%', left:'3%', width:80, height:80, opacity:0.1, filter:'url(#crayon-jitter)' }}>
        <path d="M10,40 Q40,5 70,40 Q40,75 10,40" stroke={COLORS.green} fill="none" strokeWidth="2.5"/>
      </svg>

      <div className="hero-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px, 4vw, 60px)',
        maxWidth: 1200, margin: '0 auto', width: '100%', alignItems: 'center', position: 'relative', zIndex: 2,
      }}>
        {/* Left: Copy */}
        <div>
          <ScrollReveal>
            <h1 style={{
              fontFamily: tweaks.headingFont, fontSize: 'clamp(36px, 5.5vw, 72px)',
              fontWeight: 800, lineHeight: 1.05, color: COLORS.darkText, letterSpacing: '-1px',
              marginBottom: 8,
            }}>
              Tu planta<br/>
              <span style={{ color: tweaks.accentColor }}>por fin</span><br/>
              te habla.
            </h1>
            <CrayonUnderline color={tweaks.accentColor} width="60%" delay={600} thickness={4}/>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p style={{
              fontFamily: tweaks.bodyFont, fontSize: 'clamp(16px, 1.8vw, 20px)',
              color: COLORS.brown, lineHeight: 1.6, marginTop: 20, maxWidth: 420, opacity: 0.85,
            }}>
              La maceta inteligente con IA y sensores que entiende, cuida y conversa con tu planta.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              {['App Store', 'Google Play'].map(s => (
                <button key={s} style={{
                  background: COLORS.darkText, color: '#fff', border: 'none', borderRadius: 10,
                  padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  fontFamily: tweaks.bodyFont, display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.target.style.transform = 'none'}
                >{s === 'App Store' ? '🍎' : '▶️'} {s}</button>
              ))}
            </div>
          </ScrollReveal>

          {/* Mini chat */}
          <ScrollReveal delay={600}>
            <CrayonBorder color={COLORS.beige} strokeWidth={2}
              style={{ marginTop: 32, background: '#fff', borderRadius: 16, padding: 16, maxWidth: 360,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visibleMsgs.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.from === 'plant' ? 'flex-start' : 'flex-end',
                    background: m.from === 'plant' ? '#E8F5E2' : '#FFF3E8',
                    borderRadius: 14, padding: '10px 14px', maxWidth: '85%',
                    fontSize: 13, color: COLORS.darkText, fontFamily: tweaks.bodyFont, lineHeight: 1.4,
                    opacity: 1, animation: 'fadeSlideUp 0.5s ease-out',
                  }}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 10, display: 'flex', gap: 8, alignItems: 'center',
                borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 10,
              }}>
                <input placeholder="Escribe algo a tu planta..." style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: 13, color: COLORS.brown,
                  fontFamily: tweaks.bodyFont, background: 'transparent',
                }}/>
                <span style={{ fontSize: 20, cursor: 'pointer' }}>🌿</span>
              </div>
            </CrayonBorder>
          </ScrollReveal>
        </div>

        {/* Right: Plant + Dashboard */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
            <PlantPot scrollY={scrollY} size={Math.min(320, window.innerWidth * 0.3)} mood="happy"/>
          </div>

          {/* Dashboard card */}
          <ScrollReveal delay={500} direction="left" style={{
            position: 'absolute', top: '5%', right: '-5%',
          }}>
            <CrayonBorder color="rgba(107,83,68,0.2)" strokeWidth={1.5} hoverDraw
              style={{
                background: '#fff', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)', minWidth: 180,
              }}>
              <div style={{ fontFamily: tweaks.headingFont, fontWeight: 700, fontSize: 14, color: COLORS.darkText, marginBottom: 12 }}>
                Estado actual
              </div>
              {[
                { label: 'Humedad tierra', value: 45, color: '#5B8C5A', icon: '💧' },
                { label: 'Humedad aire', value: 60, color: '#6BABCF', icon: '🌫️' },
                { label: 'Temperatura', value: 24, unit: '°C', color: '#E8804C', icon: '🌡️' },
                { label: 'Luz', value: 800, unit: ' lux', color: '#E8C44C', icon: '☀️' },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: COLORS.brown, fontFamily: tweaks.bodyFont }}>
                    <span>{m.icon}</span> {m.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.darkText, fontFamily: tweaks.headingFont }}>
                      {m.value}{m.unit || '%'}
                    </span>
                    <div style={{ flex: 1, height: 6, background: '#f0ebe4', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(m.value, 100)}%`, height: '100%', borderRadius: 3,
                        background: `linear-gradient(90deg, ${m.color}88, ${m.color})`,
                        filter: 'url(#crayon-jitter)',
                        transition: 'width 1s ease-out',
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </CrayonBorder>
          </ScrollReveal>

          {/* Speech bubble */}
          <div style={{
            position: 'absolute', top: '-8%', left: '20%',
            animation: 'floatBubble 3s ease-in-out infinite',
          }}>
            <svg width="48" height="48" viewBox="0 0 48 48" style={{filter:'url(#crayon-jitter)'}}>
              <path d="M24,4 Q4,4 4,20 Q4,32 16,32 L18,40 L22,32 Q44,32 44,20 Q44,4 24,4Z" fill="#fff" stroke={COLORS.orange} strokeWidth="2"/>
              <text x="24" y="22" textAnchor="middle" fontSize="16" fill={COLORS.orange}>💕</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Features ─── */
const FeaturesSection = ({ tweaks }) => {
  const features = [
    { icon: 'sensor', title: 'Sensores inteligentes', desc: 'Monitorea humedad de la tierra, humedad del aire, temperatura y luz en tiempo real.' },
    { icon: 'chat', title: 'IA que conversa', desc: 'Chatea con tu planta y recibe respuestas basadas en sus necesidades reales.' },
    { icon: 'heart', title: 'Personalidades únicas', desc: 'Cada planta tiene su propio carácter y te dirá lo que necesita... a su manera.' },
    { icon: 'bell', title: 'Recordatorios inteligentes', desc: 'Te avisa cuando necesita agua, luz, cariño o... que la dejes en paz un rato 🌿' },
  ];

  return (
    <section style={{ padding: 'clamp(60px, 10vh, 120px) clamp(20px, 5vw, 80px)', textAlign: 'center' }}>
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>💕</span>
          <h2 style={{ fontFamily: tweaks.headingFont, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: COLORS.darkText }}>
            Tecnología que cuida con amor
          </h2>
          <span style={{ fontSize: 20 }}>💕</span>
        </div>
        <p style={{ fontFamily: tweaks.bodyFont, fontSize: 'clamp(15px, 1.6vw, 18px)', color: COLORS.brown, opacity: 0.7 }}>
          Sensores + IA para entender a tu planta como nunca antes.
        </p>
      </ScrollReveal>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 24, maxWidth: 960, margin: '48px auto 0',
      }}>
        {features.map((f, i) => (
          <ScrollReveal key={i} delay={i * 120}>
            <CrayonBorder color={COLORS.beige} hoverDraw strokeWidth={1.5}
              style={{
                background: '#fff', borderRadius: 20, padding: '32px 24px',
                textAlign: 'center', cursor: 'default',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}>
              <div style={{
                width: 64, height: 64, margin: '0 auto 16px', borderRadius: '50%',
                background: `${tweaks.accentColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <DoodleIcon type={f.icon} size={40} color={tweaks.accentColor}/>
              </div>
              <h3 style={{ fontFamily: tweaks.headingFont, fontWeight: 700, fontSize: 17, color: COLORS.darkText, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: tweaks.bodyFont, fontSize: 14, color: COLORS.brown, lineHeight: 1.5, opacity: 0.8 }}>
                {f.desc}
              </p>
            </CrayonBorder>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

/* ─── Personalities ─── */
const PersonalitiesSection = ({ tweaks }) => {
  const personalities = [
    { name: 'Alegre', mood: 'happy', color: '#A8D5A2', speech: '¡Soy feliz contigo!', desc: 'Siempre positiva y agradecida. Le encanta la luz y la compañía.' },
    { name: 'Dormilona', mood: 'sleepy', color: '#B8C9E8', speech: 'Déjame dormir...', desc: 'Le gusta la sombra y la tranquilidad. No hables mucho temprano 🌙' },
    { name: 'Dramática', mood: 'drama', color: '#E8B8D8', speech: '¡Esto es un drama!', desc: 'Todo le afecta. Pero con atención, se vuelve inseparable.' },
    { name: 'Exigente', mood: 'stern', color: '#F5C2C2', speech: '¿Ya me diste agua?', desc: 'Sabe lo que quiere y no tiene miedo de pedirlo. ¡Directa y honesta!' },
  ];

  return (
    <section style={{ padding: 'clamp(60px, 10vh, 120px) clamp(20px, 5vw, 80px)', textAlign: 'center' }}>
      <ScrollReveal>
        <h2 style={{ fontFamily: tweaks.headingFont, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: COLORS.darkText }}>
          Cada planta, una personalidad
        </h2>
        <p style={{ fontFamily: tweaks.bodyFont, fontSize: 'clamp(15px, 1.6vw, 18px)', color: COLORS.brown, opacity: 0.7, marginTop: 8 }}>
          Conócelas, entiéndelas y conviértete en su persona favorita.
        </p>
      </ScrollReveal>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 24, maxWidth: 960, margin: '48px auto 0',
      }}>
        {personalities.map((p, i) => (
          <ScrollReveal key={i} delay={i * 150}>
            <div style={{
              background: `${p.color}40`, borderRadius: 24, padding: '24px 16px 20px',
              position: 'relative', cursor: 'default',
              transition: 'transform 0.3s', border: `2px solid ${p.color}60`,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              {/* Speech bubble */}
              <div style={{
                position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                background: '#fff', borderRadius: 12, padding: '6px 14px',
                fontSize: 12, fontWeight: 600, color: COLORS.darkText,
                fontFamily: tweaks.bodyFont, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                whiteSpace: 'nowrap', border: `1.5px solid ${p.color}`,
                filter: 'url(#crayon-jitter)',
              }}>
                {p.speech}
              </div>

              <div style={{ margin: '16px auto 12px', width: 100, height: 120 }}>
                <PlantPot size={100} mood={p.mood} scrollY={0}/>
              </div>

              <h3 style={{
                fontFamily: tweaks.headingFont, fontWeight: 700, fontSize: 18,
                color: COLORS.darkText, marginBottom: 6,
              }}>{p.name}</h3>
              <CrayonUnderline color={p.color} width="50%" delay={300 + i * 100} thickness={3}/>
              <p style={{
                fontFamily: tweaks.bodyFont, fontSize: 13, color: COLORS.brown,
                lineHeight: 1.5, marginTop: 8, opacity: 0.8,
              }}>{p.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

/* ─── Variants ─── */
const VariantsSection = ({ tweaks }) => {
  const variants = [
    { name: 'Arena', colors: ['#E8D5B7','#D4C4A0','#C4B090'], bg: '#F5EDE0' },
    { name: 'Menta', colors: ['#A8D5A2','#8BC5A0','#6BAF80'], bg: '#E8F5E8' },
    { name: 'Rosé', colors: ['#E8B0A8','#D4988E','#C48878'], bg: '#F8EAE8' },
    { name: 'Piedra', colors: ['#B8B4B0','#A09C98','#888480'], bg: '#F0EEEC' },
  ];

  return (
    <section style={{ padding: 'clamp(60px, 10vh, 120px) clamp(20px, 5vw, 80px)', textAlign: 'center' }}>
      <ScrollReveal>
        <h2 style={{ fontFamily: tweaks.headingFont, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: COLORS.darkText }}>
          Diseñada para tu espacio
        </h2>
        <p style={{ fontFamily: tweaks.bodyFont, fontSize: 'clamp(15px, 1.6vw, 18px)', color: COLORS.brown, opacity: 0.7, marginTop: 8 }}>
          Macetas inteligentes que se ven bien en cualquier lugar.
        </p>
      </ScrollReveal>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 24, maxWidth: 900, margin: '48px auto 0',
      }}>
        {variants.map((v, i) => (
          <ScrollReveal key={i} delay={i * 120}>
            <div style={{
              background: v.bg, borderRadius: 20, padding: '32px 16px 20px',
              cursor: 'pointer', transition: 'transform 0.3s',
              border: '2px dashed transparent', position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = v.colors[0]; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
              {/* Simplified pot shape */}
              <div style={{
                width: 80, height: 70, margin: '0 auto 16px',
                background: `linear-gradient(135deg, ${v.colors[0]}, ${v.colors[1]}, ${v.colors[2]})`,
                borderRadius: '6px 6px 24px 24px',
                boxShadow: `0 6px 20px ${v.colors[0]}44`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -4, left: -4, width: 'calc(100% + 8px)', height: 14,
                  background: `linear-gradient(180deg, ${v.colors[0]}, ${v.colors[1]})`,
                  borderRadius: 4,
                }}></div>
                {/* Mini face */}
                <div style={{ position:'absolute', top:'45%', left:'50%', transform:'translate(-50%,-50%)',
                  fontSize: 10, color: 'rgba(0,0,0,0.25)', letterSpacing: 8 }}>◕ ◕</div>
                {/* Mini leaves */}
                <div style={{ position:'absolute', top: -18, left:'50%', transform:'translateX(-50%)', fontSize: 22 }}>🌱</div>
              </div>

              <h3 style={{ fontFamily: tweaks.headingFont, fontWeight: 700, fontSize: 16, color: COLORS.darkText }}>{v.name}</h3>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                {v.colors.map((c, j) => (
                  <div key={j} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1.5px solid rgba(0,0,0,0.1)' }}></div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

/* ─── CTA ─── */
const CTASection = ({ tweaks }) => (
  <section style={{
    padding: 'clamp(60px, 10vh, 120px) clamp(20px, 5vw, 80px)',
    background: `linear-gradient(135deg, ${COLORS.green}18, ${COLORS.cream})`,
    textAlign: 'center', position: 'relative',
  }}>
    <ScrollReveal>
      <h2 style={{
        fontFamily: tweaks.headingFont, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800,
        color: COLORS.darkText, lineHeight: 1.1, maxWidth: 600, margin: '0 auto',
      }}>
        Haz que tu planta se sienta escuchada. <span style={{fontSize:'0.7em'}}>💕</span>
      </h2>
      <CrayonUnderline color={tweaks.accentColor} width="40%" delay={300} thickness={4}/>
      <p style={{
        fontFamily: tweaks.bodyFont, fontSize: 'clamp(15px, 1.6vw, 18px)',
        color: COLORS.brown, opacity: 0.8, marginTop: 20, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto',
      }}>
        Descarga Gossip Garden y empieza a construir una relación única.
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
        <button style={{
          background: tweaks.accentColor, color: '#fff', border: 'none', borderRadius: 16,
          padding: '16px 40px', fontSize: 18, fontWeight: 700, cursor: 'pointer',
          fontFamily: tweaks.headingFont, boxShadow: `0 4px 24px ${tweaks.accentColor}44`,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
        >🌿 Descargar ahora</button>
      </div>
    </ScrollReveal>

    <ScrollReveal delay={400}>
      <div style={{ marginTop: 48 }}>
        <PlantPot size={160} mood="happy" scrollY={0}/>
      </div>
    </ScrollReveal>
  </section>
);

/* ─── Footer ─── */
const FooterSection = ({ tweaks }) => (
  <footer style={{
    padding: '48px clamp(20px, 5vw, 80px) 32px',
    borderTop: '2px dashed rgba(107,83,68,0.15)',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 32, maxWidth: 1100, margin: '0 auto',
  }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>🌱</span>
        <span style={{ fontFamily: tweaks.headingFont, fontWeight: 800, fontSize: 18, color: COLORS.brown }}>Gossip Garden</span>
      </div>
      <p style={{ fontFamily: tweaks.bodyFont, fontSize: 13, color: COLORS.brown, opacity: 0.6, lineHeight: 1.5 }}>
        No solo la riegues, escúchala.
      </p>
    </div>
    {[
      { title: 'Producto', links: ['Cómo funciona','Personalidades','Tienda'] },
      { title: 'Recursos', links: ['Blog','Guías','FAQ'] },
      { title: 'Legal', links: ['Términos','Privacidad','Contacto'] },
    ].map(col => (
      <div key={col.title}>
        <h4 style={{ fontFamily: tweaks.headingFont, fontWeight: 700, fontSize: 14, color: COLORS.darkText, marginBottom: 12 }}>{col.title}</h4>
        {col.links.map(l => (
          <a key={l} href="#" style={{ display: 'block', fontFamily: tweaks.bodyFont, fontSize: 13, color: COLORS.brown, opacity: 0.6,
            textDecoration: 'none', marginBottom: 8, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.6}>{l}</a>
        ))}
      </div>
    ))}
  </footer>
);

Object.assign(window, { Navbar, HeroSection, FeaturesSection, PersonalitiesSection, VariantsSection, CTASection, FooterSection, COLORS });
