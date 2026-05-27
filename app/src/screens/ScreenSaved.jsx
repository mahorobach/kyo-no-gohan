import { useState } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Tag from '../components/Tag';
import TabBar from '../components/TabBar';
import Btn from '../components/Btn';

const FILTERS = [
  { key: 'all', label: 'すべて' },
  { key: 'easy', label: 'かんたん' },
  { key: 'normal', label: 'ふつう' },
];

const stripeColors = [T.amberTint, T.terracottaTint, T.sageTint];

const formatSavedDate = (dateText) => {
  if (!dateText) return '保存済み';
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return '保存済み';

  const now = new Date();
  const isToday = date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();

  if (isToday) return '今日';
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const filterRecipes = (recipes, activeFilter) => {
  if (activeFilter === 'easy') {
    return recipes.filter((recipe) => recipe.diff === 'かんたん');
  }
  if (activeFilter === 'normal') {
    return recipes.filter((recipe) => recipe.diff === 'ふつう');
  }
  return recipes;
};

export default function ScreenSaved({
  navigate,
  savedRecipes = [],
  onSelectRecipe,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const filteredRecipes = filterRecipes(savedRecipes, activeFilter);

  const handleTab = (tab) => {
    if (tab === 'home') navigate('home');
    if (tab === 'fridge') navigate('textInput');
    if (tab === 'me') navigate('profile');
  };

  const handleSelectRecipe = (recipe) => {
    if (onSelectRecipe) {
      onSelectRecipe(recipe);
    } else {
      navigate('detail');
    }
  };

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{
        padding: '60px 22px 0',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.2em' }}>
            レシピ帳
          </div>
          <div style={{ fontFamily: FONT.serif, fontSize: 26, fontWeight: 600, color: T.ink, marginTop: 4 }}>
            また作りたいレシピ
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 19,
          background: T.terracottaTint,
          color: T.terracottaDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT.mono,
          fontSize: 12,
          fontWeight: 700,
        }}>
          {savedRecipes.length}
        </div>
      </div>

      <div style={{ padding: '16px 22px 0', display: 'flex', gap: 6, overflow: 'auto' }}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = filterRecipes(savedRecipes, filter.key).length;
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              style={{
                padding: '7px 12px',
                borderRadius: 999,
                background: isActive ? T.ink : T.surface,
                color: isActive ? T.surface : T.ink,
                border: `1px solid ${isActive ? T.ink : T.line}`,
                fontFamily: FONT.sans,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              {filter.label}
              <span style={{ opacity: 0.6, fontSize: 10 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{
        padding: '20px 22px 90px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflowY: 'auto',
        maxHeight: 'calc(100% - 200px)',
      }}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <div key={`${recipe.title}-${recipe.savedAt ?? index}`} onClick={() => handleSelectRecipe(recipe)} style={{
              background: T.surface,
              borderRadius: 18,
              border: `1px solid ${T.line}`,
              overflow: 'hidden',
              display: 'flex',
              boxShadow: '0 6px 14px -12px rgba(42,31,20,0.3)',
              cursor: 'pointer',
              flexShrink: 0,
            }}>
              <div style={{
                width: 88,
                flexShrink: 0,
                background: `repeating-linear-gradient(${30 + index * 22}deg, ${stripeColors[index % stripeColors.length]} 0 8px, ${T.surface} 8px 16px)`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: T.surface,
                  color: T.ink,
                  fontFamily: FONT.mono,
                  fontSize: 9,
                  padding: '2px 5px',
                  borderRadius: 3,
                  letterSpacing: '0.06em',
                }}>
                  {formatSavedDate(recipe.lastCompletedAt ?? recipe.savedAt)}
                </div>
              </div>
              <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  {recipe.title}
                </div>
                {recipe.description && (
                  <div style={{
                    fontFamily: FONT.sans,
                    fontSize: 11,
                    color: T.inkSoft,
                    lineHeight: 1.6,
                    marginTop: 6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {recipe.description}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
                  <Tag tone={recipe.tone ?? 'sage'}>
                    {recipe.completedCount ? `${recipe.completedCount}回つくった` : 'お気に入り'}
                  </Tag>
                  <span style={{ fontFamily: FONT.mono, fontSize: 11, color: T.terracottaDeep }}>
                    {recipe.time ?? '--'}分
                  </span>
                  <span style={{ marginLeft: 'auto', color: T.terracotta }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 3h12v18l-6-4-6 4V3z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            background: T.surface,
            border: `1px dashed ${T.line}`,
            borderRadius: 20,
            padding: '28px 18px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 18, color: T.ink, fontWeight: 600 }}>
              まだレシピ帳は空です
            </div>
            <div style={{
              fontFamily: FONT.sans,
              fontSize: 12,
              color: T.inkSoft,
              lineHeight: 1.7,
              marginTop: 8,
            }}>
              料理を最後まで作ると、ここに自動で残ります。
            </div>
            <Btn kind="accent" style={{ marginTop: 16, height: 44, fontSize: 13 }} onClick={() => navigate('home')}>
              今日の候補を作る
            </Btn>
          </div>
        )}
      </div>

      <TabBar active="saved" onTab={handleTab} />
    </Paper>
  );
}
