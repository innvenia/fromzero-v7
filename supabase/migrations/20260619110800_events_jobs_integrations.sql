-- From Zero Framework v7.4 Sprint 8 events, jobs, integrations, webhooks, and import/export schema.
-- Local-only migration: no cloud execution, no external service activation, no real secrets.

create extension if not exists pg_cron with schema extensions;

create or replace function app_private.is_encrypted_envelope(value jsonb)
returns boolean
language sql
immutable
as $$
  select jsonb_typeof(value) = 'object'
    and value ? 'ciphertext'
    and value ? 'key_id'
    and value ? 'algorithm'
    and value ->> 'algorithm' in ('aes-256-gcm', 'supabase-vault');
$$;

create table if not exists public.event_outbox (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  event_name varchar(120) not null check (event_name ~ '^[a-z0-9-]+(\.[a-z0-9-]+)+$'),
  module_code varchar(50),
  entity_type varchar(50),
  entity_id uuid,
  source varchar(20) not null
    check (source in ('system', 'user', 'api', 'job', 'webhook', 'import', 'export', 'rule')),
  payload jsonb not null default '{}'::jsonb,
  idempotency_key varchar(160) not null unique,
  status varchar(20) not null default 'pending'
    check (status in ('pending', 'dispatched', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  occurred_at timestamptz not null,
  dispatched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_outbox_entity_pair_check check (
    (entity_type is null and entity_id is null)
    or (entity_type is not null and entity_id is not null)
  )
);

create table if not exists public.job_runs (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  job_name varchar(120) not null,
  kind varchar(20) not null check (kind in ('pg_cron', 'inngest')),
  status varchar(20) not null
    check (status in ('queued', 'running', 'succeeded', 'failed', 'retrying', 'cancelled')),
  idempotency_key varchar(160) not null unique,
  attempt_number integer not null default 1 check (attempt_number > 0),
  max_attempts integer not null default 4 check (max_attempts > 0),
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint job_runs_attempt_check check (attempt_number <= max_attempts),
  constraint job_runs_succeeded_completed_check check (status <> 'succeeded' or completed_at is not null)
);

create table if not exists public.notifications (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title varchar(200) not null,
  body text not null,
  type varchar(20) not null check (type in ('system', 'tenant', 'automation')),
  level varchar(20) not null default 'info' check (level in ('info', 'success', 'warning', 'critical')),
  channels text[] not null default array['in_app']::text[],
  delivery_status jsonb not null default '{"in_app":"pending"}'::jsonb,
  entity_type varchar(100),
  entity_id uuid,
  read_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  constraint notifications_channels_check check (
    channels <@ array['in_app', 'email', 'sms', 'whatsapp']::text[]
    and 'in_app' = any(channels)
  ),
  constraint notifications_sms_body_check check (
    not ('sms' = any(channels)) or (char_length(body) <= 160 and body !~ '<[^>]+>')
  ),
  constraint notifications_entity_pair_check check (
    (entity_type is null and entity_id is null)
    or (entity_type is not null and entity_id is not null)
  )
);

create table if not exists public.rules (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name varchar(200) not null,
  description text,
  is_active boolean not null default true,
  trigger_event varchar(100) not null check (trigger_event ~ '^[a-z0-9-]+(\.[a-z0-9-]+)+$'),
  trigger_module varchar(50) not null,
  conditions jsonb not null,
  action_type varchar(50) not null
    check (action_type in ('send_notification', 'update_field', 'call_webhook', 'send_email')),
  action_config jsonb not null default '{}'::jsonb,
  max_retries integer not null default 3 check (max_retries between 0 and 10),
  retry_delay_seconds integer not null default 60 check (retry_delay_seconds > 0),
  execution_count integer not null default 0 check (execution_count >= 0),
  last_executed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint rules_conditions_object_check check (jsonb_typeof(conditions) = 'object'),
  constraint rules_action_config_object_check check (jsonb_typeof(action_config) = 'object')
);

create table if not exists public.rule_runs (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  rule_id uuid not null references public.rules(id) on delete cascade,
  event_id uuid not null references public.event_outbox(id) on delete cascade,
  status varchar(20) not null
    check (status in ('queued', 'matched', 'skipped', 'succeeded', 'failed', 'retrying')),
  idempotency_key varchar(160) not null unique,
  attempt_number integer not null default 1 check (attempt_number > 0),
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_templates (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  code varchar(100) not null check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name varchar(200) not null,
  subject varchar(300) not null,
  body_html text not null,
  body_text text,
  variables jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  is_system boolean not null default false,
  locale varchar(10) not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint email_templates_variables_array_check check (jsonb_typeof(variables) = 'array')
);

create table if not exists public.integrations (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider varchar(50) not null
    check (provider in ('stripe', 'resend', 'openrouter', 'inngest', 'recaptcha', 's3', 'r2', 'custom')),
  name varchar(200) not null,
  config jsonb not null default '{}'::jsonb,
  credentials jsonb not null,
  status varchar(20) not null default 'active' check (status in ('active', 'inactive', 'error')),
  last_tested_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint integrations_config_object_check check (jsonb_typeof(config) = 'object'),
  constraint integrations_credentials_envelope_check check (app_private.is_encrypted_envelope(credentials))
);

create table if not exists public.webhooks (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name varchar(200) not null,
  url text not null,
  secret_encrypted jsonb not null,
  events text[] not null,
  is_active boolean not null default true,
  last_triggered_at timestamptz,
  failure_count integer not null default 0 check (failure_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint webhooks_https_url_check check (url ~ '^https://'),
  constraint webhooks_events_check check (array_length(events, 1) > 0),
  constraint webhooks_secret_envelope_check check (app_private.is_encrypted_envelope(secret_encrypted))
);

create table if not exists public.webhook_deliveries (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  webhook_id uuid not null references public.webhooks(id) on delete cascade,
  event varchar(100) not null check (event ~ '^[a-z0-9-]+(\.[a-z0-9-]+)+$'),
  payload jsonb not null default '{}'::jsonb,
  response_status integer check (response_status between 100 and 599),
  response_body text,
  attempt_number integer not null default 1 check (attempt_number > 0),
  status varchar(20) not null check (status in ('delivered', 'failed', 'retrying')),
  attempted_at timestamptz not null,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  constraint webhook_deliveries_delivered_check check (status <> 'delivered' or delivered_at is not null)
);

create table if not exists public.imports (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  module_code varchar(50) not null,
  file_name varchar(300) not null,
  file_url text not null,
  file_format varchar(10) not null check (file_format in ('csv', 'xlsx')),
  column_mapping jsonb not null default '{}'::jsonb,
  total_rows integer check (total_rows >= 0),
  processed_rows integer not null default 0 check (processed_rows >= 0),
  success_count integer not null default 0 check (success_count >= 0),
  error_count integer not null default 0 check (error_count >= 0),
  errors jsonb not null default '[]'::jsonb,
  status varchar(20) not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  constraint imports_row_counts_check check (total_rows is null or processed_rows <= total_rows),
  constraint imports_mapping_object_check check (jsonb_typeof(column_mapping) = 'object'),
  constraint imports_errors_array_check check (jsonb_typeof(errors) = 'array'),
  constraint imports_completed_at_check check (status <> 'completed' or completed_at is not null)
);

create table if not exists public.exports (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  module_code varchar(50) not null,
  file_name varchar(300),
  file_url text,
  file_format varchar(10) not null check (file_format in ('csv', 'xlsx')),
  filters_applied jsonb not null default '{}'::jsonb,
  total_rows integer check (total_rows >= 0),
  status varchar(20) not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  download_expires_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  constraint exports_filters_object_check check (jsonb_typeof(filters_applied) = 'object'),
  constraint exports_completed_file_check check (
    status <> 'completed'
    or (file_url is not null and download_expires_at is not null and completed_at is not null)
  )
);

create index if not exists event_outbox_pending_idx
  on public.event_outbox (status, occurred_at) where status in ('pending', 'failed');
create index if not exists job_runs_tenant_status_idx
  on public.job_runs (tenant_id, status, created_at desc);
create index if not exists notifications_user_unread_idx
  on public.notifications (tenant_id, user_id, read_at) where archived_at is null;
create index if not exists rules_tenant_trigger_idx
  on public.rules (tenant_id, trigger_module, trigger_event) where deleted_at is null and is_active = true;
create index if not exists rule_runs_rule_idx
  on public.rule_runs (tenant_id, rule_id, created_at desc);
create unique index if not exists email_templates_scope_code_locale_unique
  on public.email_templates (coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid), code, locale)
  where deleted_at is null;
create index if not exists integrations_tenant_provider_idx
  on public.integrations (tenant_id, provider) where deleted_at is null;
create index if not exists webhooks_tenant_active_idx
  on public.webhooks (tenant_id, is_active) where deleted_at is null;
create index if not exists webhook_deliveries_webhook_idx
  on public.webhook_deliveries (tenant_id, webhook_id, attempted_at desc);
create index if not exists imports_tenant_status_idx
  on public.imports (tenant_id, status, created_at desc);
create index if not exists exports_tenant_status_idx
  on public.exports (tenant_id, status, created_at desc);

create or replace function app_private.expire_export_downloads()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  expired_count integer := 0;
  result jsonb;
begin
  with expired_exports as (
    update public.exports
    set file_url = null,
        updated_at = now()
    where status = 'completed'
      and download_expires_at is not null
      and download_expires_at < now()
      and file_url is not null
    returning 1
  )
  select count(*) into expired_count from expired_exports;

  result := jsonb_build_object(
    'job', 'fromzero-expire-export-downloads',
    'records_processed', expired_count
  );

  insert into public.logs (tenant_id, action, entity_type, entity_id, auth_method, metadata)
  values (
    null,
    'export.downloads_expired',
    'export',
    null,
    'system',
    result
  );

  return result;
end;
$$;

drop trigger if exists event_outbox_touch_updated_at on public.event_outbox;
create trigger event_outbox_touch_updated_at
  before update on public.event_outbox
  for each row execute function app_private.touch_updated_at();

drop trigger if exists job_runs_touch_updated_at on public.job_runs;
create trigger job_runs_touch_updated_at
  before update on public.job_runs
  for each row execute function app_private.touch_updated_at();

drop trigger if exists notifications_touch_updated_at on public.notifications;
create trigger notifications_touch_updated_at
  before update on public.notifications
  for each row execute function app_private.touch_updated_at();

drop trigger if exists rules_touch_updated_at on public.rules;
create trigger rules_touch_updated_at
  before update on public.rules
  for each row execute function app_private.touch_updated_at();

drop trigger if exists email_templates_touch_updated_at on public.email_templates;
create trigger email_templates_touch_updated_at
  before update on public.email_templates
  for each row execute function app_private.touch_updated_at();

drop trigger if exists integrations_touch_updated_at on public.integrations;
create trigger integrations_touch_updated_at
  before update on public.integrations
  for each row execute function app_private.touch_updated_at();

drop trigger if exists webhooks_touch_updated_at on public.webhooks;
create trigger webhooks_touch_updated_at
  before update on public.webhooks
  for each row execute function app_private.touch_updated_at();

drop trigger if exists imports_touch_updated_at on public.imports;
create trigger imports_touch_updated_at
  before update on public.imports
  for each row execute function app_private.touch_updated_at();

drop trigger if exists exports_touch_updated_at on public.exports;
create trigger exports_touch_updated_at
  before update on public.exports
  for each row execute function app_private.touch_updated_at();

drop trigger if exists event_outbox_audit_foundation_mutation on public.event_outbox;
create trigger event_outbox_audit_foundation_mutation
  after insert or update or delete on public.event_outbox
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists job_runs_audit_foundation_mutation on public.job_runs;
create trigger job_runs_audit_foundation_mutation
  after insert or update or delete on public.job_runs
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists notifications_audit_foundation_mutation on public.notifications;
create trigger notifications_audit_foundation_mutation
  after insert or update or delete on public.notifications
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists rules_audit_foundation_mutation on public.rules;
create trigger rules_audit_foundation_mutation
  after insert or update or delete on public.rules
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists rule_runs_audit_foundation_mutation on public.rule_runs;
create trigger rule_runs_audit_foundation_mutation
  after insert or update or delete on public.rule_runs
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists integrations_audit_foundation_mutation on public.integrations;
create trigger integrations_audit_foundation_mutation
  after insert or update or delete on public.integrations
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists webhooks_audit_foundation_mutation on public.webhooks;
create trigger webhooks_audit_foundation_mutation
  after insert or update or delete on public.webhooks
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists webhook_deliveries_audit_foundation_mutation on public.webhook_deliveries;
create trigger webhook_deliveries_audit_foundation_mutation
  after insert or update or delete on public.webhook_deliveries
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists imports_audit_foundation_mutation on public.imports;
create trigger imports_audit_foundation_mutation
  after insert or update or delete on public.imports
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists exports_audit_foundation_mutation on public.exports;
create trigger exports_audit_foundation_mutation
  after insert or update or delete on public.exports
  for each row execute function app_private.audit_foundation_mutation();

alter table public.event_outbox enable row level security;
alter table public.job_runs enable row level security;
alter table public.notifications enable row level security;
alter table public.rules enable row level security;
alter table public.rule_runs enable row level security;
alter table public.email_templates enable row level security;
alter table public.integrations enable row level security;
alter table public.webhooks enable row level security;
alter table public.webhook_deliveries enable row level security;
alter table public.imports enable row level security;
alter table public.exports enable row level security;

drop policy if exists notifications_select_policy on public.notifications;
create policy notifications_select_policy
  on public.notifications
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or (
      tenant_id = app_private.current_tenant_id()
      and user_id = auth.uid()
    )
  );

drop policy if exists rules_select_policy on public.rules;
create policy rules_select_policy
  on public.rules
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists email_templates_select_policy on public.email_templates;
create policy email_templates_select_policy
  on public.email_templates
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists integrations_select_policy on public.integrations;
create policy integrations_select_policy
  on public.integrations
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists webhooks_select_policy on public.webhooks;
create policy webhooks_select_policy
  on public.webhooks
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists imports_select_policy on public.imports;
create policy imports_select_policy
  on public.imports
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists exports_select_policy on public.exports;
create policy exports_select_policy
  on public.exports
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

select cron.schedule('fromzero-expire-export-downloads', '45 * * * *', $$select app_private.expire_export_downloads();$$)
where not exists (select 1 from cron.job where jobname = 'fromzero-expire-export-downloads');

grant select on public.notifications, public.rules, public.email_templates, public.integrations, public.webhooks, public.imports, public.exports to authenticated;
grant all privileges on public.event_outbox to service_role;
grant all privileges on public.job_runs to service_role;
grant all privileges on public.notifications to service_role;
grant all privileges on public.rules to service_role;
grant all privileges on public.rule_runs to service_role;
grant all privileges on public.email_templates to service_role;
grant all privileges on public.integrations to service_role;
grant all privileges on public.webhooks to service_role;
grant all privileges on public.webhook_deliveries to service_role;
grant all privileges on public.imports to service_role;
grant all privileges on public.exports to service_role;
grant execute on function app_private.is_encrypted_envelope(jsonb) to service_role;
grant execute on function app_private.expire_export_downloads() to service_role;

revoke all on public.event_outbox from anon;
revoke all on public.job_runs from anon;
revoke all on public.notifications from anon;
revoke all on public.rules from anon;
revoke all on public.rule_runs from anon;
revoke all on public.email_templates from anon;
revoke all on public.integrations from anon;
revoke all on public.webhooks from anon;
revoke all on public.webhook_deliveries from anon;
revoke all on public.imports from anon;
revoke all on public.exports from anon;
