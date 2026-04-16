-- Posición del foco de imagen en hero slides
alter table public.hero_slides
  add column if not exists object_position text not null default 'center';
