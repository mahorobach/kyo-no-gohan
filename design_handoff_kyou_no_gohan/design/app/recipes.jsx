// Recipe suggestions + Recipe detail screens

// ═════════════════════════════════════════════════════════════
// 3 recipe suggestions  (バリエーション3つ提案)
// ═════════════════════════════════════════════════════════════
function ScreenRecipes() {
  const recipes = [
    {
      title: '豚バラと玉ねぎの\n香ばし生姜焼き',
      kana: 'いまある食材だけで',
      time: 15, yen: 280, diff: 'かんたん',
      stripe: T.amberTint,
      uses: ['onion', 'pork', 'ginger'],
      missing: 0,
      tone: 'amber',
      kcal: 480,
      tag: 'おすすめ',
    },
    {
      title: 'ピーマンと豚肉の\nチンジャオロース風',
      kana: 'ごはんがすすむ',
      time: 20, yen: 320, diff: 'ふつう',
      stripe: T.sageTint,
      uses: ['pepper', 'pork', 'onion'],
      missing: 1,
      tone: 'sage',
      kcal: 520,
    },
    {
      title: 'たまごと玉ねぎの\nふわとろ親子丼',
      kana: 'やさしい味',
      time: 12, yen: 220, diff: 'かんたん',
      stripe: T.terracottaTint,
      uses: ['egg', 'onion', 'chicken'],
      missing: 1,
      tone: 'terracotta',
      kcal: 540,
    },
  ];
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* nav */}
      <div style={{
        padding: '60px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NavBack />
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted, letterSpacing: '0.08em' }}>すてっぷ 3 / 4</div>
        <div style={{
          width: 38, height: 38, borderRadius: 19,
          background: T.surface, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M10 18h4"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '14px 22px 0' }}>
        <div style={{
          fontFamily: FONT.serif, fontSize: 24, fontWeight: 600, color: T.ink,
          lineHeight: 1.35,
        }}>
          3つの<span style={{ color: T.terracotta }}>こんだて</span>を<br/>
          ご提案します
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft, marginTop: 8, lineHeight: 1.6 }}>
          6つの食材から、<span style={{ color: T.ink, fontWeight: 600 }}>15分以内・節約優先</span>でえらびました
        </div>
      </div>

      {/* Recipe cards */}
      <div style={{ padding: '20px 22px 110px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', maxHeight: 600 }}>
        {recipes.map((r, i) => (
          <RecipeCard key={i} r={r} idx={i + 1} featured={i === 0} />
        ))}

        {/* Show more */}
        <div style={{
          padding: '14px',
          borderRadius: 16,
          textAlign: 'center',
          border: `1.5px dashed ${T.line}`,
          fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft, fontWeight: 500,
        }}>
          他の組み合わせを見る　＋
        </div>
      </div>

      {/* Bottom toolbar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 40px',
        background: `linear-gradient(180deg, ${T.bg}00 0%, ${T.bg} 30%)`,
        display: 'flex', gap: 10,
      }}>
        <div style={{
          flex: 1, height: 50, borderRadius: 25,
          background: T.surface, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: FONT.sans, fontSize: 14, color: T.ink, fontWeight: 600,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M10 18h4"/>
          </svg>
          絞り込み
        </div>
        <Btn kind="accent" style={{ flex: 1.4 }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5"/>
            </svg>
          }
        >もう一度提案</Btn>
      </div>
    </Paper>
  );
}

function RecipeCard({ r, idx, featured }) {
  return (
    <div style={{
      background: T.surface, borderRadius: 22,
      border: `1px solid ${T.line}`,
      overflow: 'hidden', position: 'relative',
      boxShadow: featured
        ? `0 18px 30px -22px rgba(42,31,20,0.4), 0 0 0 1.5px ${T.terracotta}33`
        : '0 8px 18px -14px rgba(42,31,20,0.25)',
    }}>
      {/* image */}
      <div style={{
        height: 124, position: 'relative',
        background: `repeating-linear-gradient(${30 + idx * 25}deg, ${r.stripe} 0 8px, ${T.surface} 8px 16px)`,
      }}>
        {/* index stamp */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          width: 36, height: 36, borderRadius: 18,
          background: T.ink, color: T.surface,
          fontFamily: FONT.serif, fontSize: 18, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 14px -6px rgba(0,0,0,0.4)',
        }}>{idx}</div>
        {/* recommend badge */}
        {r.tag && (
          <div style={{
            position: 'absolute', top: 16, right: 14,
            transform: 'rotate(6deg)',
            background: T.terracotta, color: T.surface,
            fontFamily: FONT.serif, fontSize: 12, fontWeight: 600,
            padding: '5px 12px', borderRadius: 4,
            letterSpacing: '0.06em',
            boxShadow: '0 6px 14px -6px rgba(201,100,66,0.6)',
          }}>
            ＼ {r.tag} ／
          </div>
        )}
        {/* photo placeholder text */}
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontFamily: FONT.mono, fontSize: 9, color: T.inkMuted,
          letterSpacing: '0.1em',
        }}>料理写真</div>
      </div>

      {/* body */}
      <div style={{ padding: '14px 18px 16px' }}>
        <div style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, letterSpacing: '0.18em' }}>
          {r.kana}
        </div>
        <div style={{
          fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink,
          lineHeight: 1.35, marginTop: 4, whiteSpace: 'pre-line',
        }}>{r.title}</div>

        {/* meta row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          marginTop: 12, paddingTop: 12,
          borderTop: `1px dotted ${T.line}`,
        }}>
          <Meta value={r.time} unit="分" />
          <Divv />
          <Meta yen={r.yen} />
          <Divv />
          <Meta value={r.kcal} unit="kcal" />
          <Divv />
          <Tag tone={r.tone}>{r.diff}</Tag>
        </div>

        {/* uses */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginTop: 12, paddingTop: 10,
          borderTop: `1px solid ${T.lineSoft}`,
        }}>
          <div style={{
            fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted,
            letterSpacing: '0.12em',
          }}>つかう食材</div>
          <div style={{ display: 'flex', gap: -4, flex: 1 }}>
            {r.uses.map((k, i) => (
              <div key={i} style={{
                marginLeft: i ? -8 : 0, border: `2px solid ${T.surface}`,
                borderRadius: '50%',
              }}>
                <Veggie kind={k} size={26} />
              </div>
            ))}
          </div>
          {r.missing > 0 ? (
            <Tag tone="amber" style={{ marginLeft: 'auto' }}>＋{r.missing}つ買い足し</Tag>
          ) : (
            <Tag tone="sage" style={{ marginLeft: 'auto' }}>ぜんぶ家にある</Tag>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ value, unit, yen }) {
  if (yen) return <YenStamp value={yen} />;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
      <span style={{ fontFamily: FONT.serif, fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>{value}</span>
      <span style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted }}>{unit}</span>
    </div>
  );
}

