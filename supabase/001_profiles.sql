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
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 管理者判定。初期管理者IDを残しつつ、以後は profiles.is_admin を正とする
create or replace function public.is_profile_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    auth.uid() = '6f87dc5a-d61f-4fd9-ad6b-cd79ff5011b4'::uuid
    or auth.email() in ('dokakao@gmail.com', 'dokakao@yahoo.co.jp')
    or exists (
      select 1
      from public.profiles
      where user_id = auth.uid()
        and is_admin = true
    );
$$;

-- 管理者だけが他ユーザーの管理者フラグを変更する
create or replace function public.set_profile_admin(
  target_user_id uuid,
  next_is_admin boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_profile_admin() then
    raise exception '管理者権限がありません';
  end if;

  if next_is_admin = false
    and target_user_id = auth.uid()
    and not exists (
      select 1
      from public.profiles
      where user_id <> target_user_id
        and is_admin = true
    )
  then
    raise exception '最後の管理者は解除できません';
  end if;

  update public.profiles
  set is_admin = next_is_admin,
      updated_at = now()
  where user_id = target_user_id;
end;
$$;

-- 管理者用: Auth登録済みユーザーを profiles に同期して一覧を返す
create or replace function public.list_profiles_for_admin()
returns table (
  user_id uuid,
  email text,
  display_name text,
  plan text,
  is_admin boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_profile_admin() then
    raise exception '管理者権限がありません';
  end if;

  insert into public.profiles (user_id, email, display_name, plan, is_admin, created_at, updated_at)
  select
    users.id,
    users.email,
    coalesce(
      users.raw_user_meta_data->>'full_name',
      users.raw_user_meta_data->>'name',
      split_part(users.email, '@', 1),
      'さくらこ'
    ),
    'free',
    users.id = '6f87dc5a-d61f-4fd9-ad6b-cd79ff5011b4'::uuid
      or users.email in ('dokakao@gmail.com', 'dokakao@yahoo.co.jp'),
    users.created_at,
    now()
  from auth.users
  where not exists (
    select 1
    from public.profiles
    where profiles.user_id = users.id
  );

  return query
  select
    profiles.user_id,
    profiles.email,
    profiles.display_name,
    profiles.plan,
    profiles.is_admin,
    profiles.created_at,
    profiles.updated_at
  from public.profiles
  order by profiles.created_at desc;
end;
$$;

-- RLS 有効化
alter table profiles enable row level security;

-- 自分のレコードを参照（+ 管理者は全件参照）
create policy "profiles_select" on profiles
  for select using (
    auth.uid() = user_id
    or public.is_profile_admin()
  );

-- 自分のレコードのみ挿入
create policy "profiles_insert" on profiles
  for insert with check (auth.uid() = user_id);

-- 自分のレコードを更新（+ 管理者は全件更新）
create policy "profiles_update" on profiles
  for update using (
    auth.uid() = user_id
    or public.is_profile_admin()
  ) with check (
    auth.uid() = user_id
    or public.is_profile_admin()
  );

-- is_admin は set_profile_admin() 経由でのみ変更する
revoke update on public.profiles from anon, authenticated;
grant update (user_id, email, display_name, plan, updated_at) on public.profiles to authenticated;
grant execute on function public.set_profile_admin(uuid, boolean) to authenticated;
grant execute on function public.list_profiles_for_admin() to authenticated;

-- 初期管理者
update public.profiles
set is_admin = true
where user_id = '6f87dc5a-d61f-4fd9-ad6b-cd79ff5011b4'::uuid
   or email in ('dokakao@gmail.com', 'dokakao@yahoo.co.jp');
