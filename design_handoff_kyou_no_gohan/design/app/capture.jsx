// Camera / Analyzing / Detected ingredients flow

// ═════════════════════════════════════════════════════════════
// Camera capture screen
// ═════════════════════════════════════════════════════════════
function ScreenCamera() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1a140e' }}>
      {/* Fake camera viewfinder — paper-y blurry "fridge interior" */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, #3a2e22 0%, #1a140e 70%)',
      }}>
        {/* Suggestion of fridge shelves */}
        <div style={{ position: 'absolute', top: '34%', left: 0, right: 0, height: 2, background: 'rgba(255,240,210,0.06)' }} />
        <div style={{ position: 'absolute', top: '58%', left: 0, right: 0, height: 2, background: 'rgba(255,240,210,0.08)' }} />
        <div style={{ position: 'absolute', top: '78%', left: 0, right: 0, height: 2, background: 'rgba(255,240,210,0.05)' }} />

        {/* Suggested food shapes */}
        <div style={{ position: 'absolute', top: '38%', left: '14%', width: 70, height: 90, borderRadius: 8, background: 'rgba(217,154,61,0.32)', filter: 'blur(6px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '46%', width: 56, height: 80, borderRadius: 28, background: 'rgba(124,139,92,0.4)', filter: 'blur(5px)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '20%', width: 110, height: 50, borderRadius: 8, background: 'rgba(229,184,174,0.3)', filter: 'blur(7px)' }} />
        <div style={{ position: 'absolute', top: '62%', left: '60%', width: 80, height: 60, borderRadius: 12, background: 'rgba(248,231,184,0.25)', filter: 'blur(6px)' }} />
      </div>

      {/* Status bar gradient overlay (top) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 140,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Close + flash + help */}
      <div style={{
        position: 'absolute', top: 64, left: 22, right: 22,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: T.surface, zIndex: 5,
      }}>
        <CamPill>×</CamPill>
        <div style={{
          fontFamily: FONT.serif, fontSize: 14, color: T.surface,
          letterSpacing: '0.1em',
          padding: '6px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
        }}>冷蔵庫を撮影</div>
        <CamPill>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3h6l3 6h-2.5a2.5 2.5 0 010 5h-1l1 7H8l1-7H8a2.5 2.5 0 010-5H6l3-6z"/>
          </svg>
        </CamPill>
      </div>

      {/* Focus frame (hand-drawn brackets) */}
      <div style={{
        position: 'absolute', top: '24%', bottom: '36%', left: '8%', right: '8%',
        pointerEvents: 'none',
      }}>
        {['nw','ne','sw','se'].map(corner => {
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
        {/* Hint label */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', color: T.surface,
          fontFamily: FONT.serif, fontSize: 14,
          background: 'rgba(0,0,0,0.32)',
          padding: '8px 14px', borderRadius: 12,
          backdropFilter: 'blur(8px)',
          opacity: 0.85,
        }}>
          冷蔵庫の中身を<br/>枠のなかに収めてね
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 22px 50px',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
      }}>
        {/* Mode tabs */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 22, marginBottom: 24,
          fontFamily: FONT.sans, fontSize: 12, letterSpacing: '0.15em',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>アルバム</span>
          <span style={{ color: T.amber, position: 'relative' }}>
            さつえい
            <span style={{
              position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
              width: 4, height: 4, borderRadius: 2, background: T.amber,
            }} />
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>もじ入力</span>
        </div>

        {/* Shutter row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Gallery thumb */}
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `repeating-linear-gradient(45deg, ${T.amberTint} 0 4px, ${T.cream || T.amberTint} 4px 8px)`,
            border: `2px solid ${T.surface}`,
          }} />

          {/* Shutter */}
          <div style={{
            width: 78, height: 78, borderRadius: '50%',
            border: `3px solid ${T.surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', background: T.surface }} />
          </div>

          {/* Flip */}
          <div style={{
            width: 48, height: 48, borderRadius: 24,
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.surface,
            backdropFilter: 'blur(8px)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function CamPill({ children }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 19,
      background: 'rgba(255,255,255,0.16)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: T.surface, fontFamily: FONT.serif, fontSize: 22,
    }}>{children}</div>
  );
}

// ═════════════════════════════════════════════════════════════
// Analyzing screen — ingredients animate in one by one
// (we show a "freeze frame" of mid-detection state)
// ═════════════════════════════════════════════════════════════
function ScreenAnalyzing() {
  // Simulate state: 4 detected so far, 2 still detecting
  const detected = [
    { k: 'onion', name: '玉ねぎ', x: '14%', y: '20%', size: 56, conf: 98 },
    { k: 'pork', name: '豚バラ肉', x: '52%', y: '24%', size: 64, conf: 95 },
    { k: 'pepper', name: 'ピーマン', x: '20%', y: '50%', size: 48, conf: 91 },
    { k: 'ginger', name: '生姜', x: '60%', y: '52%', size: 42, conf: 88 },
  ];
  const pending = [
    { x: '36%', y: '74%', size: 50 },
    { x: '70%', y: '76%', size: 44 },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1a140e' }}>
      {/* Same fridge backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, #3a2e22 0%, #1a140e 70%)',
      }} />

      {/* Detected veggies with labels */}
      {detected.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {/* Pulse ring */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: `1.5px solid ${T.amber}66`,
            }} />
            <Veggie kind={d.k} size={d.size} />
          </div>
          {/* Label tag */}
          <div style={{
            background: T.surface, borderRadius: 999,
            padding: '5px 10px 5px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 8px 22px -10px rgba(0,0,0,0.5)',
          }}>
            <span style={{ fontFamily: FONT.serif, fontSize: 13, fontWeight: 600, color: T.ink }}>{d.name}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: T.sageDeep, letterSpacing: '0.05em' }}>{d.conf}%</span>
          </div>
        </div>
      ))}

      {/* Pending detection markers (animated dots) */}
      {pending.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: '50%',
          border: `2px dashed ${T.amber}`,
          background: 'rgba(255,200,100,0.12)',
        }} />
      ))}

      {/* Top header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '60px 22px 0',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
        zIndex: 5,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CamPill>×</CamPill>
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

      {/* Bottom progress sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.surface,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '20px 22px 38px',
        boxShadow: '0 -20px 60px -20px rgba(0,0,0,0.4)',
      }}>
        {/* drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.line, margin: '0 auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink }}>
            食材を見つけました
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: T.sageDeep }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>4</span> / 6
          </div>
        </div>

        <Dotted />

        {/* Animating ingredient list */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {detected.slice(0, 3).map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Veggie kind={d.k} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 14, color: T.ink }}>{d.name}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.sageDeep} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          ))}
          {/* currently detecting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.95 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: `2px dashed ${T.amber}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT.mono, fontSize: 14, color: T.amber, fontWeight: 700,
            }}>?</div>
            <div style={{ flex: 1, fontFamily: FONT.serif, fontSize: 14, color: T.inkMuted, fontStyle: 'italic' }}>
              生姜を見つけています…
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              <Dot delay={0} />
              <Dot delay={0.2} />
              <Dot delay={0.4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <div style={{
      width: 5, height: 5, borderRadius: 3, background: T.amber,
      animation: `kgPulse 1.2s ${delay}s infinite ease-in-out`,
    }} />
  );
}

