import { useState } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Btn from '../components/Btn';
import NavBack from '../components/NavBack';

const FALLBACK_RECIPE = {
  title: '今日のごはん',
  steps: ['材料を準備する。', '火を通す。', '味をととのえる。', '器に盛る。'],
  ingredients: [],
};

export default function ScreenCooking({ navigate, selectedRecipe, onCompleteRecipe }) {
  const recipe = selectedRecipe ?? FALLBACK_RECIPE;
  const steps = recipe.steps?.length ? recipe.steps : FALLBACK_RECIPE.steps;
  const ingredients = recipe.ingredients ?? [];
  const [stepIndex, setStepIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  const goPrev = () => {
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    if (isLast) {
      if (onCompleteRecipe) {
        onCompleteRecipe(recipe);
      } else {
        navigate('home');
      }
      return;
    }
    setStepIndex((current) => Math.min(steps.length - 1, current + 1));
  };

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{
        padding: '60px 22px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NavBack onClick={() => navigate('detail')} />
        <div style={{
          fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted,
          letterSpacing: '0.1em',
        }}>
          つくる
        </div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: '22px 24px 0' }}>
        <div style={{
          fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: T.ink,
          lineHeight: 1.35, whiteSpace: 'pre-line',
        }}>
          {recipe.title}
        </div>

        <div style={{
          marginTop: 18,
          height: 8,
          borderRadius: 999,
          background: T.bgDeep,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${((stepIndex + 1) / steps.length) * 100}%`,
            height: '100%',
            background: T.terracotta,
            borderRadius: 999,
            transition: 'width 0.2s ease',
          }} />
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginTop: 12,
        }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 13, color: T.terracottaDeep }}>
            STEP {stepIndex + 1} / {steps.length}
          </div>
          <button
            onClick={() => setShowIngredients((current) => !current)}
            style={{
              border: `1px solid ${T.line}`,
              background: T.surface,
              color: T.ink,
              borderRadius: 999,
              padding: '7px 12px',
              fontFamily: FONT.sans,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            材料
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 22px 150px', height: 'calc(100% - 218px)', overflowY: 'auto' }}>
        {showIngredients && (
          <div style={{
            background: T.surface,
            border: `1px solid ${T.line}`,
            borderRadius: 18,
            padding: '14px 16px',
            marginBottom: 14,
          }}>
            <div style={{
              fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted,
              letterSpacing: '0.14em', marginBottom: 8,
            }}>
              ざいりょう
            </div>
            {ingredients.length ? ingredients.map((it, i) => (
              <div key={`${it.name}-${i}`} style={{
                display: 'flex', justifyContent: 'space-between', gap: 12,
                padding: '8px 0',
                borderBottom: i < ingredients.length - 1 ? `1px dotted ${T.line}` : 'none',
                fontFamily: FONT.serif,
                fontSize: 14,
                color: T.ink,
              }}>
                <span>{it.name}</span>
                <span style={{ color: T.inkSoft }}>{it.qty ?? '適量'}</span>
              </div>
            )) : (
              <div style={{ fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft }}>
                材料情報がありません
              </div>
            )}
          </div>
        )}

        <div style={{
          background: T.surface,
          border: `1px solid ${T.line}`,
          borderRadius: 22,
          minHeight: 330,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 14px 30px -22px rgba(42,31,20,0.35)',
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 23,
            background: T.ink,
            color: T.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT.serif, fontSize: 20, fontWeight: 600,
            marginBottom: 24,
          }}>
            {stepIndex + 1}
          </div>
          <div style={{
            fontFamily: FONT.serif,
            fontSize: 24,
            lineHeight: 1.75,
            color: T.ink,
          }}>
            {steps[stepIndex]}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 40px',
        background: `linear-gradient(180deg, ${T.bg}00 0%, ${T.bg} 28%)`,
        display: 'flex', gap: 10,
      }}>
        <Btn kind="soft" style={{ flex: 1 }} onClick={goPrev} disabled={isFirst}>
          前へ
        </Btn>
        <Btn kind="accent" style={{ flex: 1.5 }} onClick={goNext}>
          {isLast ? '完成' : '次へ'}
        </Btn>
      </div>
    </Paper>
  );
}
