-- From Zero Framework v7.4 foundation schema.
-- Sprint 3 local-only migration: schema, RLS, grants, bootstrap seeds, and audit guards.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists app_private;
revoke all on schema app_private from public;

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public;

create or replace function app_private.current_tenant_id()
returns uuid
language sql
stable
as $$
  select case
    when coalesce(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    else null
  end
$$;

create or replace function app_private.current_profile_code()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'profile_code', '')
$$;

create or replace function app_private.is_super_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'is_super_admin', 'false') = 'true'
    or app_private.current_profile_code() = 'super_admin'
$$;

create table if not exists public.settings (
  id uuid primary key default extensions.gen_random_uuid(),
  singleton_key boolean not null default true check (singleton_key),
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint settings_singleton_key unique (singleton_key)
);

create table if not exists public.modules (
  id uuid primary key default extensions.gen_random_uuid(),
  name varchar(100) not null unique,
  code varchar(50) not null unique,
  icon varchar(50),
  slug varchar(50) not null unique,
  description text,
  enabled boolean not null default true,
  table_name varchar(100),
  display_field varchar(100),
  display_subtitle_field varchar(100),
  grid_columns jsonb not null default '[]'::jsonb,
  grid_default_sort jsonb,
  grid_default_page_size integer check (grid_default_page_size is null or grid_default_page_size > 0),
  grid_row_actions text[] not null default array[]::text[],
  searchable boolean not null default false,
  search_fields jsonb not null default '[]'::jsonb,
  search_display_title varchar(100),
  search_display_subtitle varchar(100),
  search_display_detail_fields text[] not null default array[]::text[],
  search_result_limit integer check (search_result_limit is null or search_result_limit between 1 and 20),
  sort_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.plans (
  id uuid primary key default extensions.gen_random_uuid(),
  code varchar(50) not null unique,
  name varchar(100) not null,
  description text,
  is_active boolean not null default true,
  is_freemium boolean not null default false,
  sort_order integer,
  price_monthly numeric(10,2),
  price_yearly numeric(10,2),
  currency varchar(3) not null default 'USD',
  trial_days integer not null default 0 check (trial_days >= 0),
  features jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null
);

create table if not exists public.tenants (
  id uuid primary key default extensions.gen_random_uuid(),
  name varchar(200) not null,
  legal_name varchar(200),
  slug varchar(100) not null unique,
  tax_id varchar(50),
  industry varchar(100),
  company_size varchar(50),
  description text,
  logo_url text,
  status varchar(30) not null default 'active'
    check (status in ('active', 'suspended', 'marked_for_deletion', 'purged')),
  primary_email varchar(255),
  billing_email varchar(255),
  phone varchar(30),
  secondary_phone varchar(30),
  website text,
  contact_name varchar(200),
  contact_email varchar(255),
  contact_phone varchar(30),
  address_line_1 varchar(300),
  address_line_2 varchar(300),
  city varchar(100),
  state varchar(100),
  postal_code varchar(20),
  country char(2),
  latitude numeric(10,7),
  longitude numeric(10,7),
  social_links jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  home_url varchar(200),
  purge_log jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null
);

create table if not exists public.profiles (
  id uuid primary key default extensions.gen_random_uuid(),
  name varchar(100) not null,
  tenant_id uuid references public.tenants(id) on delete cascade,
  home_url varchar(200),
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null
);

create unique index if not exists profiles_global_name_unique
  on public.profiles (lower(name))
  where tenant_id is null;
create unique index if not exists profiles_tenant_name_unique
  on public.profiles (tenant_id, lower(name))
  where tenant_id is not null;

create table if not exists public.user_memberships (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  status varchar(20) not null default 'active' check (status in ('active', 'suspended', 'pending')),
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  constraint user_memberships_user_tenant_unique unique (user_id, tenant_id)
);

create unique index if not exists user_memberships_single_active_user_tenant
  on public.user_memberships (user_id)
  where status = 'active';

create table if not exists public.profile_permissions (
  id uuid primary key default extensions.gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  can_view boolean not null default false,
  can_create boolean not null default false,
  can_update boolean not null default false,
  can_delete boolean not null default false,
  can_import boolean not null default false,
  can_export boolean not null default false,
  can_notify boolean not null default false,
  constraint profile_permissions_profile_module_unique unique (profile_id, module_id)
);

create table if not exists public.logs (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  api_key_id uuid,
  action varchar(100) not null,
  entity_type varchar(100),
  entity_id uuid,
  ip_address inet,
  user_agent text,
  "timestamp" timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists app_private.bootstrap_runs (
  id uuid primary key default extensions.gen_random_uuid(),
  run_key text not null unique,
  completed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists modules_enabled_sort_idx on public.modules (enabled, sort_order);
create index if not exists plans_active_sort_idx on public.plans (is_active, sort_order) where deleted_at is null;
create index if not exists tenants_status_idx on public.tenants (status);
create index if not exists tenants_deleted_at_idx on public.tenants (deleted_at);
create index if not exists profiles_tenant_id_idx on public.profiles (tenant_id);
create index if not exists profile_permissions_profile_id_idx on public.profile_permissions (profile_id);
create index if not exists profile_permissions_module_id_idx on public.profile_permissions (module_id);
create index if not exists user_memberships_tenant_id_idx on public.user_memberships (tenant_id);
create index if not exists user_memberships_user_id_idx on public.user_memberships (user_id);
create index if not exists logs_tenant_timestamp_idx on public.logs (tenant_id, "timestamp" desc);
create index if not exists logs_entity_idx on public.logs (entity_type, entity_id);
create index if not exists logs_action_timestamp_idx on public.logs (action, "timestamp" desc);

create or replace function app_private.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.prevent_log_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'logs are append-only';
end;
$$;

create or replace function app_private.audit_foundation_mutation()
returns trigger
language plpgsql
as $$
declare
  row_id uuid;
  row_tenant_id uuid;
  row_payload jsonb;
  old_payload jsonb;
  new_payload jsonb;
begin
  if tg_op = 'DELETE' then
    old_payload := to_jsonb(old);
    row_payload := old_payload;
  elsif tg_op = 'INSERT' then
    new_payload := to_jsonb(new);
    row_payload := new_payload;
  else
    old_payload := to_jsonb(old);
    new_payload := to_jsonb(new);
    row_payload := new_payload;
  end if;

  row_id := (row_payload ->> 'id')::uuid;
  row_tenant_id := case
    when tg_table_name = 'tenants' then row_id
    when row_payload ? 'tenant_id' and row_payload ->> 'tenant_id' is not null
      then (row_payload ->> 'tenant_id')::uuid
    else null
  end;

  insert into public.logs (tenant_id, actor_id, action, entity_type, entity_id, metadata)
  values (
    row_tenant_id,
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    row_id,
    jsonb_build_object(
      'source', 'database_trigger',
      'operation', tg_op,
      'old', old_payload,
      'new', new_payload
    )
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists settings_touch_updated_at on public.settings;
create trigger settings_touch_updated_at
  before update on public.settings
  for each row execute function app_private.touch_updated_at();

drop trigger if exists modules_touch_updated_at on public.modules;
create trigger modules_touch_updated_at
  before update on public.modules
  for each row execute function app_private.touch_updated_at();

drop trigger if exists plans_touch_updated_at on public.plans;
create trigger plans_touch_updated_at
  before update on public.plans
  for each row execute function app_private.touch_updated_at();

drop trigger if exists tenants_touch_updated_at on public.tenants;
create trigger tenants_touch_updated_at
  before update on public.tenants
  for each row execute function app_private.touch_updated_at();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function app_private.touch_updated_at();

drop trigger if exists logs_prevent_update on public.logs;
create trigger logs_prevent_update
  before update on public.logs
  for each row execute function app_private.prevent_log_mutation();

drop trigger if exists logs_prevent_delete on public.logs;
create trigger logs_prevent_delete
  before delete on public.logs
  for each row execute function app_private.prevent_log_mutation();

drop trigger if exists settings_audit_foundation_mutation on public.settings;
create trigger settings_audit_foundation_mutation
  after update on public.settings
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists modules_audit_foundation_mutation on public.modules;
create trigger modules_audit_foundation_mutation
  after insert or update or delete on public.modules
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists plans_audit_foundation_mutation on public.plans;
create trigger plans_audit_foundation_mutation
  after insert or update or delete on public.plans
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists tenants_audit_foundation_mutation on public.tenants;
create trigger tenants_audit_foundation_mutation
  after insert or update or delete on public.tenants
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists profiles_audit_foundation_mutation on public.profiles;
create trigger profiles_audit_foundation_mutation
  after insert or update or delete on public.profiles
  for each row execute function app_private.audit_foundation_mutation();

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_permissions enable row level security;
alter table public.user_memberships enable row level security;
alter table public.logs enable row level security;

drop policy if exists tenants_select_policy on public.tenants;
create policy tenants_select_policy
  on public.tenants
  for select
  to authenticated
  using (app_private.is_super_admin() or id = app_private.current_tenant_id());

drop policy if exists tenants_update_policy on public.tenants;
create policy tenants_update_policy
  on public.tenants
  for update
  to authenticated
  using (id = app_private.current_tenant_id())
  with check (id = app_private.current_tenant_id());

drop policy if exists profiles_select_policy on public.profiles;
create policy profiles_select_policy
  on public.profiles
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id is null
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists profile_permissions_select_policy on public.profile_permissions;
create policy profile_permissions_select_policy
  on public.profile_permissions
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or exists (
      select 1
      from public.profiles p
      where p.id = profile_permissions.profile_id
        and (p.tenant_id is null or p.tenant_id = app_private.current_tenant_id())
    )
  );

drop policy if exists user_memberships_select_policy on public.user_memberships;
create policy user_memberships_select_policy
  on public.user_memberships
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or user_id = auth.uid()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists logs_select_policy on public.logs;
create policy logs_select_policy
  on public.logs
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or (tenant_id is not null and tenant_id = app_private.current_tenant_id())
  );

create or replace function app_private.has_permission(requested_action text, module_code text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select app_private.is_super_admin()
    or exists (
      select 1
      from public.user_memberships um
      join public.profile_permissions pp on pp.profile_id = um.profile_id
      join public.modules m on m.id = pp.module_id
      where um.user_id = auth.uid()
        and um.status = 'active'
        and um.tenant_id = app_private.current_tenant_id()
        and m.code = module_code
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

insert into public.settings (config)
values (
  jsonb_build_object(
    'general', jsonb_build_object(
      'app_mode', 'saas',
      'app_name', 'From Zero Framework',
      'app_url', 'http://localhost:3000',
      'allow_multi_tenant_users', false,
      'maintenance_mode', false,
      'event_bus_enabled', true
    ),
    'security', jsonb_build_object(
      'session_timeout_minutes', 30,
      'absolute_timeout_minutes', 1440,
      'max_login_attempts', 5,
      'mfa_policy', 'optional',
      'invitation_ttl_days', 7,
      'enable_rate_limit', true,
      'rate_limit_global', 1000,
      'rate_limit_tenant', 300,
      'rate_limit_per_endpoint', '{}'::jsonb
    ),
    'branding', '{}'::jsonb,
    'notifications', jsonb_build_object('default_channel', 'in_app', 'auto_dismiss_seconds', 5),
    'storage', jsonb_build_object('image_optimization_webp', false),
    'ai', jsonb_build_object('ai_enabled', true, 'ai_default_model_id', null),
    'billing', jsonb_build_object('billing_enabled', true, 'licensing_model', 'per_tenant', 'subscription', jsonb_build_object('default_plan_code', 'trial', 'expiry_action', 'degrade_to_free')),
    'i18n', jsonb_build_object('default_locale', 'es', 'supported_locales', jsonb_build_array('es', 'en')),
    'ui_defaults', jsonb_build_object('default_page_size', 25, 'default_search_result_limit', 10, 'breadcrumbs_enabled', true),
    'legal', '{}'::jsonb,
    'cleanup', jsonb_build_object('soft_delete', jsonb_build_object('auto_purge_days', 30)),
    'integrations', jsonb_build_object('redis_enabled', false, 'inngest_enabled', true)
  )
)
on conflict (singleton_key) do update
set config = excluded.config;

insert into public.modules (name, code, icon, slug, table_name, display_field, enabled, searchable, sort_order)
values
  ('Settings', 'settings', 'Settings', 'settings', 'settings', 'id', true, false, 10),
  ('Module', 'module', 'LayoutGrid', 'module', 'modules', 'name', true, true, 20),
  ('Plan', 'plan', 'BadgeDollarSign', 'plan', 'plans', 'name', true, true, 30),
  ('AI Model', 'ai-model', 'Bot', 'ai-model', 'ai_models', 'name', true, true, 40),
  ('Log', 'log', 'ScrollText', 'log', 'logs', 'action', true, false, 50),
  ('Profile', 'profile', 'Shield', 'profile', 'profiles', 'name', true, true, 60),
  ('Tenant', 'tenant', 'Building2', 'tenant', 'tenants', 'name', true, true, 70),
  ('User', 'user', 'Users', 'user', 'users', 'email', true, true, 80),
  ('Invitation', 'invitation', 'MailPlus', 'invitation', 'invitations', 'email', true, true, 90),
  ('Notification', 'notification', 'Bell', 'notification', 'notifications', 'title', true, true, 100),
  ('Rule', 'rule', 'Workflow', 'rule', 'rules', 'name', true, true, 110),
  ('Custom Field', 'custom-field', 'ListPlus', 'custom-field', 'custom_fields', 'field_name', true, true, 120),
  ('Email Template', 'email-template', 'Mail', 'email-template', 'email_templates', 'code', true, true, 130),
  ('API Key', 'api-key', 'KeyRound', 'api-key', 'api_keys', 'name', true, true, 140),
  ('Integration', 'integration', 'Plug', 'integration', 'integrations', 'provider', true, true, 150),
  ('Webhook', 'webhook', 'Webhook', 'webhook', 'webhooks', 'name', true, true, 160),
  ('Document', 'document', 'FileText', 'document', 'documents', 'title', true, true, 170),
  ('Import', 'import', 'Upload', 'import', 'imports', 'source_filename', true, false, 180),
  ('Export', 'export', 'Download', 'export', 'exports', 'target_format', true, false, 190),
  ('Subscription', 'subscription', 'CreditCard', 'subscription', 'subscriptions', 'status', true, true, 200),
  ('Statement', 'statement', 'ReceiptText', 'statement', 'statements', 'period_start', true, false, 210),
  ('Invoice', 'invoice', 'Receipt', 'invoice', 'invoices', 'invoice_number', true, true, 220),
  ('File', 'file', 'FolderOpen', 'file', 'files', 'filename', true, true, 230),
  ('Tag', 'tag', 'Tag', 'tag', 'tags', 'name', true, true, 240),
  ('Bookmark', 'bookmark', 'Bookmark', 'bookmark', 'bookmarks', 'entity_type', true, false, 250),
  ('Filter', 'filter', 'Filter', 'filter', 'filters', 'name', true, true, 260),
  ('Task', 'task', 'CheckSquare', 'task', 'tasks', 'title', true, true, 270)
on conflict (code) do update
set name = excluded.name,
    icon = excluded.icon,
    slug = excluded.slug,
    table_name = excluded.table_name,
    display_field = excluded.display_field,
    enabled = excluded.enabled,
    searchable = excluded.searchable,
    sort_order = excluded.sort_order;

insert into public.plans (code, name, description, is_active, is_freemium, sort_order, currency, trial_days, features)
values
  ('free', 'Free', 'Base freemium plan', true, true, 10, 'USD', 0, '{"max_users":1,"storage_gb":1,"ai_enabled":false,"modules_allowed":["*"],"max_api_keys":0,"max_rules":5,"max_custom_fields":5,"webhook_enabled":false,"import_export_enabled":false}'::jsonb),
  ('trial', 'Trial', 'Time-limited evaluation plan', true, false, 20, 'USD', 14, '{"max_users":5,"storage_gb":2,"ai_enabled":true,"modules_allowed":["*"],"max_api_keys":1,"max_rules":5,"max_custom_fields":5,"webhook_enabled":false,"import_export_enabled":false}'::jsonb),
  ('pro', 'Pro', 'Standard paid plan', true, false, 30, 'USD', 0, '{"max_users":-1,"storage_gb":10,"ai_enabled":true,"modules_allowed":["*"],"max_api_keys":10,"max_rules":-1,"max_custom_fields":-1,"webhook_enabled":true,"import_export_enabled":true}'::jsonb),
  ('enterprise', 'Enterprise', 'Enterprise plan without fixed public pricing', true, false, 40, 'USD', 0, '{"max_users":-1,"storage_gb":-1,"ai_enabled":true,"modules_allowed":["*"],"max_api_keys":-1,"max_rules":-1,"max_custom_fields":-1,"webhook_enabled":true,"import_export_enabled":true}'::jsonb)
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    is_active = excluded.is_active,
    is_freemium = excluded.is_freemium,
    sort_order = excluded.sort_order,
    currency = excluded.currency,
    trial_days = excluded.trial_days,
    features = excluded.features;

insert into public.tenants (name, slug, status, primary_email, settings)
values ('Main Account', 'main', 'active', 'admin@example.com', '{"locale":"es","timezone":"UTC","currency":"USD"}'::jsonb)
on conflict (slug) do update
set name = excluded.name,
    status = excluded.status,
    primary_email = excluded.primary_email,
    settings = public.tenants.settings || excluded.settings;

with base_profiles (name, home_url, description, is_system) as (
  values
    ('super_admin', '/dashboard', 'Platform super administrator', true),
    ('admin', '/dashboard', 'Tenant administrator', true),
    ('member', '/dashboard', 'Standard member', true),
    ('guest', '/dashboard', 'Read-only guest', true)
)
insert into public.profiles (name, home_url, description, is_system)
select bp.name, bp.home_url, bp.description, bp.is_system
from base_profiles bp
where not exists (
  select 1
  from public.profiles p
  where p.tenant_id is null
    and lower(p.name) = lower(bp.name)
);

insert into public.profile_permissions (
  profile_id,
  module_id,
  can_view,
  can_create,
  can_update,
  can_delete,
  can_import,
  can_export,
  can_notify
)
select
  p.id,
  m.id,
  true,
  p.name in ('super_admin', 'admin'),
  p.name in ('super_admin', 'admin'),
  p.name in ('super_admin', 'admin'),
  p.name in ('super_admin', 'admin'),
  p.name in ('super_admin', 'admin'),
  p.name in ('super_admin', 'admin')
from public.profiles p
cross join public.modules m
where p.tenant_id is null
  and p.name in ('super_admin', 'admin', 'member', 'guest')
on conflict (profile_id, module_id) do update
set can_view = excluded.can_view,
    can_create = excluded.can_create,
    can_update = excluded.can_update,
    can_delete = excluded.can_delete,
    can_import = excluded.can_import,
    can_export = excluded.can_export,
    can_notify = excluded.can_notify;

insert into app_private.bootstrap_runs (run_key, metadata)
values (
  'foundation',
  jsonb_build_object(
    'source', '20260618000300_foundation_schema.sql',
    'tenant_zero_slug', 'main',
    'super_admin_email', 'admin@example.com',
    'app_mode', 'saas',
    'allow_multi_tenant_users', false
  )
)
on conflict (run_key) do nothing;

insert into public.logs (tenant_id, action, entity_type, metadata)
select id, 'system_event', 'bootstrap', jsonb_build_object('event', 'foundation_seeded', 'source', 'migration')
from public.tenants
where slug = 'main'
  and not exists (
    select 1 from public.logs
    where entity_type = 'bootstrap'
      and metadata ->> 'event' = 'foundation_seeded'
  );

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema app_private to authenticated, service_role;
grant execute on function app_private.current_tenant_id() to authenticated, service_role;
grant execute on function app_private.current_profile_code() to authenticated, service_role;
grant execute on function app_private.is_super_admin() to authenticated, service_role;
grant execute on function app_private.has_permission(text, text) to authenticated, service_role;

grant select on public.modules, public.plans to authenticated;
grant select on public.tenants, public.profiles, public.profile_permissions, public.user_memberships, public.logs to authenticated;
grant update on public.tenants to authenticated;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all tables in schema app_private to service_role;

revoke all on public.settings from anon, authenticated;
revoke all on public.logs from anon;
revoke all on public.tenants from anon;
revoke all on public.profiles from anon;
revoke all on public.profile_permissions from anon;
revoke all on public.user_memberships from anon;
