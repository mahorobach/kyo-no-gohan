import { useRef } from 'react';
import { T, FONT } from '../tokens';

function CamPill({ children, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 19,
      background: 'rgba(255,255,255,0.16)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: T.surface, fontFamily: FONT.serif, fontSize: 22,
      cursor: 'pointer',
    }}>{children}</div>
  );
}

export default function ScreenCamera({ navigate, onAnalyzePhoto }) {
  const fileRef = useRef(null);

  const handleShutter = () => {
    if (onAnalyzePhoto) {
      onAnalyzePhoto(1);
    } else {
      navigate('analyzing');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onAnalyzePhoto) {
        onAnalyzePhoto(e.target.files.length);
      } else {
        navigate('analyzing');
      }
      e.target.value = '';
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1a140e' }}>
      {/* 冷蔵庫風ビューファインダー背景 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, #3a2e22 0%, #1a140e 70%)',
      }}>
        {/* 棚のシルエット */}
        <div style={{ position: 'absolute', top: '34%', left: 0, right: 0, height: 2, background: 'rgba(255,240,210,0.06)' }} />
        <div style={{ position: 'absolute', top: '58%', left: 0, right: 0, height: 2, background: 'rgba(255,240,210,0.08)' }} />
        <div style={{ position: 'absolute', top: '78%', left: 0, right: 0, height: 2, background: 'rgba(255,240,210,0.05)' }} />
        {/* 食材のシルエット */}
        <div style={{ position: 'absolute', top: '38%', left: '14%', width: 70, height: 90, borderRadius: 8, background: 'rgba(217,154,61,0.32)', filter: 'blur(6px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '46%', width: 56, height: 80, borderRadius: 28, background: 'rgba(124,139,92,0.4)', filter: 'blur(5px)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '20%', width: 110, height: 50, borderRadius: 8, background: 'rgba(229,184,174,0.3)', filter: 'blur(7px)' }} />
        <div style={{ position: 'absolute', top: '62%', left: '60%', width: 80, height: 60, borderRadius: 12, background: 'rgba(248,231,184,0.25)', filter: 'blur(6px)' }} />
      </div>

      {/* 上部グラデーション */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 140,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ナビゲーション */}
      <div style={{
        position: 'absolute', top: 64, left: 22, right: 22,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: T.surface, zIndex: 5,
      }}>
        <CamPill onClick={() => navigate('home')}>×</CamPill>
        <div style={{
          fontFamily: FONT.serif, fontSize: 14, color: T.surface,
          letterSpacing: '0.1em',
          padding: '6px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
        }}>冷蔵庫を撮影</div>
        <CamPill>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3h6l3 6h-2.5a2.5 2.5 0 010 5h-1l1 7H8l1-7H8a2.5 2.5 0 010-5H6l3-6z" />
          </svg>
        </CamPill>
      </div>

      {/* フォーカスフレーム（手書き風ブラケット） */}
      <div style={{
        position: 'absolute', top: '24%', bottom: '36%', left: '8%', right: '8%',
        pointerEvents: 'none',
      }}>
        {['nw', 'ne', 'sw', 'se'].map(corner => {
          const isLeft = corner.includes('w');
          const isTop = corner.startsWith('n');
          return (
            <svg key={corner} width="40" height="40" viewBox="0 0 40 40"
              style={{
                position: 'absolute',
                [isTop ? 'top' : 'bottom']: -2,
                [isLeft ? 'left' : 'right']: -2,
                transform: `scale(${isLeft ? 1 : -1}, ${isTop ? 1 : -1})`,
              }}>
              <path d="M2 18 Q2 4 6 3 Q14 2 22 2.5" stroke={T.amber} strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          );
        })}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', color: T.surface,
          fontFamily: FONT.serif, fontSize: 14,
          background: 'rgba(0,0,0,0.32)',
          padding: '8px 14px', borderRadius: 12,
          backdropFilter: 'blur(8px)',
          opacity: 0.85,
        }}>
          写したい棚や食材を<br />枠のなかに収めてね
        </div>
      </div>

      {/* ボトムコントロール */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 22px 50px',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
      }}>
        {/* モードタブ */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 22, marginBottom: 24,
          fontFamily: FONT.sans, fontSize: 12, letterSpacing: '0.15em',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            onClick={() => fileRef.current?.click()}>写真を選ぶ</span>
          <span style={{ color: T.amber, position: 'relative' }}>
            撮影
            <span style={{
              position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
              width: 4, height: 4, borderRadius: 2, background: T.amber,
            }} />
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            onClick={() => navigate('textInput')}>文字入力</span>
        </div>

        {/* シャッターロー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* ギャラリー */}
          <div onClick={() => fileRef.current?.click()} style={{
            width: 48, height: 48, borderRadius: 12,
            background: `repeating-linear-gradient(45deg, ${T.amberTint} 0 4px, ${T.amberTint} 4px 8px)`,
            border: `2px solid ${T.surface}`,
            cursor: 'pointer',
          }} />
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileChange} />

          {/* シャッターボタン */}
          <div onClick={handleShutter} style={{
            width: 78, height: 78, borderRadius: '50%',
            border: `3px solid ${T.surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', background: T.surface }} />
          </div>

          {/* フリップ */}
          <div style={{
            width: 48, height: 48, borderRadius: 24,
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.surface,
            backdropFilter: 'blur(8px)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
