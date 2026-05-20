-- Horarios semanales por curso y atención de apoderados

CREATE TABLE IF NOT EXISTS public.horarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curso text NOT NULL,
  dia text NOT NULL,
  hora_inicio text NOT NULL,
  hora_fin text NOT NULL,
  asignatura text NOT NULL DEFAULT '',
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(curso, dia, hora_inicio, hora_fin)
);

CREATE TABLE IF NOT EXISTS public.atencion_apoderados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  cargo text NOT NULL,
  dia text NOT NULL,
  hora_inicio text NOT NULL,
  hora_fin text NOT NULL,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atencion_apoderados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "horarios_public_select" ON public.horarios FOR SELECT USING (true);
CREATE POLICY "horarios_auth_all" ON public.horarios FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "atencion_public_select" ON public.atencion_apoderados FOR SELECT USING (true);
CREATE POLICY "atencion_auth_all" ON public.atencion_apoderados FOR ALL TO authenticated USING (true) WITH CHECK (true);
