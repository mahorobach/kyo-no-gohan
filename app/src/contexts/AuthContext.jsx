// 認証状態をアプリ全体で共有するコンテキスト
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import AuthContext from './AuthContext';

const getAuthRedirectUrl = () => window.location.origin;
const authConfigError = new Error('Supabase の環境変数が設定されていません');

const ensureSupabase = () => {
  if (!isSupabaseConfigured || !supabase) throw authConfigError;
  return supabase;
};

export function AuthProvider({ children }) {
  // null = 読み込み中, false = 未ログイン, object = ログイン済み
  const [user, setUser] = useState(() => (isSupabaseConfigured ? null : false));
  const [loading, setLoading] = useState(() => isSupabaseConfigured);
  // パスワードリセットリンクからの遷移かどうか
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    // onAuthStateChange を先に登録してから getSession を呼ぶ
    // （リダイレクト後の SIGNED_IN イベントを取りこぼさないため）
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // パスワードリセットメールのリンクを踏んだ場合
      if (event === 'PASSWORD_RECOVERY') {
        setNeedsPasswordReset(true);
      }
      setUser(session?.user ?? false);
      setLoading(false);
    });

    // 既存セッションを確認（リスナー登録後に呼ぶ）
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Google ログイン
  const signInWithGoogle = async () => {
    const client = ensureSupabase();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  // メール/パスワードでログイン
  const signInWithEmail = async (email, password) => {
    const client = ensureSupabase();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // メール/パスワードで新規登録（確認メール送信）
  const signUpWithEmail = async (email, password) => {
    const client = ensureSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });
    if (error) throw error;
    // identities が空配列 = すでに登録済みのメールアドレス（Supabase の仕様）
    if (data.user?.identities?.length === 0) {
      throw new Error('User already registered');
    }
    return data;
  };

  // 確認メールを再送する
  const resendConfirmationEmail = async (email) => {
    const client = ensureSupabase();
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getAuthRedirectUrl() },
    });
    if (error) throw error;
  };

  // パスワードリセットメールを送る
  const sendPasswordResetEmail = async (email) => {
    const client = ensureSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectUrl(),
    });
    if (error) throw error;
  };

  // 新しいパスワードに更新する（リセットリンクからの遷移後）
  const updatePassword = async (newPassword) => {
    const client = ensureSupabase();
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
    setNeedsPasswordReset(false);
  };

  // ログアウト
  const signOut = async () => {
    const client = ensureSupabase();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user, loading, needsPasswordReset,
      signInWithGoogle, signInWithEmail, signUpWithEmail,
      resendConfirmationEmail, sendPasswordResetEmail, updatePassword, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
