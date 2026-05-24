// Home screen variations for きょうのごはん
// 3 variants:  A) 大きなヒーロー (today's hero recipe + camera CTA)
//              B) カメラ中心  (camera-first, big shutter, quick recents)
//              C) 冷蔵庫日記   (fridge journal — list of recent scans)

// ─────────────────────────────────────────────────────────────
// Shared: top greeting strip (date + small avatar)
// ─────────────────────────────────────────────────────────────
function HomeGreeting({ name = 'さくらこ' }) {
  return (
    <div style={{
      padding: '70px 22px 0',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.2em' }}>
          11月 23日 ・ もくようび
        </div>
        <div style={{
          fontFamily: FONT.serif, fontSize: 24, fontWeight: 600, color: T.ink,
          marginTop: 6, letterSpacing: '0.02em',
        }}>
          こんばんは、<span style={{ color: T.terracotta }}>{name}</span>さん
        </div>
      </div>
      <div style={{
        width: 38, height: 38, borderRadius: 19,
        background: T.terracottaTint, color: T.terracottaDeep,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT.serif, fontSize: 16, fontWeight: 600,
        border: `1.5px solid ${T.surface}`,
        boxShadow: `0 0 0 1px ${T.terracotta}33`,
      }}>桜</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Variation A — HERO  (大きな「今日のごはん」カード + 撮影CTA)
// ═════════════════════════════════════════════════════════════
function HomeA() {
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <HomeGreeting />

      {/* HERO recipe card */}
      <div style={{ padding: '22px 22px 0' }}>
        <Eyebrow>今日のおすすめ</Eyebrow>
        <div style={{
          marginTop: 12, borderRadius: 24, overflow: 'hidden',
          background: T.surface, border: `1px solid ${T.line}`,
          boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset, 0 14px 30px -20px rgba(42,31,20,0.4)',
        }}>
          {/* Image placeholder */}
          <div style={{
            height: 168, position: 'relative',
            background: `repeating-linear-gradient(135deg, ${T.amberTint} 0 6px, ${T.cream || T.amberTint} 6px 12px)`,
            backgroundColor: T.amberTint,
            display: 'flex', alignItems: 'flex-end', padding: 14,
          }}>
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: T.surface, padding: '4px 10px', borderRadius: 999,
              fontFamily: FONT.mono, fontSize: 10, color: T.inkMuted,
              letterSpacing: '0.1em',
            }}>料理写真</div>
            <Tag tone="ink">＼ AIのおすすめ ／</Tag>
          </div>
          <div style={{ padding: '16px 18px 18px' }}>
            <div style={{
              fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: T.ink,
              lineHeight: 1.3, letterSpacing: '0.01em',
            }}>豚バラと玉ねぎの<br/>香ばし生姜焼き</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink }}>15</span>
                <span style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>分</span>
              </div>
              <div style={{ width: 1, height: 14, background: T.line }} />
              <YenStamp value="280" />
              <div style={{ width: 1, height: 14, background: T.line }} />
              <Tag tone="sage">かんたん</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* Camera CTA card */}
      <div style={{ padding: '16px 22px 0' }}>
        <div style={{
          background: T.ink, color: T.surface,
          borderRadius: 20, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: T.terracotta,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 7h3l2-3h4l2 3h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 16, fontWeight: 600, letterSpacing: '0.02em' }}>
              冷蔵庫を撮影しよう
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, opacity: 0.7, marginTop: 2 }}>
              中身からレシピを3つ提案します
            </div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Recent fridge scans strip */}
      <div style={{ padding: '20px 0 0 22px' }}>
        <Eyebrow color={T.sageDeep}>最近のさつえい</Eyebrow>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, paddingRight: 22, overflow: 'hidden' }}>
          {[
            { date: '昨日', ings: 8 },
            { date: '月曜', ings: 12 },
            { date: '土曜', ings: 6 },
          ].map((s, i) => (
            <div key={i} style={{
              width: 110, flexShrink: 0,
              background: T.surface, borderRadius: 16,
              border: `1px solid ${T.line}`,
              overflow: 'hidden',
            }}>
              <div style={{
                height: 72,
                background: `repeating-linear-gradient(45deg, ${T.bgWarm} 0 4px, ${T.bgDeep} 4px 8px)`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', bottom: 6, right: 6,
                  background: T.ink, color: T.surface,
                  fontFamily: FONT.mono, fontSize: 9, padding: '2px 5px', borderRadius: 4,
                }}>{s.ings}品</div>
              </div>
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>{s.date}</div>
                <div style={{ fontFamily: FONT.serif, fontSize: 13, color: T.ink, marginTop: 2 }}>
                  夜ごはん献立
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="home" />
    </Paper>
  );
}

// ═════════════════════════════════════════════════════════════
// Variation B — CAMERA-FIRST  (撮影が主役。大きなシャッターボタン)
// ═════════════════════════════════════════════════════════════
function HomeB() {
  return (
    <Paper color={T.bgWarm} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '70px 22px 0' }}>
        <Logo size={20} sub="v1" />
      </div>

      {/* Big question */}
      <div style={{ padding: '38px 28px 0' }}>
        <div style={{
          fontFamily: FONT.serif, fontSize: 30, fontWeight: 600, color: T.ink,
          lineHeight: 1.35, letterSpacing: '0.01em',
        }}>
          今日はなに、<br/>つくろうか？
        </div>
        <HandUnderline width={130} color={T.terracotta} />
        <div style={{
          fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft,
          marginTop: 16, lineHeight: 1.7,
        }}>
          冷蔵庫の中身を見せてくれたら、<br/>
          今夜のレシピを3つ考えます。
        </div>
      </div>

      {/* Huge shutter */}
      <div style={{
        position: 'absolute', top: 388, left: '50%', transform: 'translateX(-50%)',
        width: 188, height: 188,
      }}>
        {/* outer ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2px dashed ${T.terracotta}66`,
        }} />
        {/* inner button */}
        <div style={{
          position: 'absolute', inset: 14, borderRadius: '50%',
          background: T.terracotta, color: T.surface,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 24px 50px -16px rgba(201,100,66,0.65), 0 1px 0 rgba(255,255,255,0.2) inset',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 7h3l2-3h4l2 3h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <div style={{
            fontFamily: FONT.serif, fontSize: 17, fontWeight: 600,
            marginTop: 8, letterSpacing: '0.04em',
          }}>さつえい</div>
        </div>
      </div>

      {/* Secondary actions */}
      <div style={{
        position: 'absolute', top: 612, left: 22, right: 22,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction icon={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 11l3 3 5-5"/></>} label="画像から" />
          <SecondaryAction icon={<><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></>} label="文字で入力" />
          <SecondaryAction icon={<><path d="M12 4v8M12 18v.01"/><circle cx="12" cy="12" r="9"/></>} label="マイクで" />
        </div>
      </div>

      <TabBar active="home" />
    </Paper>
  );
}

function SecondaryAction({ icon, label }) {
  return (
    <div style={{
      flex: 1, background: T.surface, borderRadius: 16,
      border: `1px solid ${T.line}`, padding: '12px 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={T.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      <span style={{ fontFamily: FONT.sans, fontSize: 11, color: T.ink, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Variation C — FRIDGE JOURNAL  (冷蔵庫の記録が時系列で並ぶ)
// ═════════════════════════════════════════════════════════════
function HomeC() {
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Compact header */}
      <div style={{
        padding: '64px 22px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${T.lineSoft}`,
        background: T.bg,
      }}>
        <div>
          <div style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: T.ink }}>
            冷蔵庫の<span style={{ color: T.terracotta }}>記録</span>
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, marginTop: 2 }}>
            342日めの台所
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 19, background: T.terracotta,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 18px -8px rgba(201,100,66,0.55)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 7h3l2-3h4l2 3h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ padding: '14px 22px', display: 'flex', gap: 12, borderBottom: `1px solid ${T.lineSoft}` }}>
        <Stat n="3" label="今日の食材" tone="terracotta" />
        <Stat n="¥1,240" label="今週の節約" tone="sage" />
        <Stat n="28" label="保存レシピ" />
      </div>

      {/* Timeline */}
      <div style={{ padding: '18px 22px 100px' }}>
        <Eyebrow>レシピ日記</Eyebrow>

        <JournalEntry
          date="今日"
          time="18:42"
          dot={T.terracotta}
          fridge={['onion', 'pork', 'carrot', 'pepper']}
          recipes={['豚バラ生姜焼き', 'チンジャオロース風']}
          current
        />
        <JournalEntry
          date="昨日"
          time="19:15"
          dot={T.sage}
          fridge={['tofu', 'sprouts', 'leek']}
          recipes={['麻婆豆腐', 'もやしナムル']}
        />
        <JournalEntry
          date="月曜"
          time="20:03"
          dot={T.amber}
          fridge={['chicken', 'cabbage', 'egg']}
          recipes={['鶏キャベツ蒸し']}
          last
        />
      </div>

      <TabBar active="home" />
    </Paper>
  );
}

