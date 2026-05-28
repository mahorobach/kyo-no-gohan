-- ============================================================
-- profiles テーブル
-- ユーザーのプラン（free / tester / paid）を管理する
-- 管理者メール: dokakao@gmail.com
-- ============================================================

create table if not exists profiles (
  user_id      uuid primary key references auth.users on delete cascade,
  email        text,
  display_name text not null default 'さくらこ',
  plan         text not null default 'free'
                 check (plan in ('free', 'tester', 'paid')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- RLS 有効化
alter table profiles enable row level security;

-- 自分のレコードを参照（+ 管理者は全件参照）
create policy "profiles_select" on profiles
  for select using (
    auth.uid() = user_id
    or auth.email() = 'dokakao@gmail.com'
  );

-- 自分のレコードのみ挿入
create policy "profiles_insert" on profiles
  for insert with check (auth.uid() = user_id);

-- 自分のレコードを更新（+ 管理者は全件更新）
create policy "profiles_update" on profiles
  for update using (
    auth.uid() = user_id
    or auth.email() = 'dokakao@gmail.com'
  );
