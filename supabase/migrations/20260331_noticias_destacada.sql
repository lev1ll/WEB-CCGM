-- Añadir columna destacada a noticias
alter table public.noticias
  add column if not exists destacada boolean not null default false;

create index if not exists idx_noticias_destacada on public.noticias (destacada) where destacada = true;
