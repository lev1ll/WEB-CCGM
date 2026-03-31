-- Galería de fotos
create table if not exists public.galeria (
  id         uuid        primary key default gen_random_uuid(),
  url        text        not null,
  caption    text,
  orden      integer     not null default 0,
  created_at timestamptz not null default now()
);

alter table public.galeria enable row level security;
create policy "galeria_public_select" on public.galeria for select using (true);
create policy "galeria_auth_insert"   on public.galeria for insert with check (auth.role() = 'authenticated');
create policy "galeria_auth_update"   on public.galeria for update using (auth.role() = 'authenticated');
create policy "galeria_auth_delete"   on public.galeria for delete using (auth.role() = 'authenticated');

-- Documentos descargables
create table if not exists public.documentos (
  id          uuid        primary key default gen_random_uuid(),
  titulo      text        not null,
  descripcion text,
  url         text        not null,
  categoria   text        not null default 'otro',
  curso       text,
  created_at  timestamptz not null default now()
);

alter table public.documentos enable row level security;
create policy "documentos_public_select" on public.documentos for select using (true);
create policy "documentos_auth_insert"   on public.documentos for insert with check (auth.role() = 'authenticated');
create policy "documentos_auth_update"   on public.documentos for update using (auth.role() = 'authenticated');
create policy "documentos_auth_delete"   on public.documentos for delete using (auth.role() = 'authenticated');
