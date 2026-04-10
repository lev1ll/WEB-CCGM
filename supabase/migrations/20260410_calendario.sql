-- Tabla calendario_eventos
create table public.calendario_eventos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descripcion text,
  fecha_inicio date not null,
  fecha_fin    date,
  tipo        text not null default 'general',
  created_at  timestamptz not null default now()
);

create index idx_calendario_fecha on public.calendario_eventos (fecha_inicio);
create index idx_calendario_tipo  on public.calendario_eventos (tipo);

alter table public.calendario_eventos enable row level security;

create policy "anon can select calendario"
  on public.calendario_eventos for select to anon using (true);

create policy "authenticated can all calendario"
  on public.calendario_eventos for all to authenticated using (true) with check (true);
