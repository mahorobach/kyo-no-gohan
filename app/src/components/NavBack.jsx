import { T } from '../tokens';

export default function NavBack({ onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 19,
      background: T.surface, border: `1px solid ${T.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </div>
  );
}
