-- Hero slides: imágenes del carrusel principal gestionables desde el admin
create table if not exists public.hero_slides (
  id         uuid primary key default gen_random_uuid(),
  src        text not null,
  alt        text not null default '',
  orden      integer not null default 0,
  activo     boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

-- Lectura pública para el carrusel del sitio
create policy "hero_slides_public_read"
  on public.hero_slides for select
  to anon
  using (activo = true);

-- El admin (authenticated) puede hacer todo
create policy "hero_slides_admin_all"
  on public.hero_slides for all
  to authenticated
  using (true)
  with check (true);
