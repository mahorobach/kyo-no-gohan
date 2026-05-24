import { T, FONT } from '../tokens';

const tones = {
  neutral: { bg: T.bgDeep, fg: T.inkSoft },
  sage: { bg: T.sageTint, fg: T.sageDeep },
  terracotta: { bg: T.terracottaTint, fg: T.terracottaDeep },
  amber: { bg: T.amberTint, fg: '#8A6018' },
  ink: { bg: T.ink, fg: T.surface },
};

export default function Tag({ children, tone = 'neutral', style = {} }) {
  const c = tones[tone] || tones.neutral;
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
