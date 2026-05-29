import { useState, useEffect } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import NavBack from '../components/NavBack';
import { fetchAllProfiles, setProfileAdmin, updateProfilePlan } from '../lib/supabase';

const USER_TYPES = [
  { key: 'free', label: '無料', background: T.sageTint, color: T.sageDeep },
  { key: 'paid', label: '有料', background: T.terracottaTint, color: T.terracottaDeep },
  { key: 'tester', label: 'テスター', background: T.amberTint, color: '#7A4F12' },
  { key: 'admin', label: '管理者', background: T.amberTint, color: '#7A4F12' },
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
      .catch((fetchError) => {
        console.error('ユーザー一覧取得エラー', fetchError);
        setError(`ユーザー一覧の取得に失敗しました: ${fetchError.message ?? '詳細不明'}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const getUserType = (profile) => {
    if (profile.is_admin) return 'admin';
    return USER_TYPES.some((type) => type.key === profile.plan) ? profile.plan : 'free';
  };

  const handleChangeUserType = async (profile, nextType) => {
    const userId = profile.user_id;
    const currentType = getUserType(profile);
    if (nextType === currentType) return;

    setUpdating(userId);
    setError(null);
    try {
      if (nextType === 'admin') {
        await setProfileAdmin(userId, true);
      } else {
        if (profile.is_admin) {
          await setProfileAdmin(userId, false);
        }
        await updateProfilePlan(userId, nextType);
      }

      setProfiles((current) =>
        current.map((p) => (
          p.user_id === userId
            ? {
              ...p,
              plan: nextType === 'admin' ? p.plan : nextType,
              is_admin: nextType === 'admin',
            }
            : p
        ))
      );
    } catch (updateError) {
      console.error('ユーザー種類変更エラー', updateError);
      setError(`ユーザー種類の変更に失敗しました: ${updateError.message ?? '詳細不明'}`);
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
            const isUpdating = updating === user.user_id;
            const currentType = getUserType(user);
            const selectedType = USER_TYPES.find((type) => type.key === currentType) ?? USER_TYPES[0];

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
                {/* ユーザー情報 + ユーザー種類 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
                  <select
                    value={currentType}
                    disabled={isUpdating}
                    onChange={(event) => handleChangeUserType(user, event.target.value)}
                    style={{
                      width: 116,
                      height: 38,
                      borderRadius: 999,
                      border: `1px solid ${T.line}`,
                      background: selectedType.background,
                      color: selectedType.color,
                      fontFamily: FONT.sans,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: isUpdating ? 'default' : 'pointer',
                      padding: '0 12px',
                      outline: 'none',
                    }}
                  >
                    {USER_TYPES.map((type) => (
                      <option key={type.key} value={type.key}>
                        {type.label}
                      </option>
                    ))}
                  </select>
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
