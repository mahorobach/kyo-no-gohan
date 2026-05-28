// Supabase クライアントの初期化
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// SPA での OAuth リダイレクト後にセッションが取れるよう implicit フローを使用
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'implicit',
      detectSessionInUrl: true,
    },
  })
  : null;
