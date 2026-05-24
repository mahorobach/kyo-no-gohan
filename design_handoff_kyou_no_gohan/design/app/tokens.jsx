// Design tokens + shared atoms for きょうのごはん
// All Japanese (warm, handmade, recipe-notebook vibe)

const T = {
  bg: '#FAF6EE',          // warm cream page bg
  bgWarm: '#F2E8D2',      // section bg (slightly toasted)
  bgDeep: '#E8DCC0',      // panel
  surface: '#FFFDF7',     // card surface
  ink: '#2A1F14',         // primary text (warm dark)
  inkSoft: '#5A4A35',     // secondary
  inkMuted: '#8A7960',    // tertiary
  inkFaint: 'rgba(42, 31, 20, 0.42)',
  line: 'rgba(42, 31, 20, 0.14)',
  lineSoft: 'rgba(42, 31, 20, 0.07)',
  terracotta: '#C96442',  // primary accent
  terracottaDeep: '#A14A2A',
  terracottaTint: '#F2D9CC',
  sage: '#7C8B5C',        // secondary accent
  sageDeep: '#5A6A3D',
  sageTint: '#DDE4C8',
  amber: '#D89A3D',       // tertiary accent
  amberTint: '#F2DDB0',
  plum: '#7E4A55',
  rose: '#E5B8AE',
};

const FONT = {
  serif: '"Zen Old Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif',
  sans: '"Zen Kaku Gothic New", "Hiragino Sans", "Yu Gothic", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Courier New", monospace',
};

// ─────────────────────────────────────────────────────────────
// Paper texture background (subtle noise via SVG)
// ─────────────────────────────────────────────────────────────
const PAPER_NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.045 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

