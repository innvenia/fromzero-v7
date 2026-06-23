-- From Zero Framework v7.4 Sprint 9 Core AI and OpenRouter.
-- Cloud/dev migration: model catalog, AI budget caps, explicit grants, RLS, and safe default seed.

create table if not exists public.ai_models (
  id uuid primary key default extensions.gen_random_uuid(),
  name varchar(100) not null,
  provider varchar(50) not null
    check (provider in ('openrouter', 'openai', 'anthropic', 'google', 'azure', 'ollama', 'custom')),
  model_id varchar(160) not null,
  endpoint_url text,
  default_parameters jsonb not null default '{}'::jsonb,
  pricing_unit varchar(10) not null default 'per_1m'
    check (pricing_unit in ('per_1k', 'per_1m')),
  currency varchar(3) not null default 'USD',
  cost_input numeric(12, 6) not null default 0 check (cost_input >= 0),
  cost_output numeric(12, 6) not null default 0 check (cost_output >= 0),
  context_window integer not null check (context_window > 0),
  max_input_tokens integer check (max_input_tokens is null or max_input_tokens > 0),
  max_tokens integer check (max_tokens is null or max_tokens > 0),
  max_cost_per_request numeric(12, 6) check (max_cost_per_request is null or max_cost_per_request >= 0),
  request_timeout_seconds integer check (request_timeout_seconds is null or request_timeout_seconds > 0),
  supports_streaming boolean not null default false,
  input_modalities jsonb not null default '["text"]'::jsonb,
  deprecated_at timestamptz,
  fallback_model_id uuid references public.ai_models(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint ai_models_provider_model_id_unique unique (provider, model_id),
  constraint ai_models_endpoint_https_check check (endpoint_url is null or endpoint_url ~ '^https://'),
  constraint ai_models_parameters_object_check check (jsonb_typeof(default_parameters) = 'object'),
  constraint ai_models_modalities_array_check check (jsonb_typeof(input_modalities) = 'array'),
  constraint ai_models_input_context_check check (max_input_tokens is null or max_input_tokens <= context_window),
  constraint ai_models_output_context_check check (max_tokens is null or max_tokens <= context_window)
);

create table if not exists public.ai_budgets (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  feature_key varchar(120),
  scope varchar(20) not null check (scope in ('global', 'tenant', 'provider', 'model', 'user', 'feature')),
  provider varchar(50)
    check (provider is null or provider in ('openrouter', 'openai', 'anthropic', 'google', 'azure', 'ollama', 'custom')),
  ai_model_id uuid references public.ai_models(id) on delete cascade,
  period varchar(20) not null check (period in ('day', 'month', 'total')),
  max_spend numeric(12, 6) not null check (max_spend >= 0),
  spend_to_date numeric(12, 6) not null default 0 check (spend_to_date >= 0),
  currency varchar(3) not null default 'USD',
  on_exceed varchar(10) not null default 'block' check (on_exceed in ('block', 'warn')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint ai_budgets_tenant_scope_check check (scope <> 'tenant' or tenant_id is not null),
  constraint ai_budgets_user_scope_check check (scope <> 'user' or user_id is not null),
  constraint ai_budgets_feature_scope_check check (scope <> 'feature' or feature_key is not null),
  constraint ai_budgets_provider_scope_check check (scope <> 'provider' or provider is not null),
  constraint ai_budgets_model_scope_check check (scope <> 'model' or ai_model_id is not null)
);

create index if not exists ai_models_provider_active_idx
  on public.ai_models (provider, is_active) where deleted_at is null;
create index if not exists ai_models_model_id_idx
  on public.ai_models (model_id);
create index if not exists ai_budgets_tenant_scope_idx
  on public.ai_budgets (tenant_id, scope, is_active) where deleted_at is null;
create index if not exists ai_budgets_model_idx
  on public.ai_budgets (ai_model_id, is_active) where deleted_at is null;
create index if not exists ai_budgets_user_feature_idx
  on public.ai_budgets (tenant_id, user_id, feature_key) where deleted_at is null;

drop trigger if exists ai_models_touch_updated_at on public.ai_models;
create trigger ai_models_touch_updated_at
  before update on public.ai_models
  for each row execute function app_private.touch_updated_at();

drop trigger if exists ai_budgets_touch_updated_at on public.ai_budgets;
create trigger ai_budgets_touch_updated_at
  before update on public.ai_budgets
  for each row execute function app_private.touch_updated_at();

alter table public.ai_models enable row level security;
alter table public.ai_budgets enable row level security;

drop policy if exists ai_models_select_policy on public.ai_models;
create policy ai_models_select_policy
  on public.ai_models
  for select
  to authenticated
  using (is_active and deleted_at is null);

drop policy if exists ai_budgets_select_policy on public.ai_budgets;
create policy ai_budgets_select_policy
  on public.ai_budgets
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or (
      tenant_id = app_private.current_tenant_id()
      and app_private.has_permission('view', 'ai-model')
    )
  );

drop policy if exists ai_budgets_update_policy on public.ai_budgets;
create policy ai_budgets_update_policy
  on public.ai_budgets
  for update
  to authenticated
  using (app_private.is_super_admin())
  with check (app_private.is_super_admin());

insert into public.ai_models (
  name,
  provider,
  model_id,
  endpoint_url,
  default_parameters,
  pricing_unit,
  currency,
  cost_input,
  cost_output,
  context_window,
  max_input_tokens,
  max_tokens,
  max_cost_per_request,
  request_timeout_seconds,
  supports_streaming,
  input_modalities,
  is_active
) values (
  'Google Gemma 4 26B A4B Free',
  'openrouter',
  'google/gemma-4-26b-a4b-it:free',
  'https://openrouter.ai/api/v1/chat/completions',
  '{"temperature":0.2}'::jsonb,
  'per_1m',
  'USD',
  0,
  0,
  262144,
  200000,
  4096,
  0.25,
  30,
  false,
  '["text","image","video"]'::jsonb,
  true
)
on conflict (provider, model_id) do update
set name = excluded.name,
    endpoint_url = excluded.endpoint_url,
    default_parameters = excluded.default_parameters,
    pricing_unit = excluded.pricing_unit,
    currency = excluded.currency,
    cost_input = excluded.cost_input,
    cost_output = excluded.cost_output,
    context_window = excluded.context_window,
    max_input_tokens = excluded.max_input_tokens,
    max_tokens = excluded.max_tokens,
    max_cost_per_request = excluded.max_cost_per_request,
    request_timeout_seconds = excluded.request_timeout_seconds,
    supports_streaming = excluded.supports_streaming,
    input_modalities = excluded.input_modalities,
    is_active = excluded.is_active,
    updated_at = now();

grant select on public.ai_models to authenticated;
grant select on public.ai_budgets to authenticated;
grant update on public.ai_budgets to authenticated;
grant all privileges on public.ai_models, public.ai_budgets to service_role;

revoke all on public.ai_models from anon;
revoke all on public.ai_budgets from anon;
