-- ================================================================
-- Movilización escolar: configuración, rutas y zonas de cobertura
-- ================================================================

-- Configuración general de la sección (singleton, id = 1)
create table if not exists config_movilizacion (
  id          integer primary key default 1 check (id = 1),
  titulo      text    not null default 'Servicio de movilización escolar',
  subtitulo   text    not null default 'Cubrimos toda Nueva Imperial y llegamos hasta la primera zona de Labranza',
  chips       jsonb   not null default '[]'::jsonb
);

-- Rutas del bus (polilíneas en el mapa)
create table if not exists rutas_bus (
  id      uuid primary key default gen_random_uuid(),
  nombre  text    not null,
  color   text    not null default '#2563eb',
  puntos  jsonb   not null default '[]'::jsonb,
  activo  boolean not null default true,
  orden   integer not null default 0
);

-- Zonas de cobertura (círculos en el mapa)
create table if not exists zonas_cobertura (
  id           uuid primary key default gen_random_uuid(),
  nombre       text    not null,
  descripcion  text    not null default '',
  latitud      numeric not null,
  longitud     numeric not null,
  radio_metros integer not null default 1000,
  activo       boolean not null default true,
  orden        integer not null default 0
);

-- ── RLS ──────────────────────────────────────────────────────────

alter table config_movilizacion enable row level security;
create policy "public read config_movilizacion"
  on config_movilizacion for select using (true);
create policy "auth write config_movilizacion"
  on config_movilizacion for all using (auth.role() = 'authenticated');

alter table rutas_bus enable row level security;
create policy "public read rutas_bus"
  on rutas_bus for select using (true);
create policy "auth write rutas_bus"
  on rutas_bus for all using (auth.role() = 'authenticated');

alter table zonas_cobertura enable row level security;
create policy "public read zonas_cobertura"
  on zonas_cobertura for select using (true);
create policy "auth write zonas_cobertura"
  on zonas_cobertura for all using (auth.role() = 'authenticated');

-- ── Seed: valores actuales hardcodeados ──────────────────────────

insert into config_movilizacion (id, titulo, subtitulo, chips) values (
  1,
  'Servicio de movilización escolar',
  'Cubrimos toda Nueva Imperial y llegamos hasta la primera zona de Labranza',
  '[{"icon":"Bus","text":"Toda Nueva Imperial"},{"icon":"MapPin","text":"Hasta Supermercado Lily, Labranza"}]'::jsonb
) on conflict (id) do nothing;

insert into rutas_bus (nombre, color, puntos, activo, orden) values (
  'Ruta S-40 Nueva Imperial – Labranza',
  '#2563eb',
  '[[-38.742785,-72.952101],[-38.742679,-72.948843],[-38.748392,-72.948508],[-38.748499,-72.946100],[-38.749190,-72.945037],[-38.749438,-72.943101],[-38.749706,-72.940544],[-38.750415,-72.938910],[-38.751047,-72.937067],[-38.752464,-72.932658],[-38.754107,-72.927441],[-38.755122,-72.924250],[-38.756008,-72.922389],[-38.757740,-72.918911],[-38.757949,-72.917947],[-38.757569,-72.912077],[-38.757494,-72.909616],[-38.758133,-72.907321],[-38.759569,-72.902583],[-38.761062,-72.897616],[-38.762879,-72.891601],[-38.764229,-72.887140],[-38.765895,-72.881633],[-38.767054,-72.877861],[-38.767818,-72.874625],[-38.769612,-72.869277],[-38.769821,-72.866598],[-38.769414,-72.863937],[-38.768794,-72.860517],[-38.767801,-72.854906],[-38.767089,-72.850880],[-38.766878,-72.847395],[-38.765908,-72.842111],[-38.765182,-72.839805],[-38.764769,-72.837702],[-38.764182,-72.833840],[-38.764237,-72.831737],[-38.764708,-72.829091],[-38.765696,-72.825112],[-38.766957,-72.818195],[-38.768067,-72.815547],[-38.768385,-72.812566],[-38.768480,-72.810312],[-38.768070,-72.807436],[-38.767233,-72.801758],[-38.766401,-72.796333],[-38.765883,-72.792881],[-38.765773,-72.791574],[-38.766073,-72.786663],[-38.766504,-72.780338],[-38.766120,-72.775104]]'::jsonb,
  true,
  0
);

insert into zonas_cobertura (nombre, descripcion, latitud, longitud, radio_metros, activo, orden) values
  ('Centro Nueva Imperial', 'Cobertura completa del centro de Nueva Imperial', -38.7398, -72.9492, 2200, true, 0),
  ('Zona Labranza',         'Hasta Supermercado Lily, Labranza',                -38.7661195, -72.7751037, 800, true, 1);
