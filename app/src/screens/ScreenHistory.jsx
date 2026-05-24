import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Tag from '../components/Tag';
import NavBack from '../components/NavBack';
import TabBar from '../components/TabBar';

const toneByIndex = ['amber', 'sage', 'terracotta'];

function HistoryCard({ recipe, index, onClick }) {
  const tone = recipe.tone ?? toneByIndex[index % toneByIndex.length];

  return (
    <div
      onClick={onClick}
      style={{
        background: T.surface,
        borderRadius: 18,
        border: `1px solid ${T.line}`,
        padding: '14px 16px',
        boxShadow: '0 8px 18px -14px rgba(42,31,20,0.3)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          background: T.ink,
          color: T.surface,
          fontFamily: FONT.mono,
          fontSize: 13,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {index + 1}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT.serif,
            fontSize: 17,
            fontWeight: 600,
            color: T.ink,
            lineHeight: 1.4,
            whiteSpace: 'pre-line',
          }}>
            {recipe.title}
          </div>
          {recipe.description && (
            <div style={{
              fontFamily: FONT.sans,
              fontSize: 12,
              color: T.inkSoft,
              lineHeight: 1.65,
              marginTop: 7,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {recipe.description}
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        paddingTop: 10,
        borderTop: `1px dotted ${T.line}`,
      }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 12, color: T.terracottaDeep }}>
          {recipe.time ?? '--'}分
        </span>
        <span style={{ width: 3, height: 3, borderRadius: 2, background: T.line }} />
        <span style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>
          {recipe.kcal ?? '--'}kcal
        </span>
        <Tag tone={tone} style={{ marginLeft: 'auto' }}>{recipe.diff ?? 'レシピ'}</Tag>
      </div>
    </div>
  );
}

export default function ScreenHistory({
  navigate,
  recentRecipes = [],
  onSelectRecipe,
}) {
  const handleTab = (tab) => {
    if (tab === 'home') navigate('home');
    if (tab === 'fridge') navigate('camera');
    if (tab === 'saved') navigate('saved');
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
        padding: '60px 22px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <NavBack onClick={() => navigate('home')} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, letterSpacing: '0.18em' }}>
            履歴
          </div>
          <div style={{ fontFamily: FONT.serif, fontSize: 17, color: T.ink, fontWeight: 600, marginTop: 3 }}>
            最近の生成
          </div>
        </div>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          background: T.terracottaTint,
          color: T.terracottaDeep,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.mono,
          fontSize: 12,
          fontWeight: 700,
        }}>
          {recentRecipes.length}
        </div>
      </div>

      <div style={{ padding: '14px 22px 0' }}>
        <div style={{
          fontFamily: FONT.serif,
          fontSize: 24,
          fontWeight: 600,
          color: T.ink,
          lineHeight: 1.35,
        }}>
          これまでの候補を<br />
          <span style={{ color: T.terracotta }}>まとめて見る</span>
        </div>
        <div style={{
          fontFamily: FONT.sans,
          fontSize: 12,
          color: T.inkSoft,
          lineHeight: 1.6,
          marginTop: 8,
        }}>
          最近生成したレシピを新しい順に表示しています
        </div>
      </div>

      <div style={{
        padding: '20px 22px 104px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflowY: 'auto',
        maxHeight: 'calc(100% - 190px)',
      }}>
        {recentRecipes.length > 0 ? (
          recentRecipes.map((recipe, index) => (
            <HistoryCard
              key={`${recipe.title}-${recipe.description ?? ''}`}
              recipe={recipe}
              index={index}
              onClick={() => handleSelectRecipe(recipe)}
            />
          ))
        ) : (
          <div style={{
            background: T.surface,
            border: `1px dashed ${T.line}`,
            borderRadius: 18,
            padding: '28px 18px',
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 13,
            color: T.inkSoft,
            lineHeight: 1.7,
          }}>
            まだ生成履歴がありません。<br />
            食材を入力して、今日の候補を作ってみましょう。
          </div>
        )}
      </div>

      <TabBar active="home" onTab={handleTab} />
    </Paper>
  );
}