function Stat({ n, label, tone }) {
  const c = tone === 'terracotta' ? T.terracotta : tone === 'sage' ? T.sageDeep : T.ink;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: FONT.serif, fontSize: 20, fontWeight: 600, color: c, letterSpacing: '-0.01em' }}>{n}</div>
      <div style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function JournalEntry({ date, time, dot, fridge, recipes, current, last }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginTop: 16, position: 'relative' }}>
      {/* timeline rail */}
      <div style={{ width: 12, position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 12, height: 12, borderRadius: 6,
          background: dot,
          marginTop: 6,
          boxShadow: current ? `0 0 0 4px ${dot}33` : undefined,
        }} />
        {!last && <div style={{
          position: 'absolute', top: 22, left: 5.5, bottom: -16,
          width: 1, borderLeft: `1.5px dotted ${T.line}`,
        }} />}
      </div>

      {/* content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: FONT.serif, fontSize: 16, fontWeight: 600, color: T.ink }}>{date}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: T.inkMuted }}>{time}</span>
          {current && <Tag tone="terracotta" style={{ marginLeft: 'auto' }}>NEW</Tag>}
        </div>
        {/* fridge ingredients */}
        <div style={{
          marginTop: 8, padding: '10px 12px',
          background: T.surface, borderRadius: 14,
          border: `1px solid ${T.lineSoft}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ display: 'flex', gap: -4 }}>
            {fridge.slice(0, 4).map((k, i) => (
              <div key={i} style={{ marginLeft: i ? -8 : 0, border: `2px solid ${T.surface}`, borderRadius: '50%' }}>
                <Veggie kind={k} size={28} />
              </div>
            ))}
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkSoft }}>
            {fridge.length}品 検出
          </div>
        </div>
        {/* recipes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {recipes.map((r, i) => (
            <span key={i} style={{
              fontFamily: FONT.serif, fontSize: 12,
              padding: '4px 10px',
              borderBottom: `1.5px solid ${dot}66`,
              color: T.ink,
            }}>{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeA, HomeB, HomeC, HomeGreeting });
