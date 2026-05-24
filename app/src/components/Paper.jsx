import { T, PAPER_NOISE } from '../tokens';

export default function Paper({ children, style = {}, color = T.bg }) {
  return (
    <div style={{
      background: color,
      backgroundImage: PAPER_NOISE,
      backgroundBlendMode: 'multiply',
      ...style,
    }}>
      {children}
    </div>
  );
}
