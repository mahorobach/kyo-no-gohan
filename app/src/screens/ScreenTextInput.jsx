import { useState } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Eyebrow from '../components/Eyebrow';
import Btn from '../components/Btn';
import Veggie from '../components/Veggie';
import NavBack from '../components/NavBack';

const ALL_INGREDIENTS = [
  { name: 'キャベツ', k: 'cabbage' },
  { name: 'にんじん', k: 'carrot' },
  { name: 'ソイミート', k: 'tofu' },
  { name: '木綿豆腐', k: 'tofu' },
  { name: 'ピーマン', k: 'pepper' },
  { name: '干椎茸', k: 'miso' },
  { name: '生姜', k: 'ginger' },
  { name: 'もやし', k: 'sprouts' },
  { name: 'みそ', k: 'miso' },
  { name: '角麩', k: 'rice' },
  { name: 'なす', k: 'pepper' },
  { name: '緑豆春雨', k: 'sprouts' },
  { name: 'ごはん', k: 'rice' },
  { name: '竹の子', k: 'carrot' },
  { name: 'ごぼう', k: 'carrot' },
];

const CONDITIONS = ['おまかせ', '時短', '節約', 'がっつり', 'やさしい味', '汁物', 'お弁当'];
const MAX_SELECTED_CONDITIONS = 2;