function Divv() { return <div style={{ width: 1, height: 12, background: T.line }} />; }

// ═════════════════════════════════════════════════════════════
// Recipe Detail
// ═════════════════════════════════════════════════════════════
function ScreenDetail() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: T.bg }}>
      {/* Hero image */}
      <div style={{
        height: 290, position: 'relative',
        background: `linear-gradient(135deg, ${T.amberTint} 0%, ${T.terracottaTint} 100%)`,
        backgroundImage: `${PAPER_NOISE}, repeating-linear-gradient(45deg, ${T.amberTint} 0 14px, ${T.cream || T.amberTint} 14px 28px)`,
      }}>
        {/* dim overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(42,31,20,0.32) 100%)',
        }} />

        {/* top controls */}
        <div style={{
          position: 'absolute', top: 60, left: 22, right: 22,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <CamPill>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </CamPill>
          <div style={{ display: 'flex', gap: 8 }}>
            <CamPill>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a1 1 0 001 1h14a1 1 0 001-1v-8M16 6l-4-4-4 4M12 2v13"/>
              </svg>
            </CamPill>
            <CamPill>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.5-2.5 3-4.5 3-7 0-2.5-2-4-4.5-4S13 5 12 7c-1-2-3-4-5.5-4S2 4.5 2 7c0 2.5 1.5 4.5 3 7l7 7 7-7z"/>
              </svg>
            </CamPill>
          </div>
        </div>

        {/* photo placeholder hint */}
        <div style={{
          position: 'absolute', top: 130, left: '50%', transform: 'translateX(-50%)',
          fontFamily: FONT.mono, fontSize: 10, color: T.inkMuted,
          letterSpacing: '0.15em', background: T.surface,
          padding: '4px 10px', borderRadius: 4,
        }}>仕上がりイメージ</div>
      </div>

      {/* Sheet pulling up */}
      <div style={{
        position: 'absolute', top: 260, left: 0, right: 0, bottom: 0,
        background: T.surface,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '22px 22px 0',
        overflow: 'auto',
        boxShadow: '0 -20px 40px -22px rgba(42,31,20,0.3)',
      }}>
        {/* drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.line, margin: '0 auto 14px' }} />

        {/* tag row */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <Tag tone="terracotta">＼ AIおすすめ ／</Tag>
          <Tag tone="sage">節約レシピ</Tag>
          <Tag tone="amber">時短</Tag>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: FONT.serif, fontSize: 26, fontWeight: 600, color: T.ink,
          lineHeight: 1.35,
        }}>
          豚バラと玉ねぎの<br/>
          香ばし<span style={{ position: 'relative', display: 'inline-block' }}>
            生姜焼き
            <HandUnderline width={84} color={T.terracotta} style={{ position: 'absolute', left: 0, top: '85%' }} />
          </span>
        </div>

        <div style={{
          fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft,
          marginTop: 10, lineHeight: 1.7,
        }}>
          うちにある材料だけで、ご飯がすすむ甘辛い一皿。<br/>
          生姜のすりおろしと、玉ねぎの甘さが決め手です。
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          margin: '18px 0',
          padding: '14px 16px',
          background: T.bg, borderRadius: 16,
          border: `1px solid ${T.lineSoft}`,
        }}>
          {[
            { label: 'じかん', value: '15', unit: '分' },
            { label: '人ぶん', value: '2', unit: '人' },
            { label: 'コスト', value: '¥280', unit: '/人' },
            { label: 'カロリー', value: '480', unit: 'kcal' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: FONT.sans, fontSize: 9, color: T.inkMuted, letterSpacing: '0.16em' }}>
                {s.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                <span style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink }}>{s.value}</span>
                <span style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ingredients section */}
        <SectionHeader num="01" title="ざいりょう" sub="2人ぶん" />
        <div style={{ marginTop: 14 }}>
          {[
            { k: 'pork', name: '豚バラ肉', qty: '200g', have: true },
            { k: 'onion', name: '玉ねぎ', qty: '1個', have: true },
            { k: 'ginger', name: '生姜', qty: '1かけ', have: true },
            { k: null, name: '醤油', qty: '大さじ2', have: true, kind: 'cond' },
            { k: null, name: 'みりん', qty: '大さじ2', have: true, kind: 'cond' },
            { k: null, name: '砂糖', qty: '小さじ1', have: false, kind: 'cond' },
          ].map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: `1px dotted ${T.line}`,
            }}>
              {it.k ? <Veggie kind={it.k} size={28} /> : (
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: T.bgWarm, color: T.inkMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT.serif, fontSize: 13,
                }}>調</div>
              )}
              <div style={{ flex: 1, fontFamily: FONT.serif, fontSize: 14, color: T.ink }}>{it.name}</div>
              <div style={{ fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft }}>{it.qty}</div>
              {it.have ? (
                <div style={{
                  width: 18, height: 18, borderRadius: 9, background: T.sageTint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.sageDeep} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              ) : (
                <div style={{
                  width: 18, height: 18, borderRadius: 9,
                  border: `1.5px solid ${T.amber}`, color: T.amber,
                  fontFamily: FONT.sans, fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>＋</div>
              )}
            </div>
          ))}
        </div>

        {/* Buy missing CTA */}
        <div style={{
          marginTop: 14, padding: '12px 14px',
          background: T.amberTint, borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14, background: T.amber, color: T.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT.serif, fontSize: 14, fontWeight: 700,
          }}>!</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 13, fontWeight: 600, color: '#7A4F12' }}>
              砂糖が足りないかも
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, color: '#7A4F12', opacity: 0.75, marginTop: 1 }}>
              買い物リストに追加する
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A4F12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </div>

        {/* Steps */}
        <div style={{ marginTop: 28 }}>
          <SectionHeader num="02" title="つくりかた" sub="4ステップ" />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              '玉ねぎは薄切り、生姜はすりおろす。豚バラ肉はひと口大に切る。',
              '醤油・みりん・砂糖・生姜を混ぜて、たれを作っておく。',
              'フライパンに油を熱し、豚肉を中火で焼く。色が変わったら玉ねぎを加える。',
              '玉ねぎがしんなりしたら、たれを回し入れて全体に絡める。',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 13,
                  background: T.ink, color: T.surface,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT.serif, fontSize: 13, fontWeight: 600,
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{
                  fontFamily: FONT.serif, fontSize: 14, color: T.ink,
                  lineHeight: 1.75, paddingTop: 2,
                }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 100 }} />
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 22px 40px',
        background: T.surface,
        borderTop: `1px solid ${T.lineSoft}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 25,
          background: T.bg, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.terracotta} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.5-2.5 3-4.5 3-7 0-2.5-2-4-4.5-4S13 5 12 7c-1-2-3-4-5.5-4S2 4.5 2 7c0 2.5 1.5 4.5 3 7l7 7 7-7z"/>
          </svg>
        </div>
        <Btn kind="accent" style={{ flex: 1 }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 5v14l11-7-11-7z"/>
            </svg>
          }
        >料理をはじめる</Btn>
      </div>
    </div>
  );
}

function SectionHeader({ num, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: T.terracotta, fontWeight: 700,
        letterSpacing: '0.15em',
      }}>{num}</div>
      <div style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink }}>{title}</div>
      <div style={{ flex: 1, height: 1, borderBottom: `1px dotted ${T.line}` }} />
      <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { ScreenRecipes, ScreenDetail, RecipeCard, SectionHeader });
