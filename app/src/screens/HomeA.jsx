import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Eyebrow from '../components/Eyebrow';
import Tag from '../components/Tag';
import YenStamp from '../components/YenStamp';
import Btn from '../components/Btn';
import TabBar from '../components/TabBar';

const isSameDate = (dateText, base = new Date()) => {
  if (!dateText) return false;
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === base.getFullYear()
    && date.getMonth() === base.getMonth()
    && date.getDate() === base.getDate()
  );
};

function HomeGreeting({ name = 'さくらこ' }) {
  const now = new Date();
  const dayNames = ['にちようび', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];
  const monthDay = `${now.getMonth() + 1}月 ${now.getDate()}日`;
  const day = dayNames[now.getDay()];

  return (
    <div style={{
      padding: '70px 22px 0',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.2em' }}>
          {monthDay} ・ {day}
        </div>
        <div style={{
          fontFamily: FONT.serif, fontSize: 24, fontWeight: 600, color: T.ink,
          marginTop: 6, letterSpacing: '0.02em',
        }}>
          こんばんは、<span style={{ color: T.terracotta }}>{name}</span>さん
        </div>
      </div>
      <div style={{
        width: 38, height: 38, borderRadius: 19,
        background: T.terracottaTint, color: T.terracottaDeep,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT.serif, fontSize: 16, fontWeight: 600,
        border: `1.5px solid ${T.surface}`,
        boxShadow: `0 0 0 1px ${T.terracotta}33`,
      }}>桜</div>
    </div>
  );
}

function RecipeHero({ recipe, onClick }) {
  return (
    <div style={{
      marginTop: 12, borderRadius: 24, overflow: 'hidden',
      background: T.surface, border: `1px solid ${T.line}`,
      boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset, 0 14px 30px -20px rgba(42,31,20,0.4)',
      cursor: 'pointer',
    }} onClick={onClick}>
      <div style={{
        minHeight: 124, position: 'relative',
        background: `linear-gradient(135deg, ${T.amberTint} 0%, ${T.terracottaTint} 100%)`,
        display: 'flex', alignItems: 'flex-end', padding: 16,
      }}>
        <Tag tone="ink">＼ 完成したレシピ ／</Tag>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{
          fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: T.ink,
          lineHeight: 1.3, whiteSpace: 'pre-line',
        }}>{recipe.title}</div>
        {recipe.description && (
          <div style={{
            fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft,
            lineHeight: 1.6, marginTop: 8,
          }}>{recipe.description}</div>
        )}
        <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: T.ink }}>{recipe.time ?? 15}</span>
            <span style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>分</span>
          </div>
          <div style={{ width: 1, height: 14, background: T.line }} />
          <YenStamp value={recipe.yen ?? 280} />
          <div style={{ width: 1, height: 14, background: T.line }} />
          <Tag tone={recipe.tone ?? 'sage'}>{recipe.diff ?? 'かんたん'}</Tag>
        </div>
      </div>
    </div>
  );
}

