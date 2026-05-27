import { useContext } from 'react';
import AuthContext from './AuthContext';

// 認証情報を取得するカスタムフック
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth は AuthProvider の中で使ってください');
  return ctx;
}
