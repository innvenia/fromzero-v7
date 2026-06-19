-- From Zero Framework v7.4 Sprint 7 storage, documents, shared modules, and consent schema.
-- Local-only migration: storage buckets, files, documents, tags, bookmarks, consent records, RLS, and soft-delete purge schedule.

create extension if not exists pg_cron with schema extensions;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'public_assets',
    'public_assets',
    true,
    26214400,
    array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']::text[]
  ),
  (
    'private_documents',
    'private_documents',
    false,
    26214400,
    array[
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]::text[]
  ),
  (
    'imports',
    'imports',
    false,
    26214400,
    array[
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]::text[]
  ),
  (
    'exports',
    'exports',
    false,
    26214400,
    array[
      'text/csv',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]::text[]
  )
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.documents (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title varchar(300) not null,
  slug varchar(300) not null,
  content text,
  excerpt text,
  category varchar(100),
  status varchar(20) not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_pinned boolean not null default false,
  published_at timestamptz,
  custom_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint documents_tenant_slug_unique unique (tenant_id, slug),
  constraint documents_published_at_check check (status <> 'published' or published_at is not null)
);

create table if not exists public.document_versions (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  title varchar(300) not null,
  slug varchar(300) not null,
  content text,
  excerpt text,
  category varchar(100),
  status varchar(20) not null check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  change_summary text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint document_versions_tenant_document_version_unique unique (tenant_id, document_id, version_number)
);

create table if not exists public.files (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  file_name varchar(300) not null,
  storage_bucket varchar(64) not null
    check (storage_bucket in ('public_assets', 'private_documents', 'imports', 'exports')),
  storage_key text not null,
  file_url text not null,
  file_size bigint not null check (file_size >= 0),
  mime_type varchar(100) not null,
  entity_type varchar(50),
  entity_id uuid,
  is_public boolean not null default false,
  thumbnail_url text,
  file_group_id uuid not null default extensions.gen_random_uuid(),
  version integer not null default 1 check (version > 0),
  previous_version_id uuid references public.files(id) on delete set null,
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint files_entity_pair_check check (
    (entity_type is null and entity_id is null)
    or (entity_type is not null and entity_id is not null)
  )
);

create table if not exists public.tags (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name varchar(100) not null,
  color varchar(7) check (color is null or color ~ '^#[0-9A-Fa-f]{6}$'),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null
);

create table if not exists public.taggables (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  entity_type varchar(50) not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  constraint taggables_target_unique unique (tenant_id, tag_id, entity_type, entity_id)
);

create table if not exists public.bookmarks (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  entity_type varchar(50) not null,
  entity_id uuid not null,
  display_label varchar(200) not null,
  sort_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  restored_at timestamptz,
  restored_by uuid references auth.users(id) on delete set null,
  constraint bookmarks_target_unique unique (user_id, tenant_id, entity_type, entity_id)
);

create table if not exists public.consent_records (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type varchar(40) not null
    check (consent_type in (
      'terms_of_service',
      'privacy_policy',
      'cookie_analytics',
      'cookie_functionality',
      'marketing',
      'security'
    )),
  accepted_at timestamptz not null default now(),
  revoked_at timestamptz,
  document_id uuid references public.documents(id) on delete set null,
  document_version_id uuid references public.document_versions(id) on delete set null,
  ip_address inet not null,
  user_agent text not null,
  metadata jsonb not null default '{}'::jsonb,
  constraint consent_records_revocation_check check (revoked_at is null or revoked_at >= accepted_at)
);

create index if not exists documents_tenant_deleted_idx
  on public.documents (tenant_id, deleted_at);
create index if not exists documents_status_idx
  on public.documents (tenant_id, status) where deleted_at is null;
create index if not exists document_versions_document_idx
  on public.document_versions (tenant_id, document_id, version_number desc);
create index if not exists files_tenant_deleted_idx
  on public.files (tenant_id, deleted_at);
create index if not exists files_entity_idx
  on public.files (tenant_id, entity_type, entity_id) where deleted_at is null;
create unique index if not exists files_current_version_unique
  on public.files (tenant_id, file_group_id)
  where is_current = true;
