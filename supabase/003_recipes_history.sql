-- ============================================================
-- saved_recipes テーブル
-- お気に入りレシピ帳を管理する（1行＝1レシピ）
-- ============================================================

CREATE TABLE IF NOT EXISTS saved_recipes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  recipe    JSONB NOT NULL,
  saved_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS saved_recipes_user_id_idx
  ON saved_recipes(user_id);

ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_recipes_select" ON saved_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_recipes_insert" ON saved_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_recipes_delete" ON saved_recipes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- generation_history テーブル
-- 献立の生成履歴を管理する（1行＝1回の生成）
-- ============================================================

CREATE TABLE IF NOT EXISTS generation_history (
  id          TEXT PRIMARY KEY,            -- JS側で生成した ID を使用
  user_id     UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  ingredients JSONB NOT NULL DEFAULT '[]', -- 使用した食材
  conditions  JSONB NOT NULL DEFAULT '[]', -- 選択した条件
  recipes     JSONB NOT NULL DEFAULT '[]', -- 提案されたレシピ
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS generation_history_user_id_idx
  ON generation_history(user_id);

-- 今日の生成回数カウント用（A案: created_at でフィルタ）
CREATE INDEX IF NOT EXISTS generation_history_user_created_idx
  ON generation_history(user_id, created_at DESC);

ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "generation_history_select" ON generation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "generation_history_insert" ON generation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
