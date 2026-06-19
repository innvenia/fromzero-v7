-- From Zero Framework v7.4 Sprint 4 auth/RBAC schema.
-- Local-only migration: users, preferences, invitations, API keys, RLS, grants, and permission helpers.

create or replace function app_private.api_key_scopes_are_valid(key_scopes text[])
returns boolean
language sql
immutable
as $$
  select coalesce(
    bool_and(scope ~ '^(\\*|[a-z0-9]+(-[a-z0-9]+)*):(\\*|view|create|update|delete|import|export|notify)$'),
    true
  )
  from unnest(key_scopes) as scope
$$;

create table if not exists public.users (
  id uuid primary key default extensions.gen_random_uuid(),
  auth_id uuid not null unique references auth.users(id) on delete cascade,
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  avatar_url text,
  status varchar(30) not null default 'pending_verification'
    check (status in ('active', 'inactive', 'pending_verification', 'marked_for_deletion')),
  locale varchar(10),
  timezone varchar(50),
  time_format varchar(3) check (time_format is null or time_format in ('12h', '24h')),
  mfa_method varchar(10) check (mfa_method is null or mfa_method in ('totp', 'email', 'sms')),
  last_login_at timestamptz,
  marked_for_deletion_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null
);

create table if not exists public.user_preferences (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  key varchar(100) not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_user_tenant_key_unique unique (user_id, tenant_id, key)
);

create table if not exists public.invitations (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email varchar(255) not null,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  invited_by uuid not null references auth.users(id) on delete restrict,
  token_hash text not null unique,
  invitation_type varchar(10) not null check (invitation_type in ('link', 'code')),
  status varchar(20) not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null
);

create unique index if not exists invitations_pending_email_tenant_unique
  on public.invitations (tenant_id, lower(email))
  where status = 'pending' and deleted_at is null;

create table if not exists public.api_keys (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name varchar(200) not null,
  key_hash text not null unique,
  key_prefix varchar(20) not null,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  scopes text[] not null default array[]::text[],
  expires_at timestamptz,
  last_used_at timestamptz,
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint api_keys_scopes_format_check check (app_private.api_key_scopes_are_valid(scopes))
);

alter table public.logs
  add column if not exists auth_method varchar(20) not null default 'jwt'
    check (auth_method in ('jwt', 'api_key', 'system'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'logs_api_key_id_fkey'
  ) then
    alter table public.logs
      add constraint logs_api_key_id_fkey
      foreign key (api_key_id) references public.api_keys(id) on delete set null;
  end if;
end;
$$;

create index if not exists users_auth_id_idx on public.users (auth_id);
create index if not exists users_status_idx on public.users (status) where deleted_at is null;
create index if not exists user_preferences_tenant_user_idx on public.user_preferences (tenant_id, user_id);
create index if not exists invitations_tenant_status_idx on public.invitations (tenant_id, status);
create index if not exists invitations_expires_at_idx on public.invitations (expires_at) where status = 'pending';
create index if not exists api_keys_tenant_active_idx on public.api_keys (tenant_id, is_active) where deleted_at is null;
create index if not exists api_keys_profile_id_idx on public.api_keys (profile_id);
create index if not exists api_keys_expires_at_idx on public.api_keys (expires_at) where expires_at is not null;
create index if not exists logs_api_key_id_idx on public.logs (api_key_id);
create index if not exists logs_auth_method_timestamp_idx on public.logs (auth_method, "timestamp" desc);

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at
  before update on public.users
  for each row execute function app_private.touch_updated_at();

drop trigger if exists user_preferences_touch_updated_at on public.user_preferences;
create trigger user_preferences_touch_updated_at
  before update on public.user_preferences
  for each row execute function app_private.touch_updated_at();

drop trigger if exists invitations_touch_updated_at on public.invitations;
create trigger invitations_touch_updated_at
  before update on public.invitations
  for each row execute function app_private.touch_updated_at();

drop trigger if exists api_keys_touch_updated_at on public.api_keys;
create trigger api_keys_touch_updated_at
  before update on public.api_keys
  for each row execute function app_private.touch_updated_at();

drop trigger if exists users_audit_foundation_mutation on public.users;
create trigger users_audit_foundation_mutation
  after insert or update or delete on public.users
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists invitations_audit_foundation_mutation on public.invitations;
create trigger invitations_audit_foundation_mutation
  after insert or update or delete on public.invitations
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists api_keys_audit_foundation_mutation on public.api_keys;
create trigger api_keys_audit_foundation_mutation
  after insert or update or delete on public.api_keys
  for each row execute function app_private.audit_foundation_mutation();

alter table public.users enable row level security;
alter table public.user_preferences enable row level security;
alter table public.invitations enable row level security;
alter table public.api_keys enable row level security;

drop policy if exists users_select_policy on public.users;
create policy users_select_policy
  on public.users
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or auth_id = auth.uid()
    or exists (
      select 1
      from public.user_memberships um
      where um.user_id = public.users.auth_id
        and um.tenant_id = app_private.current_tenant_id()
    )
  );

