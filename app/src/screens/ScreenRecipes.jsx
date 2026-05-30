import { T, FONT } from '../tokens';
import { useState } from 'react';
import Paper from '../components/Paper';
import Btn from '../components/Btn';
import Tag from '../components/Tag';
import YenStamp from '../components/YenStamp';
import Veggie from '../components/Veggie';
import NavBack from '../components/NavBack';
import { getDishImage } from '../lib/dishImage';

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
].slice(0, 2);

const CONDITIONS = ['おまかせ', '時短', '節約', 'がっつり', 'やさしい味', '汁物', 'お弁当'];
const MAX_SELECTED_CONDITIONS = 2;

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

function RecipeCard({ r, idx, featured, onPress, isFavorited, isBookmarked }) {
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
      {/* カードヘッダー */}
      <div style={{
        minHeight: 80, position: 'relative',
        background: r.stripe ?? T.bgWarm,
        padding: '14px 18px',
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
        {/* タイトル */}
        <div style={{
          flex: 1,
          fontFamily: FONT.serif, fontSize: 17, fontWeight: 600, color: T.ink,
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        }}>{r.title}</div>
        {/* 料理イラスト */}
        <img
          src={getDishImage(r)}
          alt=""
          style={{
            width: 68, height: 68,
            objectFit: 'contain',
            flexShrink: 0,
            opacity: 0.92,
          }}
        />
        {/* おすすめバッジ（イラストの上に重ねる） */}
        {r.tag && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
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
      </div>

      {/* カードボディ */}
      <div style={{ padding: '18px 18px 18px', minHeight: 150 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, letterSpacing: '0.18em' }}>
            {r.category ?? r.kana}
          </div>
          {/* ハート・ブックマークインジケーター */}
          <div style={{ display: 'flex', gap: 4 }}>
            {isFavorited && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill={T.terracotta} stroke={T.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.5-2.5 3-4.5 3-7 0-2.5-2-4-4.5-4S13 5 12 7c-1-2-3-4-5.5-4S2 4.5 2 7c0 2.5 1.5 4.5 3 7l7 7 7-7z" />
              </svg>
            )}
            {isBookmarked && (
              <svg width="11" height="13" viewBox="0 0 24 24" fill={T.terracotta} stroke={T.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            )}
          </div>
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

        <div style={{
          marginTop: 14,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            minHeight: 34,
            padding: '0 13px',
            borderRadius: 17,
            background: T.ink,
            color: T.surface,
            fontFamily: FONT.sans,
            fontSize: 12,
            fontWeight: 700,
          }}>
            詳しくはこちら
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

const normalizeTitle = (s = '') => s.replace(/\s+/g, '').trim();

export default function ScreenRecipes({
  navigate,
  recipes,
  loading,
  error,
  addError,
  ingredients,
  inputSource,
  generationLabel = 'おまかせ',
  addingRecipes,
  generationStatus,
  savedRecipes = [],
  onSelectRecipe,
  onAddRecipes,
}) {
  const backTo = inputSource === 'text' ? 'textInput' : 'ingredients';
  const visibleRecipes = recipes ?? RECIPES;
  const reachedLimit = generationStatus && generationStatus.remaining <= 0;
  const [selectedAddConditions, setSelectedAddConditions] = useState(['おまかせ']);

  const toggleAddCondition = (condition) => {
    setSelectedAddConditions((current) => {
      if (condition === 'おまかせ') return ['おまかせ'];

      const withoutDefault = current.filter((item) => item !== 'おまかせ');
      if (withoutDefault.includes(condition)) {
        const next = withoutDefault.filter((item) => item !== condition);
        return next.length ? next : ['おまかせ'];
      }

      if (withoutDefault.length >= MAX_SELECTED_CONDITIONS) {
        return [withoutDefault[0], condition];
      }

      return [...withoutDefault, condition];
    });
  };

  const addConditionLabel = selectedAddConditions.join('・');

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* ナビゲーション */}
      <div style={{
        padding: '60px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NavBack onClick={() => navigate(backTo)} />
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted, letterSpacing: '0.08em' }}>
          ステップ 3 / 4
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
          {ingredients?.length ?? 0}つの食材から、<span style={{ color: T.ink, fontWeight: 600 }}>{generationLabel}</span>でえらびました
        </div>
        {generationStatus && (
          <div style={{
            fontFamily: FONT.sans,
            fontSize: 11,
            color: reachedLimit ? T.terracottaDeep : T.inkMuted,
            marginTop: 6,
            lineHeight: 1.6,
          }}>
            今日の生成 {generationStatus.used} / {generationStatus.limit}回
            {reachedLimit ? '。追加生成は明日また使えます。' : `。あと${generationStatus.remaining}回追加できます。`}
          </div>
        )}
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
        {!loading && visibleRecipes.map((r, i) => {
          const matched = savedRecipes.find(
            (s) => normalizeTitle(s.title) === normalizeTitle(r.title),
          );
          return (
            <RecipeCard
              key={i} r={r} idx={i + 1} featured={i === 0}
              isFavorited={Boolean(matched?.favoritedAt)}
              isBookmarked={Boolean(matched?.bookmarkedAt)}
              onPress={() => onSelectRecipe ? onSelectRecipe(r) : navigate('detail')}
            />
          );
        })}

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
            条件を変えて探す
          </div>
          <div style={{
            fontFamily: FONT.sans,
            fontSize: 11,
            color: T.inkMuted,
            textAlign: 'center',
            marginTop: 4,
          }}>
            1つならその条件で2品、2つなら各条件で1品ずつ追加します
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6,
            justifyContent: 'center', marginTop: 10,
          }}>
            {CONDITIONS.map((condition) => {
              const active = selectedAddConditions.includes(condition);
              return (
                <button
                  key={condition}
                  onClick={() => toggleAddCondition(condition)}
                  disabled={addingRecipes || loading || reachedLimit}
                  style={{
                    border: `1px solid ${active ? T.terracotta : T.line}`,
                    background: active ? T.terracottaTint : T.surface,
                    color: active ? T.terracottaDeep : T.ink,
                    borderRadius: 999,
                    padding: '7px 11px',
                    fontFamily: FONT.sans,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: addingRecipes || loading || reachedLimit ? 'not-allowed' : 'pointer',
                    opacity: addingRecipes || loading || reachedLimit ? 0.55 : 1,
                  }}
                >
                  {condition}
                </button>
              );
            })}
          </div>
          <Btn
            kind="soft"
            full
            style={{ height: 42, marginTop: 12, fontSize: 13 }}
            onClick={() => onAddRecipes && onAddRecipes(selectedAddConditions)}
            disabled={addingRecipes || loading || reachedLimit}
          >
            {addConditionLabel}で2品追加
          </Btn>
          <div style={{
            fontFamily: FONT.sans,
            fontSize: 10,
            color: T.inkMuted,
            textAlign: 'center',
            marginTop: 7,
            lineHeight: 1.5,
          }}>
            押すと今日の生成回数を1回使います
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
          disabled={addingRecipes || loading || reachedLimit}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5" />
            </svg>
          }
        >{reachedLimit ? '上限です' : 'もう一度提案'}</Btn>
      </div>
    </Paper>
  );
}
