import { T, FONT } from '../tokens';

export default function SectionHeader({ num, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: T.terracotta, fontWeight: 700,
        letterSpacing: '0.15em',
      }}>{num}</div>
      <div style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink }}>{title}</div>
      <div style={{ flex: 1, height: 1, borderBottom: `1px dotted ${T.line}` }} />
      <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>{sub}</div>
    </div>
  );
}
