import { useMemo, useState, useEffect } from 'react';
import { T, FONT } from '../tokens';
import Veggie from '../components/Veggie';
import Dotted from '../components/Dotted';

const FALLBACK_DETECTED = [
  { k: 'onion', name: '玉ねぎ', x: '14%', y: '18%', size: 56, conf: 98 },
  { k: 'pork', name: '豚バラ肉', x: '52%', y: '22%', size: 64, conf: 95 },
  { k: 'pepper', name: 'ピーマン', x: '18%', y: '48%', size: 48, conf: 91 },
  { k: 'ginger', name: '生姜', x: '58%', y: '50%', size: 42, conf: 88 },
];

const positions = [
  { x: '14%', y: '18%', size: 56 },
  { x: '52%', y: '22%', size: 64 },
  { x: '18%', y: '48%', size: 48 },
  { x: '58%', y: '50%', size: 42 },
  { x: '32%', y: '66%', size: 46 },
  { x: '68%', y: '68%', size: 44 },
];

const PENDING = [
  { x: '34%', y: '72%', size: 50 },
  { x: '68%', y: '74%', size: 44 },
];

function Dot({ delay }) {
  return (
    <div style={{
      width: 5, height: 5, borderRadius: 3, background: T.amber,
      animation: `kgPulse 1.2s ${delay}s infinite ease-in-out`,
    }} />
  );
}

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

export default function ScreenAnalyzing({ navigate, detectedIngredients = [] }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const allDetected = useMemo(
    () => (detectedIngredients.length ? detectedIngredients : FALLBACK_DETECTED).map((item, index) => ({
      ...positions[index % positions.length],
      ...item,
    })),
    [detectedIngredients],
  );

  useEffect(() => {
    const timers = [];
    allDetected.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 600 + i * 700));
    });
    // 全検出後に自動遷移
    timers.push(setTimeout(() => navigate('ingredients'), 600 + allDetected.length * 700 + 800));
    return () => timers.forEach(clearTimeout);
  }, [allDetected, navigate]);

  const detected = allDetected.slice(0, visibleCount);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1a140e' }}>
      {/* 背景 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, #3a2e22 0%, #1a140e 70%)',
      }} />

      {/* 検出済み食材（アニメーション付き） */}
      {detected.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y,
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'kgFadeInScale 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <div style={{ position: 'relative' }}>
            {/* パルスリング */}
            <div style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: `1.5px solid ${T.amber}66`,
            }} />
            <Veggie kind={d.k} size={d.size} />
          </div>
          {/* ラベル */}
          <div style={{
            background: T.surface, borderRadius: 999,
            padding: '5px 10px 5px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 8px 22px -10px rgba(0,0,0,0.5)',
            animation: 'kgSlideInRight 0.4s ease both',
          }}>
            <span style={{ fontFamily: FONT.serif, fontSize: 13, fontWeight: 600, color: T.ink }}>{d.name}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: T.sageDeep, letterSpacing: '0.05em' }}>{d.conf}%</span>
          </div>
        </div>
      ))}

      {/* 検出待機中マーカー */}
      {visibleCount < allDetected.length && PENDING.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: '50%',
          border: `2px dashed ${T.amber}`,
          background: 'rgba(255,200,100,0.12)',
        }} />
      ))}

      {/* 上部ヘッダー */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '60px 22px 0',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
        zIndex: 5,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CamPill onClick={() => navigate('home')}>×</CamPill>
          <div style={{
            fontFamily: FONT.serif, fontSize: 14, color: T.surface,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            letterSpacing: '0.08em',
          }}>食材を見つけているよ…</div>
          <div style={{ width: 38 }} />
        </div>
      </div>

      {/* ボトムプログレスシート */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.surface,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '20px 22px 38px',
        boxShadow: '0 -20px 60px -20px rgba(0,0,0,0.4)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.line, margin: '0 auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink }}>
            食材を見つけました
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: T.sageDeep }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>{visibleCount}</span> / {allDetected.length}
          </div>
        </div>

        <Dotted />

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {detected.slice(0, 3).map((d, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              animation: 'kgSlideUp 0.35s ease both',
            }}>
              <Veggie kind={d.k} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 14, color: T.ink }}>{d.name}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.sageDeep} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ))}
          {visibleCount < allDetected.length && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.95 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: `2px dashed ${T.amber}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT.mono, fontSize: 14, color: T.amber, fontWeight: 700,
              }}>?</div>
              <div style={{ flex: 1, fontFamily: FONT.serif, fontSize: 14, color: T.inkMuted, fontStyle: 'italic' }}>
                {allDetected[visibleCount]?.name}を見つけています…
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                <Dot delay={0} />
                <Dot delay={0.2} />
                <Dot delay={0.4} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
