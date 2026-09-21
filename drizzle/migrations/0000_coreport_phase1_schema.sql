-- ============ ENUMS ============
create type public.app_role as enum ('customer','provider','admin');
create type public.kyc_status as enum ('unsubmitted','pending','approved','rejected');
create type public.node_status as enum ('online','offline','draining');
create type public.product_type as enum ('cpu_compute','gpu_compute','storage','game_server');
create type public.reliability_class as enum ('Standard','High','Verified','Certified');
create type public.availability_state as enum ('Available','Limited','Unavailable');
create type public.hosting_operator as enum ('peer','coreport');
create type public.deployment_status as enum ('draft','pending','queued','deploying','running','degraded','stopping','stopped','failed');
create type public.ledger_actor_type as enum ('customer','provider','platform');
create type public.ledger_entry_type as enum ('debit','credit','fee');
create type public.payout_status as enum ('pending','held','paid','failed');
create type public.recovery_event_type as enum ('failure_detected','recovery_started','recovered','escalated');
create type public.tier_category as enum ('cpu','gpu','storage','network');
create type public.availability_mode as enum ('background','idle','reserved','verified');

-- ============ IDENTITY ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- Roles live in a dedicated table (never on profiles) to prevent privilege escalation.
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin')
$$;

create policy "profiles self read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "user_roles self read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- profile row created by trigger, never by the client
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'customer')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create table public.provider_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  kyc_status public.kyc_status not null default 'unsubmitted',
  stripe_connect_account_id text,
  availability_mode public.availability_mode not null default 'background',
  minimum_payout_floor_cents integer not null default 0,
  payout_threshold_cents integer not null default 2500,
  resource_caps jsonb not null default '{}'::jsonb,
  quiet_hours jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.provider_profiles to authenticated;
grant all on public.provider_profiles to service_role;
alter table public.provider_profiles enable row level security;
create policy "provider self read" on public.provider_profiles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "provider self insert" on public.provider_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "provider self update" on public.provider_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============ HARDWARE AND SUPPLY (agent-written) ============
create table public.nodes (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references auth.users(id) on delete set null,
  label text not null,
  status public.node_status not null default 'offline',
  hardware_snapshot jsonb not null default '{}'::jsonb,
  cpu_score numeric, gpu_score numeric, storage_score numeric,
  network_score numeric, reliability_score numeric,
  cpu_tier text, gpu_tier text, storage_tier text, network_tier text,
  is_coreport_operated boolean not null default false,
  last_heartbeat_at timestamptz,
  created_at timestamptz not null default now()
);
grant select on public.nodes to authenticated;
grant all on public.nodes to service_role;
alter table public.nodes enable row level security;
-- read only for owners/admins; no client write policy at all (agent writes via service role)
create policy "nodes owner read" on public.nodes for select to authenticated using (provider_id = auth.uid() or public.is_admin());

create table public.benchmarks (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.nodes(id) on delete cascade,
  raw_measurements jsonb not null default '{}'::jsonb,
  normalized_scores jsonb not null default '{}'::jsonb,
  suite_version text,
  created_at timestamptz not null default now()
);
grant select on public.benchmarks to authenticated;
grant all on public.benchmarks to service_role;
alter table public.benchmarks enable row level security;
create policy "benchmarks owner read" on public.benchmarks for select to authenticated
using (public.is_admin() or exists (select 1 from public.nodes n where n.id = node_id and n.provider_id = auth.uid()));

