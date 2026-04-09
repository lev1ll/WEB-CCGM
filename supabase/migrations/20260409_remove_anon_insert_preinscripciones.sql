-- Eliminar policy de INSERT anónimo en preinscripciones
-- El formulario público fue removido del frontend; la tabla ahora es solo para uso interno del admin.
drop policy if exists "anon can insert preinscripciones" on public.preinscripciones;
