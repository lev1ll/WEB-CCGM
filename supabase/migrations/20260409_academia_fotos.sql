-- Fotos por academia para el carrusel de Extraescolares
create table if not exists public.academia_fotos (
  academia   text primary key,  -- 'Fútbol', 'Polideportivo', 'Danza', etc.
  src        text not null,
  alt        text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.academia_fotos enable row level security;

-- Lectura pública
create policy "academia_fotos_public_read"
  on public.academia_fotos for select
  to anon
  using (true);

-- Admin puede todo
create policy "academia_fotos_admin_all"
  on public.academia_fotos for all
  to authenticated
  using (true)
  with check (true);