drop policy if exists users_update_self_policy on public.users;
create policy users_update_self_policy
  on public.users
  for update
  to authenticated
  using (auth_id = auth.uid())
  with check (auth_id = auth.uid());

drop policy if exists user_preferences_select_policy on public.user_preferences;
create policy user_preferences_select_policy
  on public.user_preferences
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or (
      tenant_id = app_private.current_tenant_id()
      and user_id = auth.uid()
    )
  );

drop policy if exists user_preferences_write_policy on public.user_preferences;
create policy user_preferences_write_policy
  on public.user_preferences
  for all
  to authenticated
  using (
    tenant_id = app_private.current_tenant_id()
    and user_id = auth.uid()
  )
  with check (
    tenant_id = app_private.current_tenant_id()
    and user_id = auth.uid()
  );

drop policy if exists invitations_select_policy on public.invitations;
create policy invitations_select_policy
  on public.invitations
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists invitations_write_policy on public.invitations;
create policy invitations_write_policy
  on public.invitations
  for all
  to authenticated
  using (tenant_id = app_private.current_tenant_id())
  with check (tenant_id = app_private.current_tenant_id());

drop policy if exists api_keys_select_policy on public.api_keys;
create policy api_keys_select_policy
  on public.api_keys
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists api_keys_write_policy on public.api_keys;
create policy api_keys_write_policy
  on public.api_keys
  for all
  to authenticated
  using (tenant_id = app_private.current_tenant_id())
  with check (tenant_id = app_private.current_tenant_id());

create or replace function app_private.has_api_key_scope(key_scopes text[], requested_action text, module_code text)
returns boolean
language sql
stable
as $$
  select coalesce(
    exists (
      select 1
      from unnest(key_scopes) as scope
      where scope in (
        module_code || ':' || requested_action,
        module_code || ':*',
        '*:' || requested_action,
        '*:*'
      )
    ),
    false
  )
$$;

create or replace function app_private.has_api_key_permission(api_key_uuid uuid, requested_action text, module_code text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.api_keys ak
    join public.profile_permissions pp on pp.profile_id = ak.profile_id
    join public.modules m on m.id = pp.module_id
    where ak.id = api_key_uuid
      and ak.is_active
      and ak.deleted_at is null
      and (ak.expires_at is null or ak.expires_at > now())
      and m.code = module_code
      and app_private.has_api_key_scope(ak.scopes, requested_action, module_code)
      and (
        (requested_action = 'view' and pp.can_view)
        or (requested_action = 'create' and pp.can_create)
        or (requested_action = 'update' and pp.can_update)
        or (requested_action = 'delete' and pp.can_delete)
        or (requested_action = 'import' and pp.can_import)
        or (requested_action = 'export' and pp.can_export)
        or (requested_action = 'notify' and pp.can_notify)
      )
  )
$$;

grant select, update on public.users to authenticated;
grant select, insert, update, delete on public.user_preferences to authenticated;
grant select, insert, update, delete on public.invitations to authenticated;
grant select, insert, update, delete on public.api_keys to authenticated;
grant execute on function app_private.api_key_scopes_are_valid(text[]) to authenticated, service_role;
grant execute on function app_private.has_api_key_scope(text[], text, text) to authenticated, service_role;
grant execute on function app_private.has_api_key_permission(uuid, text, text) to authenticated, service_role;

grant all privileges on public.users to service_role;
grant all privileges on public.user_preferences to service_role;
grant all privileges on public.invitations to service_role;
grant all privileges on public.api_keys to service_role;

revoke all on public.users from anon;
revoke all on public.user_preferences from anon;
revoke all on public.invitations from anon;
revoke all on public.api_keys from anon;
