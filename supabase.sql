-- Blog posts
create extension if not exists "uuid-ossp";

create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb,
  cover_url text,
  tags text[] default '{}',
  status text not null default 'published',
  published_at timestamptz default now()
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

-- Portfolio posts
create table if not exists public.portfolio_posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb,
  cover_url text,
  tags text[] default '{}',
  status text not null default 'published',
  published_at timestamptz default now()
);

create index if not exists portfolio_posts_status_idx on public.portfolio_posts (status);
create index if not exists portfolio_posts_slug_idx on public.portfolio_posts (slug);

-- Services
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  description text,
  content jsonb,
  price_from numeric,
  tags text[] default '{}',
  status text not null default 'published',
  published_at timestamptz default now()
);

create index if not exists services_status_idx on public.services (status);
create index if not exists services_slug_idx on public.services (slug);

-- Trigger to keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blog_posts_touch before update on public.blog_posts
for each row execute function public.touch_updated_at();

create trigger portfolio_posts_touch before update on public.portfolio_posts
for each row execute function public.touch_updated_at();

create trigger services_touch before update on public.services
for each row execute function public.touch_updated_at();