create table public.service_listings (
  id uuid primary key default gen_random_uuid(),
  product_type public.product_type not null,
  title text not null,
  cpu_tier text, gpu_tier text, gpu_model text,
  vram_gb integer, vcpu integer, memory_gb integer,
  storage_gb integer, storage_tier text, network_tier text,
  region text not null,
  reliability public.reliability_class not null default 'Standard',
  availability public.availability_state not null default 'Available',
  hourly_usd numeric(10,4) not null,
  node_id uuid references public.nodes(id) on delete set null,
  hosting_operator public.hosting_operator not null default 'peer',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.service_listings to anon, authenticated;
grant all on public.service_listings to service_role;
alter table public.service_listings enable row level security;
create policy "listings public read" on public.service_listings for select to anon, authenticated using (active or public.is_admin());
create policy "listings admin write" on public.service_listings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============ DEMAND AND EXECUTION ============
create table public.deployments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid references public.service_listings(id) on delete set null,
  assigned_node_id uuid references public.nodes(id) on delete set null,
  status public.deployment_status not null default 'draft',
  reliability public.reliability_class not null default 'Standard',
  region text,
  resource_spec jsonb not null default '{}'::jsonb,
  endpoint text,
  started_at timestamptz,
  stopped_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.deployments to authenticated;
grant all on public.deployments to service_role;
alter table public.deployments enable row level security;
create policy "deployments customer read" on public.deployments for select to authenticated using (customer_id = auth.uid() or public.is_admin());
create policy "deployments customer insert" on public.deployments for insert to authenticated with check (customer_id = auth.uid());
create policy "deployments customer update" on public.deployments for update to authenticated using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create table public.price_quotes (
  id uuid primary key default gen_random_uuid(),
  deployment_id uuid not null references public.deployments(id) on delete cascade,
  quoted_price_cents integer not null,
  quoted_at timestamptz not null default now(),
  accepted boolean not null default false
);
grant select on public.price_quotes to authenticated;
grant all on public.price_quotes to service_role;
alter table public.price_quotes enable row level security;
create policy "quotes customer read" on public.price_quotes for select to authenticated
using (public.is_admin() or exists (select 1 from public.deployments d where d.id = deployment_id and d.customer_id = auth.uid()));

create table public.usage_samples (
  id uuid primary key default gen_random_uuid(),
  deployment_id uuid not null references public.deployments(id) on delete cascade,
  sampled_at timestamptz not null default now(),
  metered_seconds integer not null default 0,
  cpu_pct numeric, mem_mb integer
);
grant select on public.usage_samples to authenticated;
grant all on public.usage_samples to service_role;
alter table public.usage_samples enable row level security;
create policy "usage customer read" on public.usage_samples for select to authenticated
using (public.is_admin() or exists (select 1 from public.deployments d where d.id = deployment_id and d.customer_id = auth.uid()));

create table public.recovery_events (
  id uuid primary key default gen_random_uuid(),
  deployment_id uuid references public.deployments(id) on delete cascade,
  node_id uuid references public.nodes(id) on delete set null,
  event_type public.recovery_event_type not null,
  detected_at timestamptz not null default now(),
  recovered_at timestamptz,
  recovery_ms integer
);
grant select on public.recovery_events to authenticated;
grant all on public.recovery_events to service_role;
alter table public.recovery_events enable row level security;
create policy "recovery customer read" on public.recovery_events for select to authenticated
using (public.is_admin() or exists (select 1 from public.deployments d where d.id = deployment_id and d.customer_id = auth.uid()));

-- ============ MONEY ============
create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  actor_type public.ledger_actor_type not null,
  actor_id uuid,
  entry_type public.ledger_entry_type not null,
  amount_cents bigint not null,
  related_deployment_id uuid references public.deployments(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);
-- clients never write ledger rows
grant select on public.ledger_entries to authenticated;
grant all on public.ledger_entries to service_role;
alter table public.ledger_entries enable row level security;
create policy "ledger own rows read" on public.ledger_entries for select to authenticated
using (public.is_admin() or actor_id = auth.uid());

create or replace function public.ledger_append_only()
returns trigger language plpgsql as $$
begin
  raise exception 'ledger_entries is append-only: % is not permitted', tg_op;
end;
$$;
create trigger ledger_no_update before update on public.ledger_entries for each row execute function public.ledger_append_only();
create trigger ledger_no_delete before delete on public.ledger_entries for each row execute function public.ledger_append_only();

-- Balances are views over the ledger. Never stored columns.
create view public.customer_wallet_balances
with (security_invoker = true) as
select actor_id as customer_id,
       sum(case when entry_type = 'credit' then amount_cents else -amount_cents end) as balance_cents
from public.ledger_entries
where actor_type = 'customer'
group by actor_id;
grant select on public.customer_wallet_balances to authenticated;

create view public.provider_earnings_totals
with (security_invoker = true) as
select actor_id as provider_id,
       sum(case when entry_type = 'credit' then amount_cents else -amount_cents end) as accrued_cents,
       sum(case when entry_type = 'credit' and created_at < now() - interval '7 days' then amount_cents else 0 end) as available_cents,
       sum(case when entry_type = 'credit' and created_at >= now() - interval '7 days' then amount_cents else 0 end) as held_cents
from public.ledger_entries
where actor_type = 'provider'
group by actor_id;
grant select on public.provider_earnings_totals to authenticated;

create table public.customer_wallet_settings (
  customer_id uuid primary key references auth.users(id) on delete cascade,
  budget_cap_cents integer,
  auto_stop_enabled boolean not null default true,
  auto_stop_buffer_cents integer not null default 200
);
grant select, insert, update on public.customer_wallet_settings to authenticated;
grant all on public.customer_wallet_settings to service_role;
alter table public.customer_wallet_settings enable row level security;
create policy "wallet settings self" on public.customer_wallet_settings for select to authenticated using (customer_id = auth.uid() or public.is_admin());
create policy "wallet settings self insert" on public.customer_wallet_settings for insert to authenticated with check (customer_id = auth.uid());
create policy "wallet settings self update" on public.customer_wallet_settings for update to authenticated using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null,
  status public.payout_status not null default 'pending',
  stripe_transfer_id text,
  threshold_met_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
grant select on public.payouts to authenticated;
grant all on public.payouts to service_role;
alter table public.payouts enable row level security;
create policy "payouts provider read" on public.payouts for select to authenticated using (provider_id = auth.uid() or public.is_admin());
create policy "payouts admin write" on public.payouts for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table public.kyc_records (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  status public.kyc_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_by_admin_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  notes text
);
grant select, insert on public.kyc_records to authenticated;
grant all on public.kyc_records to service_role;
alter table public.kyc_records enable row level security;
create policy "kyc provider read" on public.kyc_records for select to authenticated using (provider_id = auth.uid() or public.is_admin());
create policy "kyc provider insert" on public.kyc_records for insert to authenticated with check (provider_id = auth.uid());
create policy "kyc admin update" on public.kyc_records for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============ CONFIGURATION (publicly readable, admin writable) ============
create table public.pricing_config (
  id uuid primary key default gen_random_uuid(),
  product_type public.product_type not null,
  host_pool_pct numeric(5,2) not null,
  platform_take_pct numeric(5,2) not null,
  effective_from timestamptz not null default now()
);
create table public.tier_config (
  id uuid primary key default gen_random_uuid(),
  tier_code text not null,
  category public.tier_category not null,
  qualification jsonb not null default '{}'::jsonb,
  updated_by_admin_id uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (tier_code, category)
);
create table public.service_rates (
  id uuid primary key default gen_random_uuid(),
  service_key text not null unique,
  label text not null,
  product public.product_type not null,
  host_pool_rate_usd numeric(10,4) not null
);
create table public.availability_mode_config (
  id uuid primary key default gen_random_uuid(),
  mode public.availability_mode not null unique,
  label text not null,
  description text not null,
  rate_multiplier numeric(4,2) not null default 1.0,
  utilization_low numeric(5,2), utilization_high numeric(5,2)
);
create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  enabled boolean not null default false,
  description text,
  expires_at timestamptz
);
create table public.status_components (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null default 'operational',
  description text,
  sort_order integer not null default 0
);
create table public.status_incidents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  severity text not null default 'minor',
  state text not null default 'investigating',
  started_at timestamptz not null default now(),
  resolved_at timestamptz
);
create table public.competitor_prices (
  id uuid primary key default gen_random_uuid(),
  competitor text not null,
  product public.product_type not null,
  item text not null,
  figure text not null,
  source_url text,
  date_checked date not null
);
create table public.build_milestones (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text,
  state text not null default 'planned',
  sort_order integer not null default 0
);
create table public.legal_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['pricing_config','tier_config','service_rates','availability_mode_config','feature_flags','status_components','status_incidents','competitor_prices','build_milestones','legal_pages']
  loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%s public read" on public.%I for select to anon, authenticated using (true)', t, t);
    execute format('create policy "%s admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- ============ OPERATIONS ============
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  body text,
  status text not null default 'open',
  priority text not null default 'normal',
  assigned_admin_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.support_tickets to authenticated;
grant all on public.support_tickets to service_role;
alter table public.support_tickets enable row level security;
create policy "tickets own read" on public.support_tickets for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "tickets own insert" on public.support_tickets for insert to authenticated with check (user_id = auth.uid());
create policy "tickets admin update" on public.support_tickets for update to authenticated using (public.is_admin()) with check (public.is_admin());

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select on public.audit_events to authenticated;
grant all on public.audit_events to service_role;
alter table public.audit_events enable row level security;
create policy "audit admin read" on public.audit_events for select to authenticated using (public.is_admin());
create policy "audit admin insert" on public.audit_events for insert to authenticated with check (public.is_admin());

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  label text,
  key_hash text not null,
  scopes text[] not null default '{}',
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);
grant select, insert, update on public.api_keys to authenticated;
grant all on public.api_keys to service_role;
alter table public.api_keys enable row level security;
create policy "keys own read" on public.api_keys for select to authenticated using (customer_id = auth.uid() or public.is_admin());
create policy "keys own insert" on public.api_keys for insert to authenticated with check (customer_id = auth.uid());
create policy "keys own update" on public.api_keys for update to authenticated using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- generic admin-write audit helper
create or replace function public.log_admin_write()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_events (actor_admin_id, action, target_type, target_id)
  values (auth.uid(), lower(tg_op), tg_table_name, coalesce((case when tg_op = 'DELETE' then old.id else new.id end)::text, ''));
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;
create trigger audit_pricing_config after insert or update or delete on public.pricing_config for each row execute function public.log_admin_write();
create trigger audit_tier_config after insert or update or delete on public.tier_config for each row execute function public.log_admin_write();
create trigger audit_service_rates after insert or update or delete on public.service_rates for each row execute function public.log_admin_write();

