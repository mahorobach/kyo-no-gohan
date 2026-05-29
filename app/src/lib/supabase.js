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

// ── プロフィール操作 ──────────────────────────────────────

// 自分のプロフィールを取得（未登録なら null を返す）
export const fetchProfile = async (userId) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  // PGRST116 = 行が見つからない（正常）
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
};

// プロフィールを作成または更新
export const upsertProfile = async (userId, fields) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('profiles')
    .upsert(
      { user_id: userId, ...fields, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  if (error) throw error;
};

// 全ユーザーのプロフィールを取得（管理者のみ RPC で Auth ユーザーも同期）
export const fetchAllProfiles = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('list_profiles_for_admin');
  if (error) throw error;
  return data ?? [];
};

// 管理画面からプランだけを更新（既存プロフィール行を更新する）
export const updateProfilePlan = async (userId, plan) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('profiles')
    .update({ plan, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
};

// 管理者フラグを変更（管理者のみ RPC で許可）
export const setProfileAdmin = async (userId, isAdmin) => {
  if (!supabase) return;
  const { error } = await supabase.rpc('set_profile_admin', {
    target_user_id: userId,
    next_is_admin: isAdmin,
  });
  if (error) throw error;
};