export default function ScreenTextInput({
  navigate,
  ingredients = [],
  generationStatus,
  onGenerateRecipes,
}) {
  const ingredientsKey = ingredients.map((item) => item.name).join('|');
  const [draft, setDraft] = useState({ ingredientsKey, entered: ingredients });
  const [inputValue, setInputValue] = useState('');
  const [selectedConditions, setSelectedConditions] = useState(['おまかせ']);
  let entered = draft.entered;

  if (draft.ingredientsKey !== ingredientsKey) {
    entered = ingredients;
    setDraft({ ingredientsKey, entered: ingredients });
  }

  const setEntered = (updater) => {
    setDraft((current) => ({
      ...current,
      ingredientsKey,
      entered: typeof updater === 'function' ? updater(current.entered) : updater,
    }));
  };

  const suggestions = ALL_INGREDIENTS
    .filter(i => !entered.find(e => e.name === i.name))
    .filter(i => inputValue === '' || i.name.includes(inputValue))
    .slice(0, 4);

  const canAddCustom = inputValue.trim() !== '' && !entered.find(e => e.name === inputValue.trim());

  const addIngredient = (item) => {
    setEntered(prev => [...prev, { name: item.name, k: item.k }]);
    setInputValue('');
  };

  const addCustom = () => {
    const name = inputValue.trim();
    if (!name) return;
    setEntered(prev => [...prev, { name, k: null }]);
    setInputValue('');
  };

  const removeIngredient = (name) => {
    setEntered(prev => prev.filter(e => e.name !== name));
  };

  const toggleCondition = (condition) => {
    setSelectedConditions((current) => {
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

  const selectedConditionLabel = selectedConditions.join('・');
  const reachedLimit = generationStatus && generationStatus.remaining <= 0;

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* スクロール可能なコンテンツエリア */}
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 130 }}>

        {/* ナビゲーション */}
        <div style={{
          padding: '60px 22px 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <NavBack onClick={() => navigate('home')} />
          <div style={{ fontFamily: FONT.serif, fontSize: 15, color: T.ink, fontWeight: 600 }}>
            食材を入力
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 19, background: T.terracotta,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22M1 12h22" />
            </svg>
          </div>
        </div>

        {/* モードタブ */}
        <div style={{
          margin: '12px 22px 0',
          padding: 4, background: T.bgWarm, borderRadius: 12,
          display: 'flex', gap: 4,
        }}>
          {[
            { k: 'photo', label: '写真は準備中', on: false },
            { k: 'text', label: '文字で入力', on: true },
          ].map(t => (
            <div key={t.k} style={{
              flex: 1, padding: '8px 0', borderRadius: 9,
              textAlign: 'center',
              background: t.on ? T.surface : 'transparent',
              color: t.on ? T.ink : T.inkMuted,
              fontFamily: FONT.sans, fontSize: 12, fontWeight: t.on ? 600 : 500,
              boxShadow: t.on ? '0 1px 2px rgba(0,0,0,0.06)' : undefined,
              cursor: t.on ? 'default' : 'not-allowed',
              opacity: t.on ? 1 : 0.7,
            }}>{t.label}</div>
          ))}
        </div>

        {/* ヘルパー */}
        <div style={{ padding: '20px 22px 0' }}>
          <Eyebrow>食材を1つずつ追加</Eyebrow>
          <div style={{
            fontFamily: FONT.serif, fontSize: 18, color: T.ink, fontWeight: 600,
            lineHeight: 1.5, marginTop: 8,
          }}>
            冷蔵庫にあるものを<br />教えてください
          </div>
          {generationStatus && (
            <div style={{
              fontFamily: FONT.sans,
              fontSize: 11,
              color: reachedLimit ? T.terracottaDeep : T.inkMuted,
              lineHeight: 1.6,
              marginTop: 8,
            }}>
              今日の生成 {generationStatus.used} / {generationStatus.limit}回
              {reachedLimit ? '。今日はここまでです。' : `。あと${generationStatus.remaining}回つくれます。`}
            </div>
          )}
        </div>

        {/* 生成条件 */}
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.12em' }}>
              希望に近いもの
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>
              最大2つ
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CONDITIONS.map((condition) => {
              const active = selectedConditions.includes(condition);
              return (
                <button
                  key={condition}
                  onClick={() => toggleCondition(condition)}
                  style={{
                    border: `1px solid ${active ? T.terracotta : T.line}`,
                    background: active ? T.terracottaTint : T.surface,
                    color: active ? T.terracottaDeep : T.ink,
                    borderRadius: 999,
                    padding: '7px 12px',
                    fontFamily: FONT.sans,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {condition}
                </button>
              );
            })}
          </div>
        </div>

        {/* 入力フィールド */}
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{
            background: T.surface, borderRadius: 14,
            border: `1.5px solid ${T.terracotta}`,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: `0 0 0 4px ${T.terracotta}1A`,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.inkSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (suggestions.length > 0) addIngredient(suggestions[0]);
                  else if (canAddCustom) addCustom();
                }
              }}
              placeholder="食材名を入力（例：白菜）"
              inputMode="text"
              enterKeyHint="done"
              style={{
                flex: 1,
                fontFamily: FONT.serif, fontSize: 16, color: T.ink,
                border: 'none', outline: 'none', background: 'transparent',
              }}
            />
            {canAddCustom && suggestions.length === 0 && (
              <div onClick={addCustom} style={{
                padding: '5px 12px', borderRadius: 999,
                background: T.terracotta, color: T.surface,
                fontFamily: FONT.sans, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', flexShrink: 0,
              }}>追加</div>
            )}
          </div>

          {/* 候補ピル */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.12em', marginBottom: 8 }}>
              候補
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {suggestions.map((s, i) => (
                <div key={s.name} onClick={() => addIngredient(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 999,
                  background: i === 0 ? T.terracottaTint : T.surface,
                  border: `1px solid ${i === 0 ? T.terracotta + '55' : T.line}`,
                  fontFamily: FONT.serif, fontSize: 13,
                  color: T.ink,
                  cursor: 'pointer',
                }}>
                  <Veggie kind={s.k} size={22} />
                  <span>{s.name}</span>
                </div>
              ))}
              {canAddCustom && suggestions.length === 0 && (
                <div style={{
                  fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted,
                  padding: '7px 0', alignSelf: 'center',
                }}>
                  「{inputValue.trim()}」— Enterか追加ボタンで登録できます
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 追加した食材 */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Eyebrow color={T.sageDeep}>追加した食材</Eyebrow>
            <span style={{ fontFamily: FONT.mono, fontSize: 11, color: T.sageDeep }}>{entered.length} つ</span>
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
                <div onClick={() => removeIngredient(it.name)} style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: T.bgWarm, color: T.inkMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>{/* /スクロールエリア */}

      {/* CTA */}
      {entered.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 34, left: 22, right: 22,
          zIndex: 10,
        }}>
          <Btn
            kind="accent"
            full
            onClick={() => onGenerateRecipes && onGenerateRecipes(
              entered,
              'text',
              selectedConditions,
            )}
            disabled={reachedLimit}
          >
            {reachedLimit ? '今日の生成回数に達しました' : `${selectedConditionLabel}で2品つくる`}
          </Btn>
        </div>
      )}
    </Paper>
  );
}
