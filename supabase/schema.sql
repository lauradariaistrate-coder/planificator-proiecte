-- Planificator proiecte – baza de date Supabase (rulează o singură dată în SQL Editor)
create table if not exists public.planner_docs (
  ws         text        not null,               -- codul secret al echipei
  col        text        not null,               -- persons / proj / plan / hours / settings
  id         text        not null,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (ws, col, id)
);
alter table public.planner_docs enable row level security;

-- fiecare cerere vede / scrie doar rândurile echipei al cărei cod îl trimite în antetul x-ws
drop policy if exists "echipa_proprie" on public.planner_docs;
create policy "echipa_proprie" on public.planner_docs
  for all to anon
  using (length(ws) >= 20 and ws = coalesce(current_setting('request.headers', true)::json->>'x-ws', ''))
  with check (length(ws) >= 20 and ws = coalesce(current_setting('request.headers', true)::json->>'x-ws', ''));

grant select, insert, update, delete on public.planner_docs to anon;