-- ============ SEED CONFIG (illustrative) ============
insert into public.pricing_config (product_type, host_pool_pct, platform_take_pct) values
  ('cpu_compute', 82, 18), ('gpu_compute', 84, 16), ('storage', 80, 20), ('game_server', 78, 22);

insert into public.service_rates (service_key, label, product, host_pool_rate_usd) values
  ('cpu_hour','vCPU-hour','cpu_compute',0.0041),
  ('gpu_hour_entry','Entry GPU-hour','gpu_compute',0.0546),
  ('gpu_hour_3090','RTX 3090 GPU-hour','gpu_compute',0.1092),
  ('gpu_hour_4090','RTX 4090 GPU-hour','gpu_compute',0.2016),
  ('storage_gb_month','Storage GB-month','storage',0.0044),
  ('game_slot_month','Game server 4GB-month','game_server',0.0098);

insert into public.availability_mode_config (mode, label, description, rate_multiplier, utilization_low, utilization_high) values
  ('background','Background','Machine stays fully usable; a small slice of spare capacity is offered at the lowest rate.',0.70,5,20),
  ('idle','Idle','More resources are released after a period of inactivity, at a higher active rate.',1.00,15,45),
  ('reserved','Reserved','Resources are committed for a window: an availability floor plus usage.',1.25,40,80),
  ('verified','Verified','Meets the network, uptime and security bar; higher share and preferred scheduling.',1.45,55,90);

