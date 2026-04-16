-- Soporte de videos (YouTube) en galería
alter table public.galeria
  add column if not exists tipo      text not null default 'foto',
  add column if not exists video_url text;
