create extension if not exists pgcrypto;

create table if not exists stripe_events (
  event_id text primary key,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  checkout_session_id text not null unique,
  stripe_customer_id text,
  email text not null,
  amount_total integer,
  currency text,
  payment_status text not null default 'paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchases_email_idx on purchases (email);

create table if not exists entitlements (
  email text primary key,
  active boolean not null default true,
  max_devices integer not null default 4,
  stripe_customer_id text,
  last_checkout_session_id text,
  updated_at timestamptz not null default now()
);

create table if not exists device_activations (
  id uuid primary key default gen_random_uuid(),
  email text not null references entitlements(email) on delete cascade,
  device_id text not null unique,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
