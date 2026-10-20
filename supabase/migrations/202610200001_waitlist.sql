begin;

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 200),
  email text not null unique check (email = lower(trim(email)) and char_length(email) <= 320),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  address text not null check (char_length(address) between 10 and 2000),
  pack_size text not null check (pack_size in ('1', '3', '6')),
  color_preference text not null check (color_preference in (
    'matte-black', 'deep-navy', 'blue-mirror', 'brown-gold',
    'forest-green', 'rose-pink', 'royal-purple', 'aurora-gradient', 'surprise-me'
  )),
  cart_items jsonb not null default '[]'::jsonb
    check (jsonb_typeof(cart_items) = 'array' and jsonb_array_length(cart_items) <= 100),
  status text not null default 'waiting' check (status in ('waiting', 'contacted', 'converted'))
);

alter table public.waitlist_entries enable row level security;
revoke all on public.waitlist_entries from anon, authenticated;
grant select, insert, update, delete on public.waitlist_entries to service_role;

-- A single non-customer row makes the scheduled check exercise the database
-- without reading personal details or filling the waitlist with dummy signups.
create table public.service_health (
  id boolean primary key default true check (id),
  checked_at timestamptz not null default now()
);
insert into public.service_health (id) values (true);
alter table public.service_health enable row level security;
revoke all on public.service_health from anon, authenticated;
grant select, update on public.service_health to service_role;

create function public.check_waitlist_health()
returns timestamptz
language plpgsql
security invoker
set search_path = ''
as $$
declare
  checked timestamptz;
begin
  -- Also verify the waitlist table still exists without accessing its rows.
  perform id from public.waitlist_entries limit 0;
  update public.service_health set checked_at = clock_timestamp()
    where id = true returning checked_at into checked;
  if checked is null then
    raise exception 'Service health row is missing';
  end if;
  return checked;
end;
$$;
revoke all on function public.check_waitlist_health() from public, anon, authenticated;
grant execute on function public.check_waitlist_health() to service_role;

commit;
