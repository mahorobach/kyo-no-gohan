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

// ── レシピ帳操作 ──────────────────────────────────────────

// お気に入りレシピ帳を取得（最新保存順）
export const fetchSavedRecipes = async (userId) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('saved_recipes')
    .select('recipe, saved_at')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => row.recipe);
};

// レシピ帳を丸ごと置き換え（削除→挿入）
export const replaceSavedRecipes = async (userId, recipes) => {
  if (!supabase) return;

  // 既存レコードを全削除
  const { error: deleteError } = await supabase
    .from('saved_recipes')
    .delete()
    .eq('user_id', userId);
  if (deleteError) throw deleteError;

  // 空なら挿入不要
  if (!recipes.length) return;

  const rows = recipes.map((recipe) => ({
    user_id: userId,
    recipe,
    saved_at: recipe.savedAt ?? recipe.favoritedAt ?? new Date().toISOString(),
  }));

  const { error: insertError } = await supabase
    .from('saved_recipes')
    .insert(rows);
  if (insertError) throw insertError;
};

// ── 献立履歴操作 ──────────────────────────────────────────

// 献立履歴を取得（最新 limit 件）
export const fetchGenerationHistory = async (userId, limit = 12) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('generation_history')
    .select('id, ingredients, conditions, recipes, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    ingredients: row.ingredients,
    conditions: row.conditions,
    recipes: row.recipes,
  }));
};

// 献立履歴に1件追加（同じ id が来た場合は上書き）
export const addGenerationHistory = async (userId, generation) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('generation_history')
    .upsert(
      {
        id: generation.id,
        user_id: userId,
        ingredients: generation.ingredients,
        conditions: generation.conditions,
        recipes: generation.recipes,
        created_at: generation.createdAt,
      },
      { onConflict: 'id' }
    );
  if (error) throw error;
};

// 今日の生成回数を取得（A案: generation_history の今日の件数を数える）
export const countTodayGenerations = async (userId) => {
  if (!supabase) return 0;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('generation_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', todayStart.toISOString());
  if (error) throw error;
  return count ?? 0;
};
