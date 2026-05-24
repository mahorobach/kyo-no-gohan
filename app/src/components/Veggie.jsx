const recipes = {
  onion:   { bg: '#F3DEB6', shape: <ellipse cx="50" cy="55" rx="32" ry="35" fill="#E5C57E" /> },
  carrot:  { bg: '#F8D9B5', shape: <path d="M50 15 L62 85 Q50 92 38 85 Z" fill="#D97A3F" /> },
  pork:    { bg: '#F2D5CC', shape: <path d="M20 50 Q20 30 40 30 L70 30 Q85 30 85 50 Q85 70 70 70 L40 70 Q20 70 20 50 Z" fill="#D89187" stroke="#B36A60" strokeWidth="2" /> },
  chicken: { bg: '#F4DCB6', shape: <path d="M30 45 Q30 25 50 25 Q70 25 75 45 L72 70 Q60 78 50 78 Q40 78 28 70 Z" fill="#E6B675" /> },
  egg:     { bg: '#FBEFD0', shape: <ellipse cx="50" cy="52" rx="28" ry="32" fill="#F8E7B8" /> },
  tofu:    { bg: '#F5EFE0', shape: <rect x="22" y="28" width="56" height="44" fill="#F0E8D0" stroke="#D6CBA8" strokeWidth="1.5" /> },
  cabbage: { bg: '#E0E7C9', shape: <g><circle cx="50" cy="52" r="32" fill="#C9D5A0" /><path d="M50 20 Q50 50 50 84" stroke="#A8B780" strokeWidth="1.5" fill="none" /><path d="M22 52 Q50 50 78 52" stroke="#A8B780" strokeWidth="1.5" fill="none" /></g> },
  pepper:  { bg: '#DBE4C2', shape: <path d="M45 20 Q45 26 50 28 Q60 30 65 45 Q68 65 55 78 Q42 80 35 65 Q32 45 42 32 Q45 26 45 20 Z" fill="#7C8B5C" /> },
  tomato:  { bg: '#F2C9B8', shape: <g><circle cx="50" cy="56" r="28" fill="#D97757" /><path d="M40 30 L50 38 L60 30 L57 26 L50 32 L43 26 Z" fill="#7C8B5C" /></g> },
  milk:    { bg: '#EEEEEA', shape: <g><rect x="34" y="20" width="32" height="60" fill="#F8F6F0" stroke="#C8C2B0" strokeWidth="1.5" /><rect x="34" y="20" width="32" height="14" fill="#7C8B5C" /></g> },
  sprouts: { bg: '#EDEBD0', shape: <g><path d="M30 80 Q35 50 40 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><path d="M40 80 Q45 45 50 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><path d="M50 80 Q55 45 60 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><path d="M60 80 Q65 50 70 78" stroke="#E8DDB0" strokeWidth="2" fill="none" /><circle cx="35" cy="50" r="3" fill="#C9D5A0" /><circle cx="45" cy="46" r="3" fill="#C9D5A0" /><circle cx="55" cy="46" r="3" fill="#C9D5A0" /><circle cx="65" cy="50" r="3" fill="#C9D5A0" /></g> },
  leek:    { bg: '#E4ECD2', shape: <g><rect x="42" y="20" width="16" height="60" fill="#E8F0D0" /><rect x="42" y="55" width="16" height="25" fill="#C9D5A0" /></g> },
  miso:    { bg: '#EAD9B8', shape: <g><circle cx="50" cy="55" r="30" fill="#B88A4A" /><circle cx="50" cy="55" r="22" fill="#C9974F" /></g> },
  ginger:  { bg: '#F1E3C4', shape: <path d="M25 55 Q25 40 38 40 Q48 38 55 48 Q70 42 75 55 Q78 70 60 70 Q50 75 38 70 Q25 70 25 55 Z" fill="#D8B574" /> },
  garlic:  { bg: '#F2EBD9', shape: <g><path d="M50 22 Q40 28 38 50 Q38 72 50 78 Q62 72 62 50 Q60 28 50 22 Z" fill="#F0E6C8" stroke="#C8B888" strokeWidth="1.5" /><path d="M50 22 L50 78" stroke="#C8B888" strokeWidth="1" /></g> },
  rice:    { bg: '#F4EDDA', shape: <g><circle cx="40" cy="50" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /><circle cx="55" cy="45" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /><circle cx="48" cy="60" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /><circle cx="62" cy="58" r="6" fill="#F8F2E0" stroke="#D6CBA8" strokeWidth="1" /></g> },
};

export default function Veggie({ kind, size = 36 }) {
  const r = recipes[kind] || recipes.onion;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">{r.shape}</svg>
    </div>
  );
}
