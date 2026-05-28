import { useState, useEffect } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Tag from '../components/Tag';
import NavBack from '../components/NavBack';
import { fetchAllProfiles, upsertProfile } from '../lib/supabase';

const PLANS = [
  { key: 'free',   label: '無料',     tone: 'sage' },
  { key: 'tester', label: 'テスター', tone: 'amber' },
  { key: 'paid',   label: '有料',     tone: 'terracotta' },
];

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
};

export default function ScreenAdmin({ navigate }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchAllProfiles()
      .then(setProfiles)
      .catch(() => setError('ユーザー一覧の取得に失敗しました'))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePlan = async (userId, plan) => {
    setUpdating(userId);
    try {
      await upsertProfile(userId, { plan });
      setProfiles((current) =>
        current.map((p) => (p.user_id === userId ? { ...p, plan } : p))
      );
    } catch {
      // 失敗時はなにもしない（表示は元のまま）
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 40 }}>

        {/* ヘッダー */}
        <div style={{
          padding: '56px 22px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <NavBack onClick={() => navigate('profile')} />
          <div>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted, letterSpacing: '0.2em' }}>
              管理者専用
            </div>
            <div style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 600, color: T.ink }}>
              ユーザー管理
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 22px 0' }}>

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              fontFamily: FONT.sans,
              fontSize: 13,
              color: T.inkMuted,
            }}>
              読み込み中…
            </div>
          )}

          {error && (
            <div style={{
              background: T.terracottaTint,
              borderRadius: 14,
              padding: '14px 16px',
              fontFamily: FONT.sans,
              fontSize: 13,
              color: T.terracottaDeep,
            }}>
              {error}
            </div>
          )}

          {!loading && !error && profiles.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              fontFamily: FONT.sans,
              fontSize: 13,
              color: T.inkMuted,
            }}>
              登録ユーザーなし
            </div>
          )}

          {profiles.map((user) => {
            const currentPlan = PLANS.find((p) => p.key === user.plan) ?? PLANS[0];
            const isUpdating = updating === user.user_id;

            return (
              <div
                key={user.user_id}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.line}`,
                  borderRadius: 18,
                  padding: '14px 16px',
                  marginBottom: 10,
                  boxShadow: '0 6px 14px -12px rgba(42,31,20,0.3)',
                  opacity: isUpdating ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {/* ユーザー情報 + 現在のプラン */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontFamily: FONT.serif,
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.ink,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user.display_name || '名前未設定'}
                    </div>
                    <div style={{
                      fontFamily: FONT.sans,
                      fontSize: 11,
                      color: T.inkMuted,
                      marginTop: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user.email || user.user_id}
                    </div>
                  </div>
                  <Tag tone={currentPlan.tone}>{currentPlan.label}</Tag>
                </div>

                {/* プラン変更ボタン */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {PLANS.map((plan) => {
                    const isActive = user.plan === plan.key;
                    return (
                      <button
                        key={plan.key}
                        disabled={isActive || isUpdating}
                        onClick={() => handleChangePlan(user.user_id, plan.key)}
                        style={{
                          flex: 1,
                          height: 34,
                          borderRadius: 10,
                          border: `1px solid ${isActive ? T.terracotta : T.line}`,
                          background: isActive ? T.terracottaTint : T.bg,
                          color: isActive ? T.terracottaDeep : T.inkSoft,
                          fontFamily: FONT.sans,
                          fontSize: 12,
                          fontWeight: isActive ? 700 : 400,
                          cursor: isActive || isUpdating ? 'default' : 'pointer',
                        }}
                      >
                        {plan.label}
                      </button>
                    );
                  })}
                </div>

                {/* 登録日 */}
                <div style={{
                  fontFamily: FONT.sans,
                  fontSize: 10,
                  color: T.inkMuted,
                  marginTop: 8,
                }}>
                  登録: {formatDate(user.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Paper>
  );
}
