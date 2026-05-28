// パスワード再設定画面（リセットメールのリンクをタップ後に表示）
import { useState } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Logo from '../components/Logo';
import Btn from '../components/Btn';
import useAuth from '../contexts/useAuth';

const inputStyle = {
  width: '100%',
  height: 48,
  borderRadius: 12,
  border: `1.5px solid ${T.line}`,
  background: T.surface,
  padding: '0 14px',
  fontFamily: FONT.sans,
  fontSize: 15,
  color: T.ink,
  outline: 'none',
  boxSizing: 'border-box',
};

// Supabase エラーを日本語化
function toJapaneseError(msg = '') {
  if (msg.includes('Password should be at least')) return 'パスワードは6文字以上にしてください';
  if (msg.includes('New password should be different')) return '現在と異なるパスワードを入力してください';
  return 'エラーが発生しました。もう一度お試しください';
}

export default function ScreenPasswordReset() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirm) {
      setError('パスワードを入力してください');
      return;
    }
    if (password !== confirm) {
      setError('パスワードが一致しません');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上にしてください');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(toJapaneseError(err?.message));
      setLoading(false);
    }
  };

  // 更新完了画面
  if (done) {
    return (
      <Paper color={T.bg} style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', gap: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, lineHeight: 1 }}>&#10004;&#65039;</div>
        <div style={{
          fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: T.ink,
        }}>
          パスワードを更新しました
        </div>
        <div style={{
          fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft, lineHeight: 1.8,
        }}>
          新しいパスワードでログインできます。
        </div>
      </Paper>
    );
  }

  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 460,
        padding: '24px 28px 40px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* ヘッダー */}
        <Logo size={20} />

        <div style={{ marginTop: 28 }}>
          <div style={{
            fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: T.ink, lineHeight: 1.4,
          }}>
            新しいパスワードを<br />設定してください
          </div>
          <div style={{
            fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted, marginTop: 8, lineHeight: 1.7,
          }}>
            6文字以上のパスワードを入力してください。
          </div>
        </div>

        {/* 入力フィールド */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="password"
            placeholder="新しいパスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="パスワード（確認）"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
            autoComplete="new-password"
          />
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div style={{
            marginTop: 10, padding: '10px 14px', borderRadius: 10,
            background: T.terracottaTint,
            fontFamily: FONT.sans, fontSize: 12, color: T.terracottaDeep,
            lineHeight: 1.6,
          }}>
            {error}
          </div>
        )}

        {/* 送信ボタン */}
        <div style={{ marginTop: 'auto' }}>
          <Btn kind="accent" full onClick={handleSubmit} disabled={loading}>
            {loading ? '更新中…' : 'パスワードを更新する'}
          </Btn>
        </div>
      </div>
    </Paper>
  );
}
