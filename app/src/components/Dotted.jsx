import { T } from '../tokens';

export default function Dotted({ color = T.line, style = {} }) {
  return (
    <div style={{
      height: 1, borderTop: `1.5px dotted ${color}`,
      ...style,
    }} />
  );
}
