import { T, FONT } from '../tokens';

export default function Btn({ children, kind = 'primary', icon, full, style = {}, onClick, disabled }) {
  const base = {
    fontFamily: FONT.sans, fontSize: 16, fontWeight: 600,
    height: 52, padding: '0 22px', borderRadius: 26,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    letterSpacing: '0.04em',
    width: full ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1,
    transition: 'opacity 0.15s',
    ...style,
  };
  const variants = {
    primary: { background: T.ink, color: T.surface, boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 8px 22px -10px rgba(42,31,20,0.5)' },
    accent: { background: T.terracotta, color: T.surface, boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px -10px rgba(201,100,66,0.6)' },
    ghost: { background: 'transparent', color: T.ink, border: `1.5px solid ${T.ink}` },
    soft: { background: T.surface, color: T.ink, border: `1px solid ${T.line}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[kind] }}>
      {icon}
      {children}
    </button>
  );
}
