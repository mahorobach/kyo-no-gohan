import { T, FONT } from '../tokens';

export default function YenStamp({ value, perPerson = true }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 2,
      fontFamily: FONT.serif, color: T.ink,
    }}>
      <span style={{ fontSize: 14 }}>¥</span>
      <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{value}</span>
      {perPerson && (
        <span style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, marginLeft: 2 }}>/人</span>
      )}
    </div>
  );
}
