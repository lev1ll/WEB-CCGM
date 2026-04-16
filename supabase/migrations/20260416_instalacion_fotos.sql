-- Fotos de instalaciones gestionables desde el admin
create table if not exists public.instalacion_fotos (
  id           uuid        primary key default gen_random_uuid(),
  instalacion  text        not null unique,   -- id de la instalación (ej: 'gimnasio')
  src          text        not null,
  updated_at   timestamptz not null default now()
);

alter table public.instalacion_fotos enable row level security;

create policy "instalacion_fotos_public_read"
  on public.instalacion_fotos for select using (true);

create policy "instalacion_fotos_admin_all"
  on public.instalacion_fotos for all
  to authenticated
  using (true) with check (true);
