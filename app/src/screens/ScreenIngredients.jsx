import { useState } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Eyebrow from '../components/Eyebrow';
import Btn from '../components/Btn';
import Tag from '../components/Tag';
import Veggie from '../components/Veggie';
import NavBack from '../components/NavBack';

export default function ScreenIngredients({
  navigate,
  detectedIngredients = [],
  photoCount = 0,
  onChangeDetectedIngredients,
  onGenerateRecipes,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [addInput, setAddInput] = useState('');
  const items = detectedIngredients;

  const updateItems = (updater) => {
    const nextItems = typeof updater === 'function' ? updater(items) : updater;
    if (onChangeDetectedIngredients) {
      onChangeDetectedIngredients(nextItems);
    }
  };

  const removeItem = (name) => {
    updateItems(prev => prev.filter(i => i.name !== name));
  };

  const addItem = () => {
    const name = addInput.trim();
    if (!name || items.find(i => i.name === name)) return;
    updateItems(prev => [...prev, { k: null, name, qty: '', conf: null }]);
    setAddInput('');
    setShowAdd(false);
  };

  const handleGenerate = () => {
    if (onGenerateRecipes) {
      onGenerateRecipes(items.map(i => ({ name: i.name, k: i.k })), 'photo');
    } else {
      navigate('recipes');
    }
  };

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* ナビゲーション */}
      <div style={{
        padding: '60px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NavBack onClick={() => navigate('camera')} />
        <div style={{ fontFamily: FONT.serif, fontSize: 14, color: T.inkMuted }}>2 / 4</div>
        <div onClick={() => navigate('recipes')} style={{
          fontFamily: FONT.sans, fontSize: 12, color: T.terracotta, fontWeight: 600,
          cursor: 'pointer',
        }}>スキップ</div>
      </div>

      {/* タイトル */}
      <div style={{ padding: '20px 22px 0' }}>
        <Eyebrow>ステップ 2</Eyebrow>
        <div style={{
          fontFamily: FONT.serif, fontSize: 26, fontWeight: 600, color: T.ink,
          lineHeight: 1.35, marginTop: 10,
        }}>これで合ってる？</div>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft, marginTop: 6 }}>
          見落としや、間違えがあったら直してね
        </div>
      </div>

      {/* 撮影サムネイル */}
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
            選んだ写真
          </div>
          <div style={{ fontFamily: FONT.serif, fontSize: 15, color: T.ink, marginTop: 2 }}>
            {photoCount || 1} 枚から {items.length} つの食材を検出
          </div>
        </div>
        <span onClick={() => navigate('camera')} style={{
          fontFamily: FONT.sans, fontSize: 12, color: T.terracotta, fontWeight: 600,
          padding: '8px 12px', border: `1.5px solid ${T.terracotta}`, borderRadius: 999,
          cursor: 'pointer',
        }}>写真を追加</span>
      </div>

      {/* 食材リスト */}
      <div style={{ padding: '18px 22px 120px', overflowY: 'auto', maxHeight: 'calc(100% - 280px)' }}>
        <div style={{
          background: T.surface, borderRadius: 18,
          border: `1px solid ${T.line}`,
          overflow: 'hidden',
        }}>
          {items.map((it, i) => (
            <div key={it.name} style={{
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
                {it.qty && (
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, marginTop: 2 }}>
                    {it.qty}{it.conf != null ? ` ・ 信頼度 ${it.conf}%` : ''}
                  </div>
                )}
              </div>
              <div onClick={() => removeItem(it.name)} style={{
                width: 28, height: 28, borderRadius: 14,
                background: T.bgWarm,
                border: `1px solid ${T.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.inkMuted,
                cursor: 'pointer',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* 手動追加 */}
        {showAdd ? (
          <div style={{
            marginTop: 10, padding: '12px 14px',
            border: `1.5px solid ${T.terracotta}`, borderRadius: 18,
            background: T.surface,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: `0 0 0 4px ${T.terracotta}1A`,
          }}>
            <input
              autoFocus
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addItem(); if (e.key === 'Escape') setShowAdd(false); }}
              placeholder="食材名を入力"
              style={{
                flex: 1,
                fontFamily: FONT.serif, fontSize: 14, color: T.ink,
                border: 'none', outline: 'none', background: 'transparent',
              }}
            />
            <div onClick={addItem} style={{
              padding: '5px 14px', borderRadius: 999,
              background: T.terracotta, color: T.surface,
              fontFamily: FONT.sans, fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
            }}>追加</div>
            <div onClick={() => { setShowAdd(false); setAddInput(''); }} style={{
              color: T.inkMuted, cursor: 'pointer', padding: '4px',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </div>
          </div>
        ) : (
          <div onClick={() => setShowAdd(true)} style={{
            marginTop: 10, padding: '12px 14px',
            border: `1.5px dashed ${T.line}`, borderRadius: 18,
            display: 'flex', alignItems: 'center', gap: 10,
            color: T.inkSoft, cursor: 'pointer',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500 }}>
              足りないものを追加する
            </span>
          </div>
        )}
      </div>

      {/* ボトムCTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 40px',
        background: `linear-gradient(180deg, ${T.bg}00 0%, ${T.bg} 30%)`,
      }}>
        <Btn kind="accent" full onClick={handleGenerate}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.5 7 7.5.5-5.5 5 1.5 7.5L12 18l-6 4 1.5-7.5L2 9.5 9.5 9 12 2z" />
            </svg>
          }
        >レシピを提案してもらう（{items.length}品）</Btn>
      </div>
    </Paper>
  );
}
