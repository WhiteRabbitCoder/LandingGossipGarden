/* Realistic 3D plant pot with face — CSS-only with scroll-reactive transforms */

const PlantPot = ({ scrollY = 0, size = 320, mood = 'happy', style = {} }) => {
  const rotation = Math.sin(scrollY * 0.002) * 8;
  const tilt = Math.cos(scrollY * 0.003) * 3;
  const scale = 1 + Math.sin(scrollY * 0.001) * 0.03;
  const breathe = Math.sin(Date.now() * 0.002) * 2;

  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = () => { setTime(Date.now()); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const b = Math.sin(time * 0.002) * 2;
  const leafSway1 = Math.sin(time * 0.0015) * 6;
  const leafSway2 = Math.sin(time * 0.0018 + 1) * 5;
  const leafSway3 = Math.sin(time * 0.0012 + 2) * 7;

  const faces = {
    happy: { leftEye: '◕', rightEye: '◕', mouth: '‿', blush: true },
    sleepy: { leftEye: '–', rightEye: '–', mouth: '〰', blush: false },
    drama: { leftEye: '◑', rightEye: '◐', mouth: '○', blush: true },
    stern: { leftEye: '◉', rightEye: '◉', mouth: '︿', blush: false },
  };
  const face = faces[mood] || faces.happy;

  return (
    <div style={{
      width: size, height: size * 1.3, position: 'relative',
      transform: `rotateY(${rotation}deg) rotateX(${tilt}deg) scale(${scale})`,
      transition: 'transform 0.3s ease-out',
      transformStyle: 'preserve-3d',
      ...style,
    }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '2%', left: '15%', width: '70%', height: '8%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(8px)',
      }}></div>

      {/* Pot body */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '18%', width: '64%', height: '42%',
        background: 'linear-gradient(135deg, #E8C4A0 0%, #D4A574 30%, #C4915E 60%, #B07D4A 100%)',
        borderRadius: '8% 8% 28% 28% / 4% 4% 22% 22%',
        boxShadow: 'inset -8px -4px 16px rgba(0,0,0,0.1), inset 4px 4px 12px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.12)',
      }}>
        {/* Pot rim */}
        <div style={{
          position: 'absolute', top: '-8%', left: '-6%', width: '112%', height: '18%',
          background: 'linear-gradient(180deg, #EDCFA8 0%, #D9B68C 50%, #C8A070 100%)',
          borderRadius: '6px 6px 2px 2px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}></div>

        {/* Face */}
        <div style={{
          position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          fontSize: size * 0.06, color: '#6B5344',
        }}>
          <div style={{ display: 'flex', gap: size * 0.1, fontSize: size * 0.07 }}>
            <span>{face.leftEye}</span>
            <span>{face.rightEye}</span>
          </div>
          {face.blush && (
            <div style={{ display: 'flex', gap: size * 0.14, marginTop: -2 }}>
              <div style={{ width: size*0.04, height: size*0.02, borderRadius: '50%', background: 'rgba(228,135,120,0.4)' }}></div>
              <div style={{ width: size*0.04, height: size*0.02, borderRadius: '50%', background: 'rgba(228,135,120,0.4)' }}></div>
            </div>
          )}
          <div style={{ fontSize: size * 0.08, marginTop: -2, letterSpacing: 2 }}>{face.mouth}</div>
        </div>

        {/* Soil */}
        <div style={{
          position: 'absolute', top: '-4%', left: '5%', width: '90%', height: '14%',
          background: 'radial-gradient(ellipse, #5C3D2E 0%, #4A3020 100%)',
          borderRadius: '50%',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
        }}></div>
      </div>

      {/* Plant stem */}
      <div style={{
        position: 'absolute', bottom: '44%', left: '48%', width: '4%', height: '28%',
        background: 'linear-gradient(90deg, #4A7C3F, #5C9A4E, #4A7C3F)',
        borderRadius: '40%',
        transform: `translateY(${b}px)`,
      }}></div>

      {/* Leaves */}
      {[
        { bottom: '58%', left: '36%', rotate: -35 + leafSway1, scaleX: 1, w: '22%', h: '18%', color: '#5C9A4E' },
        { bottom: '62%', left: '50%', rotate: 25 + leafSway2, scaleX: -1, w: '24%', h: '16%', color: '#4A8B3E' },
        { bottom: '68%', left: '42%', rotate: -10 + leafSway3, scaleX: 1, w: '18%', h: '22%', color: '#6BAF58' },
        { bottom: '55%', left: '54%', rotate: 40 + leafSway1 * 0.7, scaleX: 1, w: '16%', h: '14%', color: '#7BC268' },
        { bottom: '72%', left: '46%', rotate: -5 + leafSway2 * 0.5, scaleX: 1, w: '14%', h: '20%', color: '#5A9E48' },
      ].map((leaf, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: leaf.bottom, left: leaf.left,
          width: leaf.w, height: leaf.h,
          background: `radial-gradient(ellipse at 30% 50%, ${leaf.color}, ${leaf.color}dd)`,
          borderRadius: '50% 50% 50% 0%',
          transform: `rotate(${leaf.rotate}deg) scaleX(${leaf.scaleX}) translateY(${b}px)`,
          boxShadow: `inset -2px -2px 6px rgba(0,0,0,0.1), inset 2px 2px 6px rgba(255,255,255,0.15)`,
          transition: 'transform 0.5s ease-out',
        }}>
          {/* Leaf vein */}
          <div style={{
            position: 'absolute', top: '50%', left: '20%', width: '60%', height: '1px',
            background: 'rgba(0,0,0,0.1)', transform: 'rotate(-5deg)',
          }}></div>
        </div>
      ))}

      {/* Light glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%', width: '60%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(255,248,220,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}></div>
    </div>
  );
};

Object.assign(window, { PlantPot });
