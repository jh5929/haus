-- =============================================================================
--  Keep-alive 心跳表：让 GitHub Actions 每天真的「写入」一次资料库
--  只读的 anon 查询不算活动，Supabase 免费方案还是会暂停专案。
--  使用方式：Supabase → SQL Editor → 贴上整份 → Run（只需跑一次）
-- =============================================================================

create table if not exists public.keepalive_heartbeat (
  id         int primary key default 1 check (id = 1),  -- 永远只有一行
  last_ping  timestamptz not null default now(),
  ping_count bigint not null default 0
);

-- 开启 RLS 且不加任何 policy：外部无法直接读写这张表
alter table public.keepalive_heartbeat enable row level security;

-- 只能透过这个函数更新心跳（security definer 以拥有者权限执行）
create or replace function public.keepalive_ping()
returns timestamptz
language sql
security definer
set search_path = public
as $$
  insert into public.keepalive_heartbeat (id, last_ping, ping_count)
  values (1, now(), 1)
  on conflict (id) do update
    set last_ping  = now(),
        ping_count = public.keepalive_heartbeat.ping_count + 1
  returning last_ping;
$$;

revoke all on function public.keepalive_ping() from public;
grant execute on function public.keepalive_ping() to anon, authenticated;
