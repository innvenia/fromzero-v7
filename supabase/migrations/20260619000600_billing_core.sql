-- From Zero Framework v7.4 Sprint 6 billing core schema.
-- Local-only migration: subscriptions, statements, invoices, RLS, billing jobs, pg_cron schedules, and invoice immutability.

create extension if not exists pg_cron with schema extensions;

create table if not exists public.subscriptions (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  entity_type varchar(10) not null check (entity_type in ('tenant', 'user')),
  entity_id uuid not null,
  plan_id uuid not null references public.plans(id) on delete restrict,
  status varchar(20) not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'expired', 'canceled', 'suspended')),
  billing_cycle varchar(10) not null default 'monthly' check (billing_cycle in ('monthly', 'yearly')),
  external_subscription_id text unique,
  payment_method_id varchar(200),
  starts_at timestamptz not null default now(),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  trial_ends_at timestamptz,
  canceled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint subscriptions_tenant_entity_check check (
    (entity_type = 'tenant' and entity_id = tenant_id)
    or entity_type = 'user'
  )
);

create table if not exists public.statements (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  currency char(3) not null default 'USD',
  line_items jsonb not null default '[]'::jsonb,
  status varchar(20) not null default 'draft' check (status in ('draft', 'finalized', 'paid', 'voided')),
  payment_method_id varchar(200),
  generated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint statements_period_check check (period_end > period_start)
);

create table if not exists public.invoices (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  statement_id uuid not null references public.statements(id) on delete restrict,
  invoice_number varchar(80) not null,
  external_invoice_id text unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null default 'USD',
  description text not null,
  status varchar(20) not null default 'processed' check (status in ('processed', 'voided', 'reversed')),
  paid_at timestamptz,
  voided_at timestamptz,
  reversed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  constraint invoices_tenant_number_unique unique (tenant_id, invoice_number)
);

create index if not exists subscriptions_tenant_status_idx
  on public.subscriptions (tenant_id, status) where deleted_at is null;
create index if not exists subscriptions_external_subscription_id_idx
  on public.subscriptions (external_subscription_id) where external_subscription_id is not null;
create index if not exists subscriptions_trial_ends_at_idx
  on public.subscriptions (trial_ends_at) where status = 'trialing';
create index if not exists statements_tenant_period_idx
  on public.statements (tenant_id, period_start desc, period_end desc);
create index if not exists statements_status_idx
  on public.statements (status);
create index if not exists invoices_tenant_status_idx
  on public.invoices (tenant_id, status);
create index if not exists invoices_statement_id_idx
  on public.invoices (statement_id);
create index if not exists invoices_external_invoice_id_idx
  on public.invoices (external_invoice_id) where external_invoice_id is not null;

create or replace function app_private.prevent_invoice_content_mutation()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is distinct from old.tenant_id
    or new.statement_id is distinct from old.statement_id
    or new.invoice_number is distinct from old.invoice_number
    or new.external_invoice_id is distinct from old.external_invoice_id
    or new.amount is distinct from old.amount
    or new.currency is distinct from old.currency
    or new.description is distinct from old.description
    or new.paid_at is distinct from old.paid_at then
    raise exception 'invoice content is immutable';
  end if;

  return new;
end;
$$;

create or replace function app_private.expire_api_keys()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected_count integer;
begin
  update public.api_keys
  set is_active = false,
      updated_at = now()
  where is_active
    and deleted_at is null
    and expires_at is not null
    and expires_at <= now();

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

create or replace function app_private.enqueue_trial_reminders()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected_count integer;
begin
  insert into public.logs (tenant_id, action, entity_type, entity_id, auth_method, metadata)
  select
    s.tenant_id,
    'subscription.trial_reminder',
    'subscription',
    s.id,
    'system',
    jsonb_build_object(
      'source', 'pg_cron',
      'trial_ends_at', s.trial_ends_at,
      'days_remaining', (s.trial_ends_at::date - current_date)
    )
  from public.subscriptions s
  where s.status = 'trialing'
    and s.trial_ends_at is not null
    and (s.trial_ends_at::date - current_date) in (7, 3, 1)
    and not exists (
      select 1
      from public.logs l
      where l.entity_type = 'subscription'
        and l.entity_id = s.id
        and l.action = 'subscription.trial_reminder'
        and l.metadata ->> 'days_remaining' = (s.trial_ends_at::date - current_date)::text
    );

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

