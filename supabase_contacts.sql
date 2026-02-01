-- Таблица обращений с сайта
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz not null default now()
);

-- Индекс по времени для сортировки
create index if not exists contacts_created_at_idx on public.contacts(created_at desc);