// ═════════════════════════════════════════════════════════════
// Detected ingredients — list / editable
// ═════════════════════════════════════════════════════════════
function ScreenIngredients() {
  const items = [
    { k: 'onion', name: '玉ねぎ', qty: '2個', conf: 98 },
    { k: 'pork', name: '豚バラ肉', qty: '約 200g', conf: 95 },
    { k: 'pepper', name: 'ピーマン', qty: '4個', conf: 91 },
    { k: 'ginger', name: '生姜', qty: '1かけ', conf: 88 },
    { k: 'carrot', name: '人参', qty: '1本', conf: 84 },
    { k: 'egg', name: '卵', qty: '6個', conf: 92, low: true },
  ];
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* nav */}
      <div style={{
        padding: '60px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NavBack />
        <div style={{ fontFamily: FONT.serif, fontSize: 14, color: T.inkMuted }}>2 / 4</div>
        <div style={{
          fontFamily: FONT.sans, fontSize: 12, color: T.terracotta, fontWeight: 600,
        }}>スキップ</div>
      </div>

      {/* Title */}
      <div style={{ padding: '20px 22px 0' }}>
        <Eyebrow>すてっぷ 2</Eyebrow>
        <div style={{
          fontFamily: FONT.serif, fontSize: 26, fontWeight: 600, color: T.ink,
          lineHeight: 1.35, marginTop: 10,
        }}>これで合ってる？</div>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft, marginTop: 6 }}>
          見落としや、間違えがあったら直してね
        </div>
      </div>

      {/* Snapshot strip */}
      <div style={{ padding: '18px 22px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 14,
          background: `radial-gradient(ellipse at 60% 40%, #5a4a35 0%, #2a1f14 80%)`,
          border: `1px solid ${T.line}`,
          flexShrink: 0, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 14, left: 8, width: 14, height: 20, borderRadius: 3, background: 'rgba(217,154,61,0.4)' }} />
          <div style={{ position: 'absolute', top: 16, left: 28, width: 12, height: 18, borderRadius: 3, background: 'rgba(124,139,92,0.5)' }} />
          <div style={{ position: 'absolute', top: 38, left: 14, width: 22, height: 12, borderRadius: 3, background: 'rgba(229,184,174,0.4)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.06em' }}>
            撮影した写真
          </div>
          <div style={{ fontFamily: FONT.serif, fontSize: 15, color: T.ink, marginTop: 2 }}>
            6 つの食材を検出
          </div>
        </div>
        <span style={{
          fontFamily: FONT.sans, fontSize: 12, color: T.terracotta, fontWeight: 600,
          padding: '8px 12px', border: `1.5px solid ${T.terracotta}`, borderRadius: 999,
        }}>撮り直し</span>
      </div>

      {/* Ingredient list */}
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{
          background: T.surface, borderRadius: 18,
          border: `1px solid ${T.line}`,
          overflow: 'hidden',
        }}>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderBottom: i < items.length - 1 ? `1px solid ${T.lineSoft}` : 'none',
            }}>
              <Veggie kind={it.k} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: FONT.serif, fontSize: 15, fontWeight: 600, color: T.ink,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {it.name}
                  {it.low && <Tag tone="amber">残りすくない</Tag>}
                </div>
                <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, marginTop: 2 }}>
                  {it.qty}　・　信頼度 {it.conf}%
                </div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: 14,
                border: `1px solid ${T.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.inkMuted,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Add manual */}
        <div style={{
          marginTop: 10, padding: '12px 14px',
          border: `1.5px dashed ${T.line}`, borderRadius: 18,
          display: 'flex', alignItems: 'center', gap: 10,
          color: T.inkSoft,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500 }}>
            足りないものを追加する
          </span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 40px',
        background: `linear-gradient(180deg, ${T.bg}00 0%, ${T.bg} 30%)`,
      }}>
        <Btn kind="accent" full
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.5 7 7.5.5-5.5 5 1.5 7.5L12 18l-6 4 1.5-7.5L2 9.5 9.5 9 12 2z"/>
            </svg>
          }
        >レシピを提案してもらう</Btn>
      </div>
    </Paper>
  );
}

function NavBack() {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 19,
      background: T.surface, border: `1px solid ${T.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 6l-6 6 6 6"/>
      </svg>
    </div>
  );
}

Object.assign(window, { ScreenCamera, ScreenAnalyzing, ScreenIngredients, NavBack });
