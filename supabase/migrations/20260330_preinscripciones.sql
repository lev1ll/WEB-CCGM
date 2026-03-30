-- ============================================================
-- Migración: preinscripciones
-- La tabla ya existe — solo añadimos columnas faltantes y RLS
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Añadir columna estado si no existe
alter table public.preinscripciones
  add column if not exists estado text not null default 'pendiente';

-- Añadir columna notas si no existe
alter table public.preinscripciones
  add column if not exists notas text;

-- Índices
create index if not exists idx_preinscripciones_estado  on public.preinscripciones (estado);
create index if not exists idx_preinscripciones_created on public.preinscripciones (created_at desc);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.preinscripciones enable row level security;

-- Cualquiera puede insertar (formulario público)
drop policy if exists "anon can insert preinscripciones" on public.preinscripciones;
create policy "anon can insert preinscripciones"
  on public.preinscripciones for insert
  to anon
  with check (true);

-- Solo usuarios autenticados (admins) pueden leer y modificar
drop policy if exists "authenticated can select preinscripciones" on public.preinscripciones;
create policy "authenticated can select preinscripciones"
  on public.preinscripciones for select
  to authenticated
  using (true);

drop policy if exists "authenticated can update preinscripciones" on public.preinscripciones;
create policy "authenticated can update preinscripciones"
  on public.preinscripciones for update
  to authenticated
  using (true)
  with check (true);
