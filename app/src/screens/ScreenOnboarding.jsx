import { useState } from 'react';
import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Logo from '../components/Logo';
import Eyebrow from '../components/Eyebrow';
import Btn from '../components/Btn';
import Veggie from '../components/Veggie';
import HandUnderline from '../components/HandUnderline';
import useAuth from '../contexts/useAuth';

function Dotz({ on }) {
  return (
    <div style={{
      width: on ? 24 : 6, height: 6, borderRadius: 3,
      background: on ? T.terracotta : T.line,
    }} />
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

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

// Supabase のエラーメッセージを日本語に変換
function toJapaneseError(msg = '') {
  if (msg.includes('Invalid login credentials')) return 'メールアドレスまたはパスワードが違います';
  if (msg.includes('Email not confirmed')) return 'メールの確認が完了していません。受信箱をご確認ください';
  if (msg.includes('User already registered')) return 'このメールアドレスはすでに登録されています';
  if (msg.includes('Password should be at least')) return 'パスワードは6文字以上にしてください';
  if (msg.includes('Unable to validate email')) return 'メールアドレスの形式が正しくありません';
  if (msg.includes('Supabase の環境変数')) return 'ログイン設定がまだ完了していません。管理者に確認してください';
  return 'エラーが発生しました。もう一度お試しください';
}

// 上部デコレーション（全モード共通）
function TopDecoration() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 360,
      background: `linear-gradient(180deg, ${T.bgWarm} 0%, ${T.bg} 100%)`,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 130, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 200, borderRadius: '50%',
        background: T.surface,
        border: `1.5px solid ${T.line}`,
        boxShadow: '0 14px 30px -16px rgba(42,31,20,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ position: 'relative', width: 130, height: 130 }}>
          <div style={{ position: 'absolute', top: 0, left: 40 }}><Veggie kind="tomato" size={56} /></div>
          <div style={{ position: 'absolute', top: 30, left: 0 }}><Veggie kind="carrot" size={50} /></div>
          <div style={{ position: 'absolute', top: 30, right: 0 }}><Veggie kind="pepper" size={50} /></div>
          <div style={{ position: 'absolute', bottom: 0, left: 14 }}><Veggie kind="onion" size={52} /></div>
          <div style={{ position: 'absolute', bottom: 5, right: 18 }}><Veggie kind="egg" size={46} /></div>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 96, right: 26,
        transform: 'rotate(8deg)',
        background: T.amber, color: T.surface,
        fontFamily: FONT.serif, fontSize: 11, fontWeight: 600,
        padding: '6px 12px', borderRadius: 4,
        letterSpacing: '0.08em',
        boxShadow: '0 8px 18px -8px rgba(216,154,61,0.55)',
      }}>&#65509; はじめまして &#65509;</div>

      <div style={{
        position: 'absolute', top: 116, left: 30,
        transform: 'rotate(-6deg)',
        fontFamily: FONT.serif, fontSize: 12, color: T.inkMuted,
        background: T.amberTint, padding: '4px 10px', borderRadius: 4,
      }}>食材いっぱい</div>
    </div>
  );
}

