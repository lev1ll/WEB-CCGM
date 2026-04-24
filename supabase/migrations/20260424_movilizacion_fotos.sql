-- Fotos de buses del servicio de movilización (2 slots fijos)
create table if not exists movilizacion_fotos (
  slot  integer primary key check (slot in (1, 2)),
  src   text not null,
  alt   text not null default 'Bus escolar'
);

alter table movilizacion_fotos enable row level security;
create policy "public read movilizacion_fotos"
  on movilizacion_fotos for select using (true);
create policy "auth write movilizacion_fotos"
  on movilizacion_fotos for all using (auth.role() = 'authenticated');
