import { T, FONT } from '../tokens';

export default function Logo({ size = 22, color = T.ink, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{
        fontFamily: FONT.serif, fontWeight: 600, fontSize: size, color,
        letterSpacing: '0.04em', lineHeight: 1,
      }}>
        きょうの<span style={{ color: T.terracotta }}>ごはん</span>
      </span>
      {sub && (
        <span style={{
          fontFamily: FONT.sans, fontSize: size * 0.42, color: T.inkMuted,
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>{sub}</span>
      )}
    </div>
  );
}
