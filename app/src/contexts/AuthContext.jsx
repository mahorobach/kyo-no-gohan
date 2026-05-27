// 認証状態をアプリ全体で共有するコンテキスト
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // null = 読み込み中, false = 未ログイン, object = ログイン済み
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange を先に登録してから getSession を呼ぶ
    // （リダイレクト後の SIGNED_IN イベントを取りこぼさないため）
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  // ログアウト
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// 認証情報を取得するカスタムフック
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth は AuthProvider の中で使ってください');
  return ctx;
};
