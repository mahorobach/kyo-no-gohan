import { T, FONT } from '../tokens';

export default function Eyebrow({ children, color = T.terracotta }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.22em', color,
      textTransform: 'uppercase',
    }}>
      <span style={{ width: 18, height: 1, background: color, opacity: 0.6, flexShrink: 0 }} />
      {children}
    </div>
  );
}
