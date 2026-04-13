-- RLS para tabla trabajadores
-- anon puede leer (página pública /nosotros)
-- authenticated puede escribir (panel admin)

ALTER TABLE trabajadores ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "anon_select_trabajadores"
  ON trabajadores FOR SELECT
  TO anon, authenticated
  USING (true);

-- Solo admin puede insertar, actualizar y eliminar
CREATE POLICY "auth_insert_trabajadores"
  ON trabajadores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update_trabajadores"
  ON trabajadores FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_trabajadores"
  ON trabajadores FOR DELETE
  TO authenticated
  USING (true);
