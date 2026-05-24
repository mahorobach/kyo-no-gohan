// Other screens: Onboarding, Text-input mode, Saved recipes

// ═════════════════════════════════════════════════════════════
// Onboarding — first screen, welcome
// ═════════════════════════════════════════════════════════════
function ScreenOnboarding() {
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Decorative top — abstract paper collage */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 360,
        background: `linear-gradient(180deg, ${T.bgWarm} 0%, ${T.bg} 100%)`,
        overflow: 'hidden',
      }}>
        {/* Big circle stamp */}
        <div style={{
          position: 'absolute', top: 130, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200, borderRadius: '50%',
          background: T.surface,
          border: `1.5px solid ${T.line}`,
          boxShadow: '0 14px 30px -16px rgba(42,31,20,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Inner: clustered veggie circles */}
          <div style={{ position: 'relative', width: 130, height: 130 }}>
            <div style={{ position: 'absolute', top: 0, left: 40 }}><Veggie kind="tomato" size={56} /></div>
            <div style={{ position: 'absolute', top: 30, left: 0 }}><Veggie kind="carrot" size={50} /></div>
            <div style={{ position: 'absolute', top: 30, right: 0 }}><Veggie kind="pepper" size={50} /></div>
            <div style={{ position: 'absolute', bottom: 0, left: 14 }}><Veggie kind="onion" size={52} /></div>
            <div style={{ position: 'absolute', bottom: 5, right: 18 }}><Veggie kind="egg" size={46} /></div>
          </div>
        </div>

        {/* Floating sticker */}
        <div style={{
          position: 'absolute', top: 96, right: 26,
          transform: 'rotate(8deg)',
          background: T.amber, color: T.surface,
          fontFamily: FONT.serif, fontSize: 11, fontWeight: 600,
          padding: '6px 12px', borderRadius: 4,
          letterSpacing: '0.08em',
          boxShadow: '0 8px 18px -8px rgba(216,154,61,0.55)',
        }}>＼ はじめまして ／</div>

        <div style={{
          position: 'absolute', top: 116, left: 30,
          transform: 'rotate(-6deg)',
          fontFamily: FONT.serif, fontSize: 12, color: T.inkMuted,
          background: T.amberTint, padding: '4px 10px', borderRadius: 4,
        }}>食材いっぱい</div>
      </div>

      {/* Bottom content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 460,
        padding: '36px 28px 40px',
        display: 'flex', flexDirection: 'column',
      }}>
        <Logo size={20} />

        <div style={{ marginTop: 30 }}>
          <Eyebrow>レシピは、考えなくていい</Eyebrow>
          <div style={{
            fontFamily: FONT.serif, fontSize: 28, fontWeight: 600, color: T.ink,
            lineHeight: 1.4, letterSpacing: '0.01em', marginTop: 12,
          }}>
            冷蔵庫を見せれば、<br/>
            今日のごはんが<br/>
            <span style={{ position: 'relative' }}>
              決まる。
              <HandUnderline width={92} color={T.terracotta} style={{ position: 'absolute', left: 0, top: '88%' }} />
            </span>
          </div>
          <div style={{
            fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft,
            lineHeight: 1.8, marginTop: 18,
          }}>
            写真をとるだけで、AIが食材を見つけて<br/>
            節約できるレシピを3つ提案します。
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
          <Dotz on />
          <Dotz />
          <Dotz />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Btn kind="accent" full>はじめる</Btn>
          <div style={{
            textAlign: 'center', fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted,
          }}>すでに登録ずみ　<span style={{ color: T.ink, fontWeight: 600 }}>ログイン</span></div>
        </div>
      </div>
    </Paper>
  );
}

function Dotz({ on }) {
  return (
    <div style={{
      width: on ? 24 : 6, height: 6, borderRadius: 3,
      background: on ? T.terracotta : T.line,
    }} />
  );
}

// ═════════════════════════════════════════════════════════════
// Text input mode — typing ingredients manually
// ═════════════════════════════════════════════════════════════
function ScreenTextInput() {
  const entered = [
    { name: '玉ねぎ', k: 'onion' },
    { name: '豚バラ肉', k: 'pork' },
    { name: '生姜', k: 'ginger' },
  ];
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* nav */}
      <div style={{
        padding: '60px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NavBack />
        <div style={{ fontFamily: FONT.serif, fontSize: 15, color: T.ink, fontWeight: 600 }}>
          食材を入力
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 19, background: T.terracotta,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1v22M1 12h22"/>
          </svg>
        </div>
      </div>

      {/* mode tabs */}
      <div style={{
        margin: '12px 22px 0',
        padding: 4,
        background: T.bgWarm, borderRadius: 12,
        display: 'flex', gap: 4,
      }}>
        {[
          { k: 'photo', label: '写真', on: false },
          { k: 'text', label: '文字', on: true },
          { k: 'voice', label: '音声', on: false },
        ].map(t => (
          <div key={t.k} style={{
            flex: 1, padding: '8px 0', borderRadius: 9,
            textAlign: 'center',
            background: t.on ? T.surface : 'transparent',
            color: t.on ? T.ink : T.inkMuted,
            fontFamily: FONT.sans, fontSize: 12, fontWeight: t.on ? 600 : 500,
            boxShadow: t.on ? '0 1px 2px rgba(0,0,0,0.06)' : undefined,
          }}>{t.label}</div>
        ))}
      </div>

      {/* helper */}
      <div style={{ padding: '20px 22px 0' }}>
        <Eyebrow>食材を1つずつ追加</Eyebrow>
        <div style={{
          fontFamily: FONT.serif, fontSize: 18, color: T.ink, fontWeight: 600,
          lineHeight: 1.5, marginTop: 8,
        }}>
          冷蔵庫にあるものを<br/>教えてください
        </div>
      </div>

      {/* Input field */}
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{
          background: T.surface, borderRadius: 14,
          border: `1.5px solid ${T.terracotta}`,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: `0 0 0 4px ${T.terracotta}1A`,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.inkSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4-4"/>
          </svg>
          <div style={{ flex: 1, fontFamily: FONT.serif, fontSize: 16, color: T.ink }}>
            キャ
            <span style={{
              display: 'inline-block', width: 1.5, height: 18, background: T.terracotta,
              verticalAlign: 'text-bottom', marginLeft: 1,
              animation: 'kgPulse 1s infinite',
            }} />
          </div>
          <div style={{
            fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted,
            padding: '3px 8px', borderRadius: 999, background: T.bgWarm,
          }}>音声 🎙</div>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.12em', marginBottom: 8 }}>
            候補
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { name: 'キャベツ', k: 'cabbage' },
              { name: 'キャラメル', k: null },
              { name: 'キャットフード', k: null, hint: '料理外' },
              { name: 'キムチ', k: null },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 999,
                background: i === 0 ? T.terracottaTint : T.surface,
                border: `1px solid ${i === 0 ? T.terracotta + '55' : T.line}`,
                fontFamily: FONT.serif, fontSize: 13,
                color: s.hint ? T.inkMuted : T.ink,
              }}>
                {s.k && <Veggie kind={s.k} size={22} />}
                <span>{s.name}</span>
                {s.hint && <span style={{ fontFamily: FONT.sans, fontSize: 9, color: T.inkMuted }}>·{s.hint}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Added list */}
      <div style={{ padding: '20px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Eyebrow color={T.sageDeep}>追加した食材</Eyebrow>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: T.sageDeep }}>3 つ</span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entered.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              background: T.surface, borderRadius: 14,
              border: `1px solid ${T.line}`,
            }}>
              <Veggie kind={it.k} size={32} />
              <div style={{ flex: 1, fontFamily: FONT.serif, fontSize: 14, color: T.ink, fontWeight: 600 }}>
                {it.name}
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: T.bgWarm, color: T.inkMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6L6 18"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard suggestion bar mock */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.bgDeep,
        padding: '8px 6px 36px',
        borderTop: `1px solid ${T.line}`,
      }}>
        {/* Suggestion strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '6px 12px 10px',
          fontFamily: FONT.serif, fontSize: 15, color: T.ink,
        }}>
          <span>キャベツ</span>
          <span style={{ color: T.inkMuted }}>|</span>
          <span>キャラメル</span>
          <span style={{ color: T.inkMuted }}>|</span>
          <span>キャットフード</span>
        </div>
        {/* Faux keyboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 4px' }}>
          {['あかさたなはまやらわ', 'いきしちにひみゆりを', 'うくすつぬふむよるん'].map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 4 }}>
              {[...row].map((ch, i) => (
                <div key={i} style={{
                  flex: 1, height: 36, background: T.surface, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT.serif, fontSize: 14, color: T.ink,
                  boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
                }}>{ch}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
}

// ═════════════════════════════════════════════════════════════
// Saved recipes
// ═════════════════════════════════════════════════════════════
function ScreenSaved() {
  const saved = [
    { title: '豚バラと玉ねぎの生姜焼き', stripe: T.amberTint, date: '昨日', tone: 'amber', count: 4 },
    { title: '麻婆豆腐', stripe: T.terracottaTint, date: '11/20', tone: 'terracotta', count: 6 },
    { title: 'もやしとベーコンのチャンプルー', stripe: T.sageTint, date: '11/18', tone: 'sage', count: 5 },
    { title: '鶏キャベツの蒸し物', stripe: T.sageTint, date: '11/15', tone: 'sage', count: 3 },
  ];
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* nav */}
      <div style={{
        padding: '60px 22px 0',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.2em' }}>
            お気に入り
          </div>
          <div style={{ fontFamily: FONT.serif, fontSize: 26, fontWeight: 600, color: T.ink, marginTop: 4 }}>
            保存したレシピ
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 19,
          background: T.surface, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>
          </svg>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '16px 22px 0', display: 'flex', gap: 6, overflow: 'hidden' }}>
        {[
          { label: 'すべて', on: true, n: 28 },
          { label: '節約', n: 12 },
          { label: '時短', n: 8 },
          { label: '和食', n: 14 },
          { label: '夜ごはん', n: 9 },
        ].map((f, i) => (
          <div key={i} style={{
            padding: '7px 12px', borderRadius: 999,
            background: f.on ? T.ink : T.surface,
            color: f.on ? T.surface : T.ink,
            border: `1px solid ${f.on ? T.ink : T.line}`,
            fontFamily: FONT.sans, fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
            flexShrink: 0,
          }}>
            {f.label}
            <span style={{ opacity: 0.6, fontSize: 10 }}>{f.n}</span>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ padding: '20px 22px 90px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {saved.map((s, i) => (
          <div key={i} style={{
            background: T.surface, borderRadius: 18,
            border: `1px solid ${T.line}`,
            overflow: 'hidden',
            display: 'flex',
            boxShadow: '0 6px 14px -12px rgba(42,31,20,0.3)',
          }}>
            <div style={{
              width: 88, flexShrink: 0,
              background: `repeating-linear-gradient(${30 + i * 22}deg, ${s.stripe} 0 8px, ${T.surface} 8px 16px)`,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 8, left: 8,
                background: T.surface, color: T.ink,
                fontFamily: FONT.mono, fontSize: 9, padding: '2px 5px', borderRadius: 3,
                letterSpacing: '0.06em',
              }}>{s.date}</div>
            </div>
            <div style={{ flex: 1, padding: '12px 14px' }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>
                {s.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <Tag tone={s.tone}>{s.count}回つくった</Tag>
                <span style={{
                  marginLeft: 'auto', color: T.terracotta,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 14c1.5-2.5 3-4.5 3-7 0-2.5-2-4-4.5-4S13 5 12 7c-1-2-3-4-5.5-4S2 4.5 2 7c0 2.5 1.5 4.5 3 7l7 7 7-7z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TabBar active="saved" />
    </Paper>
  );
}

Object.assign(window, { ScreenOnboarding, ScreenTextInput, ScreenSaved });