function Paper({ children, style = {}, color = T.bg }) {
  return (
    <div style={{
      background: color,
      backgroundImage: PAPER_NOISE,
      backgroundBlendMode: 'multiply',
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo (the hand-drawn-ish wordmark, used in onboarding + nav)
// ─────────────────────────────────────────────────────────────
function Logo({ size = 22, color = T.ink, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{
        fontFamily: FONT.serif, fontWeight: 600, fontSize: size, color,
        letterSpacing: '0.04em', lineHeight: 1,
      }}>きょうの<span style={{ color: T.terracotta }}>ごはん</span></span>
      {sub && (
        <span style={{
          fontFamily: FONT.sans, fontSize: size * 0.42, color: T.inkMuted,
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>{sub}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section label — small, all-caps, with deco bullet
// ─────────────────────────────────────────────────────────────
function Eyebrow({ children, color = T.terracotta }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.22em', color,
      textTransform: 'uppercase',
    }}>
      <span style={{ width: 18, height: 1, background: color, opacity: 0.6 }} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hand-drawn divider (dotted, recipe-book style)
// ─────────────────────────────────────────────────────────────
function Dotted({ color = T.line, style = {} }) {
  return (
    <div style={{
      height: 1, borderTop: `1.5px dotted ${color}`,
      ...style,
    }} />
  );
}

// ─────────────────────────────────────────────────────────────
// Primary button — terracotta filled
// ─────────────────────────────────────────────────────────────
function Btn({ children, kind = 'primary', icon, full, style = {}, onClick }) {
  const base = {
    fontFamily: FONT.sans, fontSize: 16, fontWeight: 600,
    height: 52, padding: '0 22px', borderRadius: 26,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    border: 'none', cursor: 'pointer',
    letterSpacing: '0.04em',
    width: full ? '100%' : undefined,
    ...style,
  };
  const variants = {
    primary: { background: T.ink, color: T.surface, boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 8px 22px -10px rgba(42,31,20,0.5)' },
    accent: { background: T.terracotta, color: T.surface, boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px -10px rgba(201,100,66,0.6)' },
    ghost: { background: 'transparent', color: T.ink, border: `1.5px solid ${T.ink}` },
    soft: { background: T.surface, color: T.ink, border: `1px solid ${T.line}` },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[kind] }}>
      {icon}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Tag chip (pill, like washi tape)
// ─────────────────────────────────────────────────────────────
function Tag({ children, tone = 'neutral', style = {} }) {
  const tones = {
    neutral: { bg: T.bgDeep, fg: T.inkSoft },
    sage: { bg: T.sageTint, fg: T.sageDeep },
    terracotta: { bg: T.terracottaTint, fg: T.terracottaDeep },
    amber: { bg: T.amberTint, fg: '#8A6018' },
    ink: { bg: T.ink, fg: T.surface },
  };
  const c = tones[tone];
  return (
    <span style={{
      fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
      padding: '4px 10px', borderRadius: 999,
      background: c.bg, color: c.fg,
      letterSpacing: '0.04em',
      display: 'inline-flex', alignItems: 'center', gap: 4,
      ...style,
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Yen badge — small price stamp
// ─────────────────────────────────────────────────────────────
function YenStamp({ value, perPerson = true }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 2,
      fontFamily: FONT.serif, color: T.ink,
    }}>
      <span style={{ fontSize: 14 }}>¥</span>
      <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{value}</span>
      {perPerson && <span style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, marginLeft: 2 }}>/人</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mini ingredient illustration — simple, abstract, no faces
// Just colored shapes representing food items
// ─────────────────────────────────────────────────────────────
function Veggie({ kind, size = 36 }) {
  const recipes = {
    onion: { bg: '#F3DEB6', shape: <ellipse cx="50" cy="55" rx="32" ry="35" fill="#E5C57E" /> },
    carrot: { bg: '#F8D9B5', shape: <path d="M50 15 L62 85 Q50 92 38 85 Z" fill="#D97A3F" /> },
    pork: { bg: '#F2D5CC', shape: <path d="M20 50 Q20 30 40 30 L70 30 Q85 30 85 50 Q85 70 70 70 L40 70 Q20 70 20 50 Z" fill="#D89187" stroke="#B36A60" strokeWidth="2" /> },
    chicken: { bg: '#F4DCB6', shape: <path d="M30 45 Q30 25 50 25 Q70 25 75 45 L72 70 Q60 78 50 78 Q40 78 28 70 Z" fill="#E6B675" /> },
    egg: { bg: '#FBEFD0', shape: <ellipse cx="50" cy="52" rx="28" ry="32" fill="#F8E7B8" /> },
    tofu: { bg: '#F5EFE0', shape: <rect x="22" y="28" width="56" height="44" fill="#F0E8D0" stroke="#D6CBA8" strokeWidth="1.5" /> },
    cabbage: { bg: '#E0E7C9', shape: <g><circle cx="50" cy="52" r="32" fill="#C9D5A0" /><path d="M50 20 Q50 50 50 84" stroke="#A8B780" strokeWidth="1.5" fill="none" /><path d="M22 52 Q50 50 78 52" stroke="#A8B780" strokeWidth="1.5" fill="none" /></g> },
    pepper: { bg: '#DBE4C2', shape: <path d="M45 20 Q45 26 50 28 Q60 30 65 45 Q68 65 55 78 Q42 80 35 65 Q32 45 42 32 Q45 26 45 20 Z" fill="#7C8B5C" /> },
    tomato: { bg: '#F2C9B8', shape: <g><circle cx="50" cy="56" r="28" fill="#D97757" /><path d="M40 30 L50 38 L60 30 L57 26 L50 32 L43 26 Z" fill="#7C8B5C" /></g> },
    milk: { bg: '#EEEEEA', shape: <g><rect x="34" y="20" width="32" height="60" fill="#F8F6F0" stroke="#C8C2B0" strokeWidth="1.5" /><rect x="34" y="20" width="32" height="14" fill="#7C8B5C" /></g> },
    sprouts: { bg: '#EDEBD0', shape: <g><path d="M30 80 Q35 50 40 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><path d="M40 80 Q45 45 50 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><path d="M50 80 Q55 45 60 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><path d="M60 80 Q65 50 70 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><circle cx="35" cy="50" r="3" fill="#C9D5A0" /><circle cx="45" cy="46" r="3" fill="#C9D5A0" /><circle cx="55" cy="46" r="3" fill="#C9D5A0" /><circle cx="65" cy="50" r="3" fill="#C9D5A0" /></g> },
    leek: { bg: '#E4ECD2', shape: <g><rect x="42" y="20" width="16" height="60" fill="#E8F0D0" /><rect x="42" y="55" width="16" height="25" fill="#C9D5A0" /></g> },
    miso: { bg: '#EAD9B8', shape: <g><circle cx="50" cy="55" r="30" fill="#B88A4A" /><circle cx="50" cy="55" r="22" fill="#C9974F" /></g> },
    ginger: { bg: '#F1E3C4', shape: <path d="M25 55 Q25 40 38 40 Q48 38 55 48 Q70 42 75 55 Q78 70 60 70 Q50 75 38 70 Q25 70 25 55 Z" fill="#D8B574" /> },
    garlic: { bg: '#F2EBD9', shape: <g><path d="M50 22 Q40 28 38 50 Q38 72 50 78 Q62 72 62 50 Q60 28 50 22 Z" fill="#F0E6C8" stroke="#C8B888" strokeWidth="1.5" /><path d="M50 22 L50 78" stroke="#C8B888" strokeWidth="1" /></g> },
    rice: { bg: '#F4EDDA', shape: <g><circle cx="40" cy="50" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /><circle cx="55" cy="45" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /><circle cx="48" cy="60" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /><circle cx="62" cy="58" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /></g> },
  };
  const r = recipes[kind] || recipes.onion;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">{r.shape}</svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hand-drawn underline (used for emphasis on titles)
// ─────────────────────────────────────────────────────────────
function HandUnderline({ color = T.amber, width = 80, style = {} }) {
  return (
    <svg width={width} height="8" viewBox={`0 0 ${width} 8`} style={{ display: 'block', marginTop: 2, ...style }}>
      <path d={`M2 5 Q ${width * 0.3} 1, ${width * 0.5} 4 T ${width - 2} 3`}
        stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar (used on home + saved screens)
// ─────────────────────────────────────────────────────────────
function TabBar({ active = 'home' }) {
  const tabs = [
    { k: 'home', label: 'ホーム', icon: <path d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2v-9z" /> },
    { k: 'fridge', label: '冷蔵庫', icon: <path d="M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zm0 8h14M8 7v2M8 14v3" /> },
    { k: 'saved', label: '保存', icon: <path d="M6 3h12v18l-6-4-6 4V3z" /> },
    { k: 'me', label: 'マイ', icon: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" /> },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, paddingTop: 8,
      background: T.surface,
      borderTop: `1px solid ${T.lineSoft}`,
      display: 'flex', justifyContent: 'space-around',
      zIndex: 5,
    }}>
      {tabs.map(t => {
        const on = t.k === active;
        return (
          <div key={t.k} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? T.terracotta : T.inkMuted,
            fontFamily: FONT.sans, fontSize: 10, fontWeight: on ? 600 : 500,
            letterSpacing: '0.06em',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={on ? 2 : 1.6}
              strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
            <span>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  T, FONT, PAPER_NOISE, Paper, Logo, Eyebrow, Dotted, Btn, Tag, YenStamp, Veggie, HandUnderline, TabBar,
});
