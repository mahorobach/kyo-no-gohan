// ログイン画面
import { useState } from 'react';
import { T, FONT } from '../tokens';
import { useAuth } from '../contexts/AuthContext';

export default function ScreenLogin() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError('ログインに失敗しました。もう一度お試しください。');
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: T.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 32px',
    }}>
      {/* ロゴ・タイトル */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${T.amberTint} 0%, ${T.terracottaTint} 100%)`,
          border: `1px solid ${T.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 36,
        }}>
          🥢
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
          <div style={{
            fontFamily: FONT.serif,
            fontSize: 28,
            fontWeight: 600,
            color: T.ink,
            letterSpacing: '0.04em',
          }}>
            きょうのごはん
          </div>
          {/* ヘルシーバッジ */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: T.sageTint,
            color: T.sageDeep,
            borderRadius: 999,
            padding: '3px 10px',
            fontFamily: FONT.sans,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            border: `1px solid ${T.sage}44`,
          }}>
            🌿 Healthy
          </div>
        </div>
        <div style={{
          fontFamily: FONT.sans,
          fontSize: 13,
          color: T.inkMuted,
          marginTop: 10,
          lineHeight: 1.7,
        }}>
          冷蔵庫から、からだにやさしい一皿を。
        </div>
      </div>

      {/* ログインボタン */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: 52,
            borderRadius: 16,
            background: T.surface,
            border: `1.5px solid ${T.line}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontFamily: FONT.sans,
            fontSize: 15,
            fontWeight: 600,
            color: T.ink,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 2px 8px -4px rgba(42,31,20,0.2)',
            transition: 'opacity 0.15s',
          }}
        >
          {/* Google アイコン */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'ログイン中…' : 'Google でログイン'}
        </button>

        {error && (
          <div style={{
            marginTop: 16,
            padding: '10px 14px',
            borderRadius: 10,
            background: T.terracottaTint,
            fontFamily: FONT.sans,
            fontSize: 12,
            color: T.terracottaDeep,
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* 注記 */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        fontFamily: FONT.sans,
        fontSize: 11,
        color: T.inkFaint,
        textAlign: 'center',
        lineHeight: 1.7,
        padding: '0 32px',
      }}>
        ログインすることでデータがクラウドに<br />保存され、複数デバイスで使えます
      </div>
    </div>
  );
}
