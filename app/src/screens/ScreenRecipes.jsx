import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Btn from '../components/Btn';
import Tag from '../components/Tag';
import YenStamp from '../components/YenStamp';
import Veggie from '../components/Veggie';
import NavBack from '../components/NavBack';

const RECIPES = [
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

const CONDITIONS = ['時短', '節約', 'がっつり', 'やさしい味', '汁物', 'お弁当'];

function Meta({ value, unit, yen }) {
  if (yen) return <YenStamp value={yen} />;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
      <span style={{ fontFamily: FONT.serif, fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>{value}</span>
      <span style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted }}>{unit}</span>
    </div>
  );
}

function Divv() {
  return <div style={{ width: 1, height: 12, background: T.line }} />;
}

function RecipeCard({ r, idx, featured, onPress }) {
  return (
    <div onClick={onPress} style={{
      background: T.surface, borderRadius: 22,
      border: `1px solid ${T.line}`,
      overflow: 'hidden', position: 'relative',
      flexShrink: 0,
      boxShadow: featured
        ? `0 18px 30px -22px rgba(42,31,20,0.4), 0 0 0 1.5px ${T.terracotta}33`
        : '0 8px 18px -14px rgba(42,31,20,0.25)',
      cursor: 'pointer',
    }}>
      {/* 画像なしの一覧ヘッダー */}
      <div style={{
        minHeight: 72, position: 'relative',
        background: r.stripe ?? T.bgWarm,
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* 番号スタンプ */}
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: T.ink, color: T.surface,
          fontFamily: FONT.serif, fontSize: 18, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 14px -6px rgba(0,0,0,0.4)',
          flexShrink: 0,
        }}>{idx}</div>
        {/* おすすめバッジ */}
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
        <div style={{
          fontFamily: FONT.serif, fontSize: 17, fontWeight: 600, color: T.ink,
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingRight: r.tag ? 78 : 0,
          minWidth: 0,
        }}>{r.title}</div>
      </div>

      {/* カードボディ */}
      <div style={{ padding: '18px 18px 18px', minHeight: 150 }}>
        <div style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, letterSpacing: '0.18em' }}>
          {r.kana}
        </div>
        {r.description && (
          <div style={{
            fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft,
            lineHeight: 1.75, marginTop: 8,
          }}>{r.description}</div>
        )}

        {/* メタ行 */}
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

        {/* 使う食材 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginTop: 12, paddingTop: 10,
          borderTop: `1px solid ${T.lineSoft}`,
        }}>
          <div style={{
            fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted,
            letterSpacing: '0.12em',
          }}>つかう食材</div>
          <div style={{ display: 'flex', flex: 1 }}>
            {(r.uses ?? []).map((k, i) => (
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

export default function ScreenRecipes({
  navigate,
  recipes,
  loading,
  error,
  addError,
  ingredients,
  inputSource,
  addingRecipes,
  onSelectRecipe,
  onAddRecipes,
}) {
  const backTo = inputSource === 'text' ? 'textInput' : 'ingredients';
  const visibleRecipes = recipes ?? RECIPES;

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* ナビゲーション */}
      <div style={{
        padding: '60px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NavBack onClick={() => navigate(backTo)} />
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted, letterSpacing: '0.08em' }}>
          すてっぷ 3 / 4
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 19,
          background: T.surface, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
        </div>
      </div>

      {/* タイトル */}
      <div style={{ padding: '14px 22px 0' }}>
        <div style={{
          fontFamily: FONT.serif, fontSize: 24, fontWeight: 600, color: T.ink,
          lineHeight: 1.35,
        }}>
          {visibleRecipes.length}つの<span style={{ color: T.terracotta }}>こんだて</span>を<br />
          ご提案します
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft, marginTop: 8, lineHeight: 1.6 }}>
          {ingredients?.length ?? 0}つの食材から、<span style={{ color: T.ink, fontWeight: 600 }}>節約優先</span>でえらびました
        </div>
      </div>

      {/* レシピカード一覧 */}
      <div style={{
        padding: '20px 22px 110px',
        display: 'flex', flexDirection: 'column', gap: 14,
        overflowY: 'auto', maxHeight: 'calc(100% - 180px)',
      }}>
        {loading && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '60px 0', gap: 16,
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 18, color: T.ink }}>
              レシピを考えています…
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted }}>
              少しお待ちください
            </div>
          </div>
        )}
        {!loading && error && (
          <div style={{
            padding: '20px', borderRadius: 16,
            background: T.terracottaTint, color: T.terracottaDeep,
            fontFamily: FONT.sans, fontSize: 13, textAlign: 'center',
            flexShrink: 0,
          }}>{error}</div>
        )}
        {!loading && visibleRecipes.map((r, i) => (
          <RecipeCard
            key={i} r={r} idx={i + 1} featured={i === 0}
            onPress={() => onSelectRecipe ? onSelectRecipe(r) : navigate('detail')}
          />
        ))}

        {addingRecipes && (
          <div style={{
            padding: '22px',
            borderRadius: 18,
            background: T.surface,
            border: `1px solid ${T.line}`,
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 16, color: T.ink }}>
              追加で考えています…
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted, marginTop: 6 }}>
              今の候補は残したまま増やします
            </div>
          </div>
        )}

        {addError && (
          <div style={{
            padding: '14px',
            borderRadius: 16,
            background: T.terracottaTint,
            color: T.terracottaDeep,
            fontFamily: FONT.sans,
            fontSize: 12,
            textAlign: 'center',
            flexShrink: 0,
          }}>{addError}</div>
        )}

        <div style={{
          padding: '14px',
          borderRadius: 16,
          border: `1.5px dashed ${T.line}`,
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft,
            fontWeight: 600, textAlign: 'center',
          }}>
            条件を変えて探す +
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6,
            justifyContent: 'center', marginTop: 10,
          }}>
            {CONDITIONS.map((condition) => (
              <button
                key={condition}
                onClick={() => onAddRecipes && onAddRecipes(condition)}
                disabled={addingRecipes || loading}
                style={{
                  border: `1px solid ${T.line}`,
                  background: T.surface,
                  color: T.ink,
                  borderRadius: 999,
                  padding: '7px 11px',
                  fontFamily: FONT.sans,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: addingRecipes || loading ? 'not-allowed' : 'pointer',
                  opacity: addingRecipes || loading ? 0.55 : 1,
                }}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ボトムバー */}
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
          cursor: 'pointer',
        }} onClick={() => navigate(backTo)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
          材料を追加
        </div>
        <Btn kind="accent" style={{ flex: 1.4 }}
          onClick={() => onAddRecipes && onAddRecipes()}
          disabled={addingRecipes || loading}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5" />
            </svg>
          }
        >もう一度提案</Btn>
      </div>
    </Paper>
  );
}