create index if not exists tags_tenant_deleted_idx
  on public.tags (tenant_id, deleted_at);
create unique index if not exists tags_tenant_name_unique
  on public.tags (tenant_id, lower(name))
  where deleted_at is null;
create index if not exists taggables_entity_idx
  on public.taggables (tenant_id, entity_type, entity_id);
create index if not exists bookmarks_user_tenant_idx
  on public.bookmarks (user_id, tenant_id, sort_order) where deleted_at is null;
create index if not exists consent_records_user_tenant_idx
  on public.consent_records (user_id, tenant_id, consent_type, accepted_at desc);

create or replace function app_private.prevent_append_only_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'append-only records cannot be updated or deleted';
end;
$$;

create or replace function app_private.mark_previous_file_versions_not_current()
returns trigger
language plpgsql
as $$
begin
  if new.is_current then
    update public.files
    set is_current = false,
        updated_at = now()
    where tenant_id = new.tenant_id
      and file_group_id = new.file_group_id
      and id <> new.id
      and is_current = true;
  end if;

  return new;
end;
$$;

create or replace function app_private.purge_soft_deleted_records(preview boolean default true)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  retention_days integer;
  cutoff timestamptz;
  documents_count integer := 0;
  files_count integer := 0;
  tags_count integer := 0;
  bookmarks_count integer := 0;
  result jsonb;
begin
  select nullif(config #>> '{cleanup,soft_delete,auto_purge_days}', '')::integer
  into retention_days
  from public.settings
  where singleton_key = true
  limit 1;

  retention_days := coalesce(retention_days, 90);
  cutoff := now() - make_interval(days => retention_days);

  if preview then
    select count(*) into documents_count
    from public.documents
    where deleted_at is not null
      and deleted_at < cutoff;

    select count(*) into files_count
    from public.files
    where deleted_at is not null
      and deleted_at < cutoff;

    select count(*) into tags_count
    from public.tags
    where deleted_at is not null
      and deleted_at < cutoff;

    select count(*) into bookmarks_count
    from public.bookmarks
    where deleted_at is not null
      and deleted_at < cutoff;
  else
    with deleted_documents as (
      delete from public.documents
      where deleted_at is not null
        and deleted_at < cutoff
      returning 1
    )
    select count(*) into documents_count from deleted_documents;

    with deleted_files as (
      delete from public.files
      where deleted_at is not null
        and deleted_at < cutoff
      returning 1
    )
    select count(*) into files_count from deleted_files;

    with deleted_tags as (
      delete from public.tags
      where deleted_at is not null
        and deleted_at < cutoff
      returning 1
    )
    select count(*) into tags_count from deleted_tags;

    with deleted_bookmarks as (
      delete from public.bookmarks
      where deleted_at is not null
        and deleted_at < cutoff
      returning 1
    )
    select count(*) into bookmarks_count from deleted_bookmarks;
  end if;

  result := jsonb_build_object(
    'preview', preview,
    'retention_days', retention_days,
    'cutoff', cutoff,
    'records_processed', jsonb_build_object(
      'documents', documents_count,
      'files', files_count,
      'tags', tags_count,
      'bookmarks', bookmarks_count
    )
  );

  insert into public.logs (tenant_id, action, entity_type, entity_id, auth_method, metadata)
  values (
    null,
    case when preview then 'soft_delete.purge_preview' else 'soft_delete.purge_completed' end,
    'system',
    null,
    'system',
    result
  );

  return result;
end;
$$;

drop trigger if exists documents_touch_updated_at on public.documents;
create trigger documents_touch_updated_at
  before update on public.documents
  for each row execute function app_private.touch_updated_at();

drop trigger if exists files_touch_updated_at on public.files;
create trigger files_touch_updated_at
  before update on public.files
  for each row execute function app_private.touch_updated_at();

drop trigger if exists tags_touch_updated_at on public.tags;
create trigger tags_touch_updated_at
  before update on public.tags
  for each row execute function app_private.touch_updated_at();

drop trigger if exists bookmarks_touch_updated_at on public.bookmarks;
create trigger bookmarks_touch_updated_at
  before update on public.bookmarks
  for each row execute function app_private.touch_updated_at();

drop trigger if exists document_versions_prevent_mutation on public.document_versions;
create trigger document_versions_prevent_mutation
  before update or delete on public.document_versions
  for each row execute function app_private.prevent_append_only_mutation();

drop trigger if exists consent_records_prevent_mutation on public.consent_records;
create trigger consent_records_prevent_mutation
  before update or delete on public.consent_records
  for each row execute function app_private.prevent_append_only_mutation();

drop trigger if exists files_mark_previous_versions on public.files;
create trigger files_mark_previous_versions
  before insert or update on public.files
  for each row execute function app_private.mark_previous_file_versions_not_current();

drop trigger if exists documents_audit_foundation_mutation on public.documents;
create trigger documents_audit_foundation_mutation
  after insert or update or delete on public.documents
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists files_audit_foundation_mutation on public.files;
create trigger files_audit_foundation_mutation
  after insert or update or delete on public.files
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists tags_audit_foundation_mutation on public.tags;
create trigger tags_audit_foundation_mutation
  after insert or update or delete on public.tags
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists taggables_audit_foundation_mutation on public.taggables;
create trigger taggables_audit_foundation_mutation
  after insert or delete on public.taggables
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists bookmarks_audit_foundation_mutation on public.bookmarks;
create trigger bookmarks_audit_foundation_mutation
  after insert or update or delete on public.bookmarks
  for each row execute function app_private.audit_foundation_mutation();

drop trigger if exists consent_records_audit_foundation_mutation on public.consent_records;
create trigger consent_records_audit_foundation_mutation
  after insert on public.consent_records
  for each row execute function app_private.audit_foundation_mutation();

alter table public.documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.files enable row level security;
alter table public.tags enable row level security;
alter table public.taggables enable row level security;
alter table public.bookmarks enable row level security;
alter table public.consent_records enable row level security;

drop policy if exists documents_select_policy on public.documents;
create policy documents_select_policy
  on public.documents
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists document_versions_select_policy on public.document_versions;
create policy document_versions_select_policy
  on public.document_versions
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists files_select_policy on public.files;
create policy files_select_policy
  on public.files
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists tags_select_policy on public.tags;
create policy tags_select_policy
  on public.tags
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists taggables_select_policy on public.taggables;
create policy taggables_select_policy
  on public.taggables
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or tenant_id = app_private.current_tenant_id()
  );

