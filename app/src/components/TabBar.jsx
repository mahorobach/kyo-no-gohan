import { T, FONT } from '../tokens';

const tabs = [
  {
    k: 'home', label: 'ホーム',
    icon: <path d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2v-9z" />,
  },
  {
    k: 'fridge', label: '冷蔵庫',
    icon: <path d="M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zm0 8h14M8 7v2M8 14v3" />,
  },
  {
    k: 'saved', label: 'レシピ帳',
    icon: <path d="M6 3h12v18l-6-4-6 4V3z" />,
  },
  {
    k: 'me', label: 'マイ',
    icon: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />,
  },
];

export default function TabBar({ active = 'home', onTab }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, paddingTop: 8,
      background: T.surface,
      borderTop: `1px solid ${T.lineSoft}`,
      display: 'flex', justifyContent: 'space-around',
      zIndex: 5,
    }}>
      {tabs.map(t => {
        const on = t.k === active;
        return (
          <div key={t.k}
            onClick={() => onTab && onTab(t.k)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: on ? T.terracotta : T.inkMuted,
              fontFamily: FONT.sans, fontSize: 10, fontWeight: on ? 600 : 500,
              letterSpacing: '0.06em',
              cursor: 'pointer',
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={on ? 2 : 1.6}
              strokeLinecap="round" strokeLinejoin="round">
              {t.icon}
            </svg>
            <span>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
