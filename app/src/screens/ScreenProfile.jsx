import { useState } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Tag from '../components/Tag';
import Btn from '../components/Btn';
import TabBar from '../components/TabBar';

function StatCard({ label, value, tone = 'sage' }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.line}`,
      borderRadius: 18,
      padding: '14px 12px',
      minHeight: 86,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 8px 18px -16px rgba(42,31,20,0.35)',
    }}>
      <div style={{
        fontFamily: FONT.sans,
        fontSize: 10,
        color: T.inkMuted,
        letterSpacing: '0.12em',
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{
          fontFamily: FONT.serif,
          fontSize: 26,
          fontWeight: 600,
          color: T.ink,
          lineHeight: 1,
        }}>
          {value}
        </span>
        <Tag tone={tone}>件</Tag>
      </div>
    </div>
  );
}

function SettingRow({ title, description, badge }) {
  return (
    <div style={{
      padding: '14px 0',
      borderBottom: `1px dotted ${T.line}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: FONT.serif,
          fontSize: 15,
          fontWeight: 600,
          color: T.ink,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: FONT.sans,
          fontSize: 11,
          color: T.inkSoft,
          lineHeight: 1.6,
          marginTop: 3,
        }}>
          {description}
        </div>
      </div>
      {badge && <Tag tone="amber">{badge}</Tag>}
    </div>
  );
}

const PLAN_LABELS = { free: '無料', tester: 'テスター', paid: '有料' };
const PLAN_TONES  = { free: 'sage',  tester: 'amber',   paid: 'terracotta' };

export default function ScreenProfile({
  navigate,
  profile = { name: 'さくらこ' },
  savedRecipes = [],
  recentGenerations = [],
  generationStatus,
  completedRecipe,
  isAdmin = false,
  appVersion = '',
  onUpdateProfile,
  onSignOut,
}) {
  const [nameInput, setNameInput] = useState(profile.name);
  const completedCount = savedRecipes.reduce((sum, recipe) => sum + (recipe.completedCount ?? 1), 0);
  const hasTodayCompleted = Boolean(completedRecipe?.completedAt);

  const handleTab = (tab) => {
    if (tab === 'home') navigate('home');
    if (tab === 'fridge') navigate('textInput');
    if (tab === 'saved') navigate('saved');
  };

  const saveProfile = () => {
    const name = nameInput.trim() || 'さくらこ';
    if (onUpdateProfile) {
      onUpdateProfile({ name });
    }
    setNameInput(name);
  };

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 104 }}>
        <div style={{
          padding: '64px 22px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.2em' }}>
              マイページ
            </div>
            <div style={{
              fontFamily: FONT.serif,
              fontSize: 26,
              fontWeight: 600,
              color: T.ink,
              marginTop: 4,
            }}>
              {profile.name}さんの台所
            </div>
          </div>
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                objectFit: 'cover',
                border: `1.5px solid ${T.surface}`,
                boxShadow: `0 0 0 1px ${T.terracotta}33`,
              }}
            />
          ) : (
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: T.terracottaTint,
              color: T.terracottaDeep,
              border: `1.5px solid ${T.surface}`,
              boxShadow: `0 0 0 1px ${T.terracotta}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.serif,
              fontSize: 18,
              fontWeight: 700,
            }}>
              {profile.name.slice(0, 1)}
            </div>
          )}
        </div>

        {/* 管理画面ボタン（管理者のみ表示） */}
        {isAdmin && (
          <div style={{ padding: '16px 22px 0' }}>
            <button
              onClick={() => navigate('admin')}
              style={{
                width: '100%',
                height: 46,
                borderRadius: 16,
                border: `1px solid ${T.terracotta}`,
                background: T.terracottaTint,
                color: T.terracottaDeep,
                fontFamily: FONT.sans,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              管理画面
            </button>
          </div>
        )}

        <div style={{ padding: '22px 22px 0' }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.line}`,
            borderRadius: 22,
            padding: '18px',
            boxShadow: '0 14px 30px -22px rgba(42,31,20,0.35)',
          }}>
            <div style={{
              fontFamily: FONT.serif,
              fontSize: 18,
              color: T.ink,
              fontWeight: 600,
            }}>
              呼び名
            </div>
            <div style={{
              display: 'flex',
              gap: 8,
              marginTop: 12,
            }}>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={saveProfile}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                placeholder="名前"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 44,
                  borderRadius: 14,
                  border: `1.5px solid ${T.line}`,
                  background: T.bg,
                  padding: '0 13px',
                  fontFamily: FONT.serif,
                  fontSize: 16,
                  color: T.ink,
                  outline: 'none',
                }}
              />
              <Btn kind="soft" style={{ height: 44, fontSize: 13, padding: '0 16px' }} onClick={saveProfile}>
                保存
              </Btn>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 22px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCard label="作った料理" value={completedCount} tone="terracotta" />
            <StatCard label="レシピ帳" value={savedRecipes.length} tone="sage" />
            <StatCard label="生成履歴" value={recentGenerations.length} tone="amber" />
            <StatCard label="今日の完成" value={hasTodayCompleted ? 1 : 0} tone="sage" />
          </div>
        </div>

        <div style={{ padding: '16px 22px 0' }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.line}`,
            borderRadius: 22,
            padding: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 18, color: T.ink, fontWeight: 600 }}>
                生成プラン
              </div>
              <Tag tone={PLAN_TONES[generationStatus?.plan] ?? 'sage'}>
                {PLAN_LABELS[generationStatus?.plan] ?? '無料'}
              </Tag>
            </div>
            <div style={{
              fontFamily: FONT.sans,
              fontSize: 11,
              color: T.inkSoft,
              lineHeight: 1.6,
              marginTop: 6,
            }}>
              今日の生成 {generationStatus?.used ?? 0}
              {generationStatus?.plan === 'tester'
                ? ' 回 / 無制限'
                : ` / ${generationStatus?.limit ?? 3}回`}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 22px 0' }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.line}`,
            borderRadius: 22,
            padding: '4px 16px',
          }}>
            <SettingRow
              title="Googleアカウント連携"
              description={`${profile.name} でログイン中。複数デバイスで同期できます。`}
              badge="接続中"
            />
            <SettingRow
              title="写真判定の精度"
              description="複数枚の写真から、検出した食材をあとで編集できます。"
            />
            <SettingRow
              title="保存場所"
              description="今はこのブラウザのlocalStorageに保存しています。"
            />
          </div>
        </div>

        <div style={{ padding: '16px 22px 0' }}>
          <div style={{
            background: T.terracottaTint,
            borderRadius: 18,
            padding: '14px 16px',
            fontFamily: FONT.sans,
            fontSize: 12,
            color: T.terracottaDeep,
            lineHeight: 1.7,
          }}>
            友人レビュー中です。レシピの自然さ、材料の使い方、毎日使いたくなるかを見てもらう段階です。
          </div>
        </div>

        {/* ログアウトボタン */}
        {onSignOut && (
          <div style={{ padding: '16px 22px 8px' }}>
            <Btn
              kind="soft"
              style={{ width: '100%', height: 46, fontSize: 13, color: T.terracottaDeep }}
              onClick={onSignOut}
            >
              ログアウト
            </Btn>
          </div>
        )}

        {appVersion && (
          <div style={{
            padding: '0 22px 18px',
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 10,
            color: T.inkMuted,
            letterSpacing: '0.08em',
          }}>
            version {appVersion}
          </div>
        )}
      </div>

      <TabBar active="me" onTab={handleTab} />
    </Paper>
  );
}
