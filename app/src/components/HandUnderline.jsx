import { T } from '../tokens';

export default function HandUnderline({ color = T.amber, width = 80, style = {} }) {
  return (
    <svg width={width} height="8" viewBox={`0 0 ${width} 8`} style={{ display: 'block', marginTop: 2, ...style }}>
      <path
        d={`M2 5 Q ${width * 0.3} 1, ${width * 0.5} 4 T ${width - 2} 3`}
        stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
    </svg>
  );
}