create or replace function app_private.expire_trial_subscriptions()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected_count integer;
begin
  with free_plan as (
    select id, code
    from public.plans
    where deleted_at is null
      and is_active
      and (code = 'free' or is_freemium)
    order by case when code = 'free' then 0 else 1 end, sort_order nulls last
    limit 1
  )
  update public.subscriptions s
  set plan_id = coalesce((select id from free_plan), s.plan_id),
      status = case
        when exists (select 1 from free_plan) then 'active'
        else 'expired'
      end,
      metadata = s.metadata || jsonb_build_object(
        'expiry_action',
        case
          when exists (select 1 from free_plan) then 'degrade_to_free'
          else 'expired_without_free_plan'
        end,
        'processed_by',
        'app_private.expire_trial_subscriptions'
      ),
      updated_at = now()
  where s.status = 'trialing'
    and s.trial_ends_at is not null
    and s.trial_ends_at <= now();

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function app_private.touch_updated_at();

drop trigger if exists statements_touch_updated_at on public.statements;
create trigger statements_touch_updated_at
  before update on public.statements
  for each row execute function app_private.touch_updated_at();

drop trigger if exists invoices_touch_updated_at on public.invoices;
create trigger invoices_touch_updated_at
  before update on public.invoices
  for each row execute function app_private.touch_updated_at();

drop trigger if exists invoices_prevent_content_update on public.invoices;
create trigger invoices_prevent_content_update
  before update on public.invoices
  for each row execute function app_private.prevent_invoice_content_mutation();

drop trigger if exists subscriptions_audit_foundation_mutation on public.subscriptions;
create trigger subscriptions_audit_foundation_mutation
  after insert or update or delete on public.subscriptions
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists statements_audit_foundation_mutation on public.statements;
create trigger statements_audit_foundation_mutation
  after insert or update or delete on public.statements
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists invoices_audit_foundation_mutation on public.invoices;
create trigger invoices_audit_foundation_mutation
  after insert or update or delete on public.invoices
  for each row execute function app_private.audit_foundation_mutation();

alter table public.subscriptions enable row level security;
alter table public.statements enable row level security;
alter table public.invoices enable row level security;

drop policy if exists subscriptions_select_policy on public.subscriptions;
create policy subscriptions_select_policy
  on public.subscriptions
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists statements_select_policy on public.statements;
create policy statements_select_policy
  on public.statements
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists invoices_select_policy on public.invoices;
create policy invoices_select_policy
  on public.invoices
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

select cron.schedule('fromzero-expire-api-keys', '*/15 * * * *', $$select app_private.expire_api_keys();$$)
where not exists (select 1 from cron.job where jobname = 'fromzero-expire-api-keys');

select cron.schedule('fromzero-send-trial-reminders', '0 9 * * *', $$select app_private.enqueue_trial_reminders();$$)
where not exists (select 1 from cron.job where jobname = 'fromzero-send-trial-reminders');

select cron.schedule('fromzero-expire-trials', '15 0 * * *', $$select app_private.expire_trial_subscriptions();$$)
where not exists (select 1 from cron.job where jobname = 'fromzero-expire-trials');

grant select on public.subscriptions, public.statements, public.invoices to authenticated;
grant all privileges on public.subscriptions to service_role;
grant all privileges on public.statements to service_role;
grant all privileges on public.invoices to service_role;
grant execute on function app_private.prevent_invoice_content_mutation() to service_role;
grant execute on function app_private.expire_api_keys() to service_role;
grant execute on function app_private.enqueue_trial_reminders() to service_role;
grant execute on function app_private.expire_trial_subscriptions() to service_role;

revoke all on public.subscriptions from anon;
revoke all on public.statements from anon;
revoke all on public.invoices from anon;
