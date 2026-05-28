-- ============================================================
-- 管理者権限
-- 既存の profiles テーブルに is_admin を追加し、管理画面から変更できるようにする
-- ============================================================

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

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
    or auth.email() = 'dokakao@gmail.com'
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

drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;

-- 自分のレコードを参照（+ 管理者は全件参照）
create policy "profiles_select" on public.profiles
  for select using (
    auth.uid() = user_id
    or public.is_profile_admin()
  );

-- 自分のレコードのみ挿入
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = user_id);

-- 自分のレコードを更新（+ 管理者は全件更新）
create policy "profiles_update" on public.profiles
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

-- 初期管理者
update public.profiles
set is_admin = true
where user_id = '6f87dc5a-d61f-4fd9-ad6b-cd79ff5011b4'::uuid
   or email = 'dokakao@gmail.com';
