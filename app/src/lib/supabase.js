// Supabase クライアントの初期化
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase の環境変数が設定されていません');
}

// SPA での OAuth リダイレクト後にセッションが取れるよう implicit フローを使用
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true,
  },
});