drop policy if exists bookmarks_select_policy on public.bookmarks;
create policy bookmarks_select_policy
  on public.bookmarks
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or (
      tenant_id = app_private.current_tenant_id()
      and user_id = auth.uid()
    )
  );

drop policy if exists consent_records_select_policy on public.consent_records;
create policy consent_records_select_policy
  on public.consent_records
  for select
  to authenticated
  using (
    app_private.is_super_admin()
    or (
      tenant_id = app_private.current_tenant_id()
      and user_id = auth.uid()
    )
  );

select cron.schedule('fromzero-purge-soft-deletes', '30 2 * * *', $$select app_private.purge_soft_deleted_records(false);$$)
where not exists (select 1 from cron.job where jobname = 'fromzero-purge-soft-deletes');

grant select on public.documents, public.document_versions, public.files, public.tags, public.taggables, public.bookmarks, public.consent_records to authenticated;
grant all privileges on public.documents to service_role;
grant all privileges on public.document_versions to service_role;
grant all privileges on public.files to service_role;
grant all privileges on public.tags to service_role;
grant all privileges on public.taggables to service_role;
grant all privileges on public.bookmarks to service_role;
grant all privileges on public.consent_records to service_role;
grant execute on function app_private.prevent_append_only_mutation() to service_role;
grant execute on function app_private.mark_previous_file_versions_not_current() to service_role;
grant execute on function app_private.purge_soft_deleted_records(boolean) to service_role;

revoke all on public.documents from anon;
revoke all on public.document_versions from anon;
revoke all on public.files from anon;
revoke all on public.tags from anon;
revoke all on public.taggables from anon;
revoke all on public.bookmarks from anon;
revoke all on public.consent_records from anon;
