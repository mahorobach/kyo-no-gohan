import { useState } from 'react';
import { T, FONT, PAPER_NOISE } from '../tokens';
import Btn from '../components/Btn';
import Tag from '../components/Tag';
import Veggie from '../components/Veggie';
import HandUnderline from '../components/HandUnderline';
import SectionHeader from '../components/SectionHeader';
import { recipePatterns } from '../data/recipePatterns';
import { getDishImage } from '../lib/dishImage';

const DEFAULT_RECIPE = {
  title: '豚バラと玉ねぎの\n香ばし生姜焼き',
  description: 'うちにある材料だけで、ご飯がすすむ甘辛い一皿。生姜のすりおろしと、玉ねぎの甘さが決め手です。',
  time: 15,
  yen: 280,
  kcal: 480,
  ingredients: [
    { k: 'pork', name: '豚バラ肉', qty: '200g', have: true },
    { k: 'onion', name: '玉ねぎ', qty: '1個', have: true },
    { k: 'ginger', name: '生姜', qty: '1かけ', have: true },
    { k: null, name: '醤油', qty: '大さじ2', have: true, kind: 'cond' },
    { k: null, name: 'みりん', qty: '大さじ2', have: true, kind: 'cond' },
    { k: null, name: '砂糖', qty: '小さじ1', have: false, kind: 'cond' },
  ],
  steps: [
    '玉ねぎは薄切り、生姜はすりおろす。豚バラ肉はひと口大に切る。',
    '醤油・みりん・砂糖・生姜を混ぜて、たれを作っておく。',
    'フライパンに油を熱し、豚肉を中火で焼く。色が変わったら玉ねぎを加える。',
    '玉ねぎがしんなりしたら、たれを回し入れて全体に絡める。',
  ],
};

function CamPill({ children, active = false, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 19,
      background: active ? T.surface : 'rgba(255,255,255,0.16)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: active ? T.terracotta : T.surface, fontFamily: FONT.serif, fontSize: 22,
      cursor: 'pointer',
    }}>{children}</div>
  );
}