insert into public.tier_config (tier_code, category, qualification) values
  ('T0','cpu','{"min_cores":2,"min_single_score":0}'),
  ('T1','cpu','{"min_cores":4,"min_single_score":900}'),
  ('T2','cpu','{"min_cores":6,"min_single_score":1200}'),
  ('T3','cpu','{"min_cores":8,"min_single_score":1600}'),
  ('T4','cpu','{"min_cores":16,"min_single_score":2000}'),
  ('G0','gpu','{"min_vram_gb":0}'),
  ('G1','gpu','{"min_vram_gb":6}'),
  ('G2','gpu','{"min_vram_gb":8}'),
  ('G3','gpu','{"min_vram_gb":12}'),
  ('G4','gpu','{"min_vram_gb":16}'),
  ('G5','gpu','{"min_vram_gb":24}'),
  ('S1','storage','{"min_free_gb":100,"type":"hdd"}'),
  ('S2','storage','{"min_free_gb":500,"type":"ssd"}'),
  ('S3','storage','{"min_free_gb":1000,"type":"ssd"}'),
  ('S4','storage','{"min_free_gb":4000,"type":"nvme"}'),
  ('N1','network','{"min_upload_mbps":10}'),
  ('N2','network','{"min_upload_mbps":50}'),
  ('N3','network','{"min_upload_mbps":200}'),
  ('N4','network','{"min_upload_mbps":500}');

