-- Settings table (single row)
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  default_lessons integer not null default 5,
  updated_at timestamptz default now()
);

-- Seed default settings row
insert into settings (default_lessons) values (5);

-- Active students
create table if not exists active_students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  remaining_lessons integer not null default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Queued students
create table if not exists queued_students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position integer not null,
  created_at timestamptz default now()
);

-- RLS
alter table settings enable row level security;
alter table active_students enable row level security;
alter table queued_students enable row level security;

-- Public read access
create policy "Public read settings" on settings for select using (true);
create policy "Public read active_students" on active_students for select using (true);
create policy "Public read queued_students" on queued_students for select using (true);

-- Authenticated write access (server actions verify OWNER_EMAIL separately)
create policy "Auth insert active_students" on active_students for insert to authenticated with check (true);
create policy "Auth update active_students" on active_students for update to authenticated using (true);
create policy "Auth delete active_students" on active_students for delete to authenticated using (true);

create policy "Auth insert queued_students" on queued_students for insert to authenticated with check (true);
create policy "Auth update queued_students" on queued_students for update to authenticated using (true);
create policy "Auth delete queued_students" on queued_students for delete to authenticated using (true);

create policy "Auth update settings" on settings for update to authenticated using (true);