export default function ScreenDetail({
  navigate,
  selectedRecipe,
  savedRecipes = [],
  onToggleFavorite,
}) {
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const recipe = selectedRecipe ?? DEFAULT_RECIPE;
  const title = recipe.title ?? DEFAULT_RECIPE.title;
  const description = recipe.description ?? DEFAULT_RECIPE.description;
  const ingredients = recipe.ingredients?.length ? recipe.ingredients : DEFAULT_RECIPE.ingredients;
  const steps = recipe.steps?.length ? recipe.steps : DEFAULT_RECIPE.steps;
  const missing = ingredients.find((it) => it.have === false);
  const imageUrl = recipe.imageUrl ?? null;
  const dishImage = getDishImage(recipe);

  const normalizeRecipeName = (s = '') => s.replace(/\s+/g, '').trim();
  const matchedPattern = recipePatterns.find(
    p => normalizeRecipeName(p.name) === normalizeRecipeName(title),
  );
  const amountsSource = (recipe.amounts && Object.keys(recipe.amounts).length > 0)
    ? recipe.amounts
    : (matchedPattern?.amounts && Object.keys(matchedPattern.amounts).length > 0)
      ? matchedPattern.amounts
      : null;
  const amountsEntries = amountsSource ? Object.entries(amountsSource) : [];
  const hasAmounts = amountsEntries.length > 0;
  const servings = recipe.servings ?? matchedPattern?.servings ?? null;
  const normalizeTitle = (value = '') => value.replace(/\s+/g, '').trim();
  const isFavorite = savedRecipes.some((item) => (
    normalizeTitle(item.title) === normalizeTitle(title) && item.favoritedAt
  ));

  const handleFavorite = () => {
    if (!onToggleFavorite) return;

    onToggleFavorite(recipe);
    setFavoriteMessage(isFavorite ? 'お気に入りを解除しました' : 'レシピ帳に保存しました');
    window.setTimeout(() => setFavoriteMessage(''), 1600);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: T.bg }}>
      {/* 画像生成ができたら最上部に表示する */}
      <div style={{
        height: 290, position: 'relative',
        background: `linear-gradient(135deg, ${T.amberTint} 0%, ${T.terracottaTint} 100%)`,
        backgroundImage: `${PAPER_NOISE}, repeating-linear-gradient(45deg, ${T.amberTint} 0 14px, ${T.amberTint} 14px 28px)`,
      }}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title.replace(/\n/g, '')}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(42,31,20,0.32) 100%)',
        }} />

        {/* トップコントロール */}
        <div style={{
          position: 'absolute', top: 60, left: 22, right: 22,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <CamPill onClick={() => navigate('recipes')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </CamPill>
          <div style={{ display: 'flex', gap: 8 }}>
            <CamPill>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a1 1 0 001 1h14a1 1 0 001-1v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </CamPill>
            <CamPill active={isFavorite} onClick={handleFavorite}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.5-2.5 3-4.5 3-7 0-2.5-2-4-4.5-4S13 5 12 7c-1-2-3-4-5.5-4S2 4.5 2 7c0 2.5 1.5 4.5 3 7l7 7 7-7z" />
              </svg>
            </CamPill>
          </div>
        </div>

        <div style={{
          position: 'absolute', left: 24, right: 24, bottom: 34,
          fontFamily: FONT.serif, fontSize: 30, fontWeight: 600,
          color: T.surface, lineHeight: 1.35, whiteSpace: 'pre-line',
          textShadow: '0 2px 16px rgba(42,31,20,0.45)',
        }}>{title}</div>
      </div>

      {/* プルアップシート */}
      <div style={{
        position: 'absolute', top: 260, left: 0, right: 0, bottom: 0,
        background: T.surface,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '22px 22px 0',
        overflowY: 'auto',
        boxShadow: '0 -20px 40px -22px rgba(42,31,20,0.3)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.line, margin: '0 auto 14px' }} />

        {/* タグ行 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <Tag tone="terracotta">＼ AIおすすめ ／</Tag>
          <Tag tone="sage">節約レシピ</Tag>
          <Tag tone="amber">時短</Tag>
        </div>

        {/* タイトル */}
        <div style={{
          fontFamily: FONT.serif, fontSize: 26, fontWeight: 600, color: T.ink,
          lineHeight: 1.35, whiteSpace: 'pre-line',
        }}>
          {title}
          <HandUnderline width={84} color={T.terracotta} style={{ display: 'block', marginTop: -2 }} />
        </div>

        <div style={{
          fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft,
          marginTop: 10, lineHeight: 1.7,
        }}>
          {description}
        </div>

        {/* 統計グリッド */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          margin: '18px 0',
          padding: '14px 16px',
          background: T.bg, borderRadius: 16,
          border: `1px solid ${T.lineSoft}`,
        }}>
          {[
            { label: 'じかん', value: recipe.time ?? DEFAULT_RECIPE.time, unit: '分' },
            { label: '人ぶん', value: servings ?? 2, unit: '人' },
            { label: 'コスト', value: `¥${recipe.yen ?? DEFAULT_RECIPE.yen}`, unit: '/人' },
            { label: 'カロリー', value: recipe.kcal ?? DEFAULT_RECIPE.kcal, unit: 'kcal' },
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

        {/* 材料 */}
        <SectionHeader num="01" title="ざいりょう" sub={servings ? `${servings}人ぶん` : '2人ぶん'} />
        <div style={{ marginTop: 14 }}>
          {hasAmounts ? (
            amountsEntries.map(([name, qty], i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: `1px dotted ${T.line}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: T.bgWarm, color: T.inkMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT.serif, fontSize: 11,
                }}>量</div>
                <div style={{ flex: 1, fontFamily: FONT.serif, fontSize: 14, color: T.ink }}>{name}</div>
                <div style={{ fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft }}>{qty}</div>
              </div>
            ))
          ) : (
            ingredients.map((it, i) => (
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
                      <path d="M5 13l4 4L19 7" />
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
            ))
          )}
        </div>

        {!hasAmounts && missing && (
          <div style={{
            marginTop: 14, padding: '12px 14px',
            background: T.amberTint, borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14, background: T.amber, color: T.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT.serif, fontSize: 14, fontWeight: 700,
            }}>!</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 13, fontWeight: 600, color: '#7A4F12' }}>
                {missing.name}が足りないかも
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: 11, color: '#7A4F12', opacity: 0.75, marginTop: 1 }}>
                買い物リストに追加する
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A4F12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        )}

        {/* 手順 */}
        <div style={{ marginTop: 28 }}>
          <SectionHeader num="02" title="つくりかた" sub={`${steps.length}ステップ`} />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((s, i) => (
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

      {favoriteMessage && (
        <div style={{
          position: 'absolute',
          left: 22,
          right: 22,
          bottom: 104,
          zIndex: 20,
          padding: '11px 14px',
          borderRadius: 16,
          background: T.ink,
          color: T.surface,
          fontFamily: FONT.sans,
          fontSize: 12,
          fontWeight: 700,
          textAlign: 'center',
          boxShadow: '0 12px 24px -16px rgba(42,31,20,0.65)',
        }}>
          {favoriteMessage}
        </div>
      )}

      {/* ボトムアクションバー */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 22px 40px',
        background: T.surface,
        borderTop: `1px solid ${T.lineSoft}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button
          type="button"
          aria-label={isFavorite ? 'お気に入りを解除' : 'お気に入りに追加'}
          style={{
          width: 50, height: 50, borderRadius: 25,
          background: isFavorite ? T.terracottaTint : T.bg,
          border: `1px solid ${isFavorite ? T.terracotta : T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }} onClick={handleFavorite}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? T.terracotta : 'none'}
            stroke={T.terracotta}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.5-2.5 3-4.5 3-7 0-2.5-2-4-4.5-4S13 5 12 7c-1-2-3-4-5.5-4S2 4.5 2 7c0 2.5 1.5 4.5 3 7l7 7 7-7z" />
          </svg>
        </button>
        <Btn kind="accent" style={{ flex: 1 }}
          onClick={() => navigate('cooking')}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 5v14l11-7-11-7z" />
            </svg>
          }
        >料理をはじめる</Btn>
      </div>
    </div>
  );
}