function StartPanel({ ingredients, onGenerate, onEdit }) {
  const hasIngredients = ingredients.length > 0;

  return (
    <div style={{
      marginTop: 12,
      borderRadius: 24,
      background: T.surface,
      border: `1px solid ${T.line}`,
      padding: '18px',
      boxShadow: '0 14px 30px -22px rgba(42,31,20,0.35)',
    }}>
      <div style={{
        fontFamily: FONT.serif,
        fontSize: 22,
        fontWeight: 600,
        color: T.ink,
        lineHeight: 1.35,
      }}>
        {hasIngredients ? '昨日の材料が残っているなら' : '冷蔵庫にあるものから'}
      </div>
      <div style={{
        fontFamily: FONT.sans,
        fontSize: 12,
        color: T.inkSoft,
        lineHeight: 1.7,
        marginTop: 8,
      }}>
        {hasIngredients
          ? '同じ材料で、新しい献立を提案できます。'
          : '文字で食材を入力して、今日の献立を作れます。'}
      </div>

      {hasIngredients && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
          {ingredients.map((item) => (
            <Tag key={item.name} tone="sage">{item.name}</Tag>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {hasIngredients ? (
          <>
            <Btn kind="accent" style={{ flex: 1, height: 44, fontSize: 13 }} onClick={onGenerate}>
              この材料で提案
            </Btn>
            <Btn kind="soft" style={{ flex: 1, height: 44, fontSize: 13 }} onClick={onEdit}>
              材料を編集
            </Btn>
          </>
        ) : (
          <Btn kind="accent" style={{ flex: 1, height: 44, fontSize: 13 }} onClick={() => onEdit('textInput')}>
            食材を入力する
          </Btn>
        )}
      </div>
    </div>
  );
}

function SmallGenerationCard({ generation, onClick }) {
  const recipes = generation.recipes ?? [];
  const title = recipes.map((recipe) => recipe.title).filter(Boolean).join(' / ');
  const label = (generation.conditions ?? ['おまかせ']).join('・');
  const ingredientNames = (generation.ingredients ?? []).map((item) => item.name).slice(0, 3).join('、');

  return (
    <div onClick={onClick} style={{
      width: 112, minHeight: 132, flexShrink: 0,
      background: T.surface, borderRadius: 16,
      border: `1px solid ${T.line}`,
      padding: '12px 10px',
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
    }}>
      <div style={{
        fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted,
        letterSpacing: '0.08em', marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: FONT.serif, fontSize: 14, fontWeight: 600,
        color: T.ink, lineHeight: 1.45, whiteSpace: 'pre-line',
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {title || '生成した献立'}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 11, color: T.terracottaDeep }}>{recipes.length}品</span>
        <span style={{ width: 3, height: 3, borderRadius: 2, background: T.line }} />
        <span style={{
          fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {ingredientNames || '食材'}
        </span>
      </div>
    </div>
  );
}

function AgainCard({ onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 112, minHeight: 132, flexShrink: 0,
      borderRadius: 16,
      border: `1.5px dashed ${T.line}`,
      padding: '12px 10px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', gap: 10,
      color: T.inkSoft,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 17,
        background: T.bgWarm,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: T.terracotta,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5" />
        </svg>
      </div>
      <div style={{ fontFamily: FONT.serif, fontSize: 13, fontWeight: 600, lineHeight: 1.4, textAlign: 'center' }}>
        もう一度<br />提案
      </div>
    </div>
  );
}

export default function HomeA({
  navigate,
  completedRecipe,
  recentGenerations = [],
  ingredients = [],
  generationStatus,
  onGenerateRecipes,
  onSelectRecipe,
  onSelectGeneration,
}) {
  const hasTodayCompleted = isSameDate(completedRecipe?.completedAt);
  const recent = recentGenerations.slice(0, 3);
  const slots = [...recent];

  const handleRecipeClick = (recipe) => {
    if (onSelectRecipe) onSelectRecipe(recipe);
  };

  const handleGenerationClick = (generation) => {
    if (onSelectGeneration) onSelectGeneration(generation);
  };

  const handleGenerateAgain = () => {
    if (ingredients.length && onGenerateRecipes) {
      onGenerateRecipes(ingredients, 'text');
    } else {
      navigate('textInput');
    }
  };

  const handleStartEdit = (to = 'textInput') => {
    navigate(to === 'camera' ? 'textInput' : to);
  };

  const handleTab = (tab) => {
    if (tab === 'saved') navigate('saved');
    if (tab === 'fridge') navigate('textInput');
    if (tab === 'me') navigate('profile');
  };

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 104 }}>
        <HomeGreeting />

        <div style={{ padding: '22px 22px 0' }}>
          <Eyebrow>{hasTodayCompleted ? '今日作った料理' : '今日の候補を作る'}</Eyebrow>
          {hasTodayCompleted ? (
            <RecipeHero recipe={completedRecipe} onClick={() => handleRecipeClick(completedRecipe)} />
          ) : (
            <StartPanel ingredients={ingredients} onGenerate={handleGenerateAgain} onEdit={handleStartEdit} />
          )}
          {generationStatus && (
            <div style={{
              marginTop: 10,
              fontFamily: FONT.sans,
              fontSize: 11,
              color: generationStatus.remaining > 0 ? T.inkMuted : T.terracottaDeep,
              lineHeight: 1.6,
            }}>
              今日の生成 {generationStatus.used} / {generationStatus.limit}回
              {generationStatus.plan === 'free' ? '（無料）' : '（有料）'}
            </div>
          )}
        </div>

        {hasTodayCompleted && ingredients.length > 0 && (
          <>
            <div style={{ padding: '16px 22px 0' }}>
              <Eyebrow color={T.sageDeep}>使った材料</Eyebrow>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {ingredients.map((item) => (
                  <Tag key={item.name} tone="sage">{item.name}</Tag>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Btn kind="accent" style={{ flex: 1, height: 44, fontSize: 13 }} onClick={handleGenerateAgain}>
                  同じ材料で提案
                </Btn>
                <Btn kind="soft" style={{ flex: 1, height: 44, fontSize: 13 }} onClick={() => navigate('textInput')}>
                  材料を編集
                </Btn>
              </div>
            </div>

            <div style={{ padding: '16px 22px 0' }}>
              <Eyebrow color={T.terracotta}>新しく探す</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <Btn kind="primary" style={{ height: 44, fontSize: 13 }} onClick={() => navigate('textInput')}>
                  食材を入力
                </Btn>
                <Btn kind="soft" style={{ height: 44, fontSize: 13 }} onClick={() => navigate('textInput')}>
                  文字で入力
                </Btn>
              </div>
            </div>
          </>
        )}

        <div style={{ padding: '20px 0 0 22px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 22,
          }}>
            <Eyebrow color={T.sageDeep}>最近の生成</Eyebrow>
            {recentGenerations.length > 0 && (
              <button
                onClick={() => navigate('history')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: T.terracottaDeep,
                  fontFamily: FONT.sans,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                全てを見る
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, paddingRight: 22, overflow: 'hidden' }}>
            {slots.map((generation) => (
              <SmallGenerationCard
                key={generation.id}
                generation={generation}
                onClick={() => handleGenerationClick(generation)}
              />
            ))}
            {Array.from({ length: Math.max(0, 3 - slots.length) }).map((_, i) => (
              <AgainCard key={i} onClick={handleGenerateAgain} />
            ))}
          </div>
        </div>
      </div>

      <TabBar active="home" onTab={handleTab} />
    </Paper>
  );
}