export default function ScreenOnboarding() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordResetEmail } = useAuth();
  // モード: 'default' | 'choice' | 'email' | 'reset' | 'resetDone'
  const [mode, setMode] = useState('default');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(toJapaneseError(err?.message));
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (isSignup) {
        // 登録完了後は onAuthStateChange が自動でログイン処理する
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (err) {
      // 登録済みメールで新規登録しようとした場合 → ログインタブに切り替え
      if (err?.message === 'User already registered') {
        setIsSignup(false);
        setError('このメールアドレスはすでに登録されています。\nパスワードを入力してログインしてください。');
      } else {
        setError(toJapaneseError(err?.message));
      }
      setLoading(false);
    }
  };

  const goToChoice = () => { setMode('choice'); setError(null); };
  const goToEmail  = () => { setIsSignup(true); setMode('email'); setError(null); };
  const goToReset  = () => { setMode('reset'); setError(null); };
  const goBack     = () => {
    setError(null);
    if (mode === 'email') return setMode('choice');
    if (mode === 'reset') return setMode('email');
    setMode('default');
  };

  // パスワードリセットメール送信
  const handleResetSubmit = async () => {
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(email.trim());
      setMode('resetDone');
    } catch (err) {
      setError(toJapaneseError(err?.message));
    } finally {
      setLoading(false);
    }
  };


  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <TopDecoration />

      {/* ボトムコンテンツ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 460,
        padding: mode === 'default' ? '36px 28px 40px' : '24px 28px 28px',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── デフォルト（元のデザイン） ── */}
        {mode === 'default' && (
          <>
            <Logo size={20} />

            <div style={{ marginTop: 30 }}>
              <Eyebrow>レシピは、考えなくていい</Eyebrow>
              <div style={{
                fontFamily: FONT.serif, fontSize: 28, fontWeight: 600, color: T.ink,
                lineHeight: 1.4, letterSpacing: '0.01em', marginTop: 12,
              }}>
                食材を入れれば、<br />
                今日のごはんが<br />
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  決まる。
                  <HandUnderline width={92} color={T.terracotta} style={{ position: 'absolute', left: 0, top: '88%' }} />
                </span>
              </div>
              <div style={{
                fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft,
                lineHeight: 1.8, marginTop: 18,
              }}>
                食材を文字で入れるだけで、AIが<br />
                条件に合わせてレシピを2つ提案します。
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
              <Dotz on />
              <Dotz />
              <Dotz />
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Btn kind="accent" full onClick={goToChoice}>
                はじめる
              </Btn>
              <button
                onClick={goToChoice}
                style={{
                  textAlign: 'center',
                  fontFamily: FONT.sans,
                  fontSize: 12,
                  color: T.inkMuted,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                すでに登録ずみ <span style={{ color: T.ink, fontWeight: 600 }}>ログイン</span>
              </button>
            </div>
          </>
        )}

        {/* ── ログイン方法の選択 ── */}
        {mode === 'choice' && (
          <>
            {/* ヘッダー */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={goBack}
                aria-label="戻る"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: T.inkMuted, fontSize: 20, padding: '0 4px 0 0', lineHeight: 1,
                }}
              >
                &#8592;
              </button>
              <Logo size={18} />
            </div>

            <div style={{ marginTop: 28 }}>
              <div style={{
                fontFamily: FONT.serif, fontSize: 20, fontWeight: 600,
                color: T.ink, lineHeight: 1.5,
              }}>
                ログイン方法を<br />選んでください
              </div>
              <div style={{
                fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted,
                marginTop: 8, lineHeight: 1.7,
              }}>
                どちらのアカウントでもデータは共有されます
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  width: '100%', height: 52, borderRadius: 14,
                  background: T.surface, border: `1.5px solid ${T.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  fontFamily: FONT.sans, fontSize: 15, fontWeight: 600, color: T.ink,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  boxShadow: '0 2px 8px -4px rgba(42,31,20,0.2)',
                }}
              >
                <GoogleIcon />
                Google でログイン
              </button>

              {/* 区切り線 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: T.line }} />
                <span style={{ fontFamily: FONT.sans, fontSize: 11, color: T.inkMuted }}>または</span>
                <div style={{ flex: 1, height: 1, background: T.line }} />
              </div>

              {/* メール */}
              <button
                onClick={goToEmail}
                disabled={loading}
                style={{
                  width: '100%', height: 52, borderRadius: 14,
                  background: 'none', border: `1.5px solid ${T.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT.sans, fontSize: 15, fontWeight: 500, color: T.inkSoft,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                メールアドレスで続ける
              </button>
            </div>
          </>
        )}

        {/* ── メールフォーム ── */}
        {mode === 'email' && (
          <>
            {/* ヘッダー */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={goBack}
                aria-label="戻る"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: T.inkMuted, fontSize: 20, padding: '0 4px 0 0', lineHeight: 1,
                }}
              >
                &#8592;
              </button>
              <Logo size={18} />
            </div>

            {/* ログイン / 新規登録 タブ */}
            <div style={{
              display: 'flex', marginTop: 20,
              borderBottom: `1.5px solid ${T.line}`,
            }}>
              {[{ signup: false, label: 'ログイン' }, { signup: true, label: '新規登録' }].map(({ signup, label }) => (
                <button
                  key={label}
                  onClick={() => { setIsSignup(signup); setError(null); }}
                  style={{
                    flex: 1, height: 40, background: 'none', border: 'none',
                    borderBottom: isSignup === signup
                      ? `2px solid ${T.terracotta}`
                      : '2px solid transparent',
                    fontFamily: FONT.sans, fontSize: 14, fontWeight: 600,
                    color: isSignup === signup ? T.terracotta : T.inkMuted,
                    cursor: 'pointer', marginBottom: -1.5,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 入力フィールド */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                style={inputStyle}
                autoComplete="email"
              />
              <input
                type="password"
                placeholder={isSignup ? 'パスワード（6文字以上）' : 'パスワード'}
                value={password}
                onChange={(e) => e.key === 'Enter' ? handleEmailSubmit() : setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                style={inputStyle}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
              {/* パスワードを忘れた方（ログインタブのみ表示） */}
              {!isSignup && (
                <button
                  onClick={goToReset}
                  style={{
                    alignSelf: 'flex-end',
                    fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  パスワードを忘れた方
                </button>
              )}
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div style={{
                marginTop: 10, padding: '10px 14px', borderRadius: 10,
                background: T.terracottaTint,
                fontFamily: FONT.sans, fontSize: 12, color: T.terracottaDeep,
                lineHeight: 1.6, whiteSpace: 'pre-line',
              }}>
                {error}
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn kind="accent" full onClick={handleEmailSubmit} disabled={loading}>
                {loading ? '処理中…' : (isSignup ? '新規登録する' : 'ログイン')}
              </Btn>
            </div>
          </>
        )}

        {/* ── パスワードリセット送信フォーム ── */}
        {mode === 'reset' && (
          <>
            {/* ヘッダー */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={goBack}
                aria-label="戻る"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: T.inkMuted, fontSize: 20, padding: '0 4px 0 0', lineHeight: 1,
                }}
              >
                &#8592;
              </button>
              <Logo size={18} />
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 20, fontWeight: 600, color: T.ink }}>
                パスワードをリセット
              </div>
              <div style={{
                fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted,
                marginTop: 8, lineHeight: 1.7,
              }}>
                登録したメールアドレスを入力してください。<br />
                パスワード再設定用のリンクをお送りします。
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResetSubmit()}
                style={inputStyle}
                autoComplete="email"
              />
            </div>

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

            <div style={{ marginTop: 'auto' }}>
              <Btn kind="accent" full onClick={handleResetSubmit} disabled={loading}>
                {loading ? '送信中…' : 'リセットメールを送る'}
              </Btn>
            </div>
          </>
        )}

        {/* ── パスワードリセットメール送信完了 ── */}
        {mode === 'resetDone' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center',
          }}>
            <div style={{ fontSize: 44, lineHeight: 1 }}>&#128140;</div>
            <div style={{
              fontFamily: FONT.serif, fontSize: 20, fontWeight: 600, color: T.ink,
            }}>
              リセットメールを送りました
            </div>
            <div style={{
              fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft, lineHeight: 1.8,
            }}>
              <span style={{ fontWeight: 600 }}>{email}</span> に<br />
              パスワード再設定リンクをお送りしました。<br />
              メール内のリンクをタップしてください。
            </div>
            <div style={{
              background: T.amberTint, border: `1px solid ${T.amber}55`,
              borderRadius: 10, padding: '10px 16px',
              fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft,
              textAlign: 'left', lineHeight: 1.8, width: '100%',
            }}>
              <div style={{ fontWeight: 600, color: T.ink, marginBottom: 4 }}>届かない場合</div>
              <div>・迷惑メール・スパムフォルダを確認</div>
              <div>・数分待ってから再度お試しください</div>
            </div>
            <button
              onClick={() => { setMode('email'); setIsSignup(false); setError(null); }}
              style={{
                fontFamily: FONT.sans, fontSize: 13, color: T.terracotta,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              ログイン画面へ戻る
            </button>
          </div>
        )}

      </div>
    </Paper>
  );
}