insert into public.competitor_prices (competitor, product, item, figure, source_url, date_checked) values
  ('SaladCloud','gpu_compute','RTX 4090 (24GB)','$0.160–$0.330/hr','https://salad.com/pricing','2026-09-18'),
  ('SaladCloud','gpu_compute','RTX 3090 (24GB)','$0.090–$0.170/hr','https://salad.com/pricing','2026-09-18'),
  ('SaladCloud','cpu_compute','vCPU','$0.005/vCPU/hr','https://salad.com/pricing','2026-09-18'),
  ('Together AI','gpu_compute','Llama 3.3 70B','$1.04 per million tokens (in and out)','https://www.together.ai/pricing','2026-09-15'),
  ('Backblaze B2','storage','Object storage','$6.95/TB/month, billed on byte-hours','https://www.backblaze.com/cloud-storage/pricing','2026-09-12'),
  ('Shockbyte','game_server','Minecraft 4GB','$15.99/mo (≈$11.19 with a 30% recurring discount)','https://shockbyte.com/minecraft','2026-09-16'),
  ('Shockbyte','game_server','Minecraft 8GB','$31.99/mo (≈$22.39 with a 30% recurring discount)','https://shockbyte.com/minecraft','2026-09-16');

insert into public.build_milestones (title, detail, state, sort_order) values
  ('Brand system and design tokens','Palette, typography and the network logo mark defined once and used everywhere.','live',1),
  ('Accounts and private access','Email and password sign-in, magic links, and the site password gate.','live',2),
  ('Marketplace data model','Nodes, listings, deployments, append-only ledger, config tables and access rules.','live',3),
  ('Node agent control plane','Benchmarking, isolation and scheduling — a separate backend service.','in_progress',4),
  ('Marketplace and customer dashboard','Filterable listings, live price estimates, deployments, wallet and budget caps.','in_progress',5),
  ('Provider onboarding and payouts','Verification, availability modes, provider-set payout floors, earnings estimator.','planned',6),
  ('Admin operations panel','Verification queues, pricing config, trust review and audit history.','planned',7),
  ('CorePort Certified','Earned certification for peer hardware, plus a small operated capacity pool.','planned',8);

insert into public.status_components (name, state, description, sort_order) values
  ('Marketplace API','operational','Listing and quote endpoints.',1),
  ('Control plane','operational','Node enrollment and scheduling.',2),
  ('Relay network','operational','Outbound-only node connectivity.',3),
  ('Billing and ledger','operational','Metering, wallet and payouts.',4);

insert into public.feature_flags (key, enabled, description) values
  ('marketplace_checkout', false, 'Customer deployment checkout (Phase 2).'),
  ('provider_onboarding', false, 'Provider apply and verification flow (Phase 3).'),
  ('admin_panel', false, 'Internal admin operations panel (Phase 4).'),
  ('certified_tier', false, 'CorePort Certified reliability class (Phase 5).');

insert into public.legal_pages (slug, title, body) values
  ('terms','Customer Terms','Draft pending legal review. These terms govern use of CorePort infrastructure products. CorePort publishes reliability targets as engineering targets, not contractual service level guarantees.'),
  ('privacy','Privacy Policy','Draft pending legal review. This page describes what account, billing and telemetry data CorePort collects, why it is collected, and how long it is retained.'),
  ('acceptable-use','Acceptable Use Policy','Draft pending legal review. Workloads must not include unlawful content, network abuse, unsolicited bulk messaging, credential cracking, or attempts to inspect or escape the workload sandbox.'),
  ('provider-agreement','Provider Agreement','Draft pending legal review. This agreement covers hardware listing, availability modes, metering, payout thresholds and the provider-set payout floor. CorePort makes no representation of earnings.');
