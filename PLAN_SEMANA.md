# Plan de desarrollo — Escuela Gabriela Mistral
**Última actualización: 30 marzo 2026**
> Sin fechas fijas — avanzar fase por fase según disponibilidad.

---

## Estado actual del proyecto: ~78%

Lo técnico está prácticamente terminado. Lo que falta es contenido real (fotos), funcionalidades de autogestión para que el colegio no dependa de un desarrollador, y el despliegue en producción.

---

## FASE 0 — Responsividad móvil ⬜ PENDIENTE
> **Objetivo:** Que el admin y el sitio funcionen bien desde el celular.

- [ ] Sidebar admin: colapsar correctamente en móvil (`md:` en vez de `lg:`)
- [ ] Tablas de Contactos y Preinscripciones: `overflow-x-auto` para scroll horizontal
- [ ] Dialog/modal: ancho responsivo (`w-[calc(100%-2rem)]`, padding `p-4 sm:p-6`)
- [ ] Toast de notificaciones: ancho completo en móvil (`w-full sm:w-80`)
- [ ] Padding del contenido principal: `p-4 sm:p-6`
- [ ] KPI grid del Dashboard: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
- [ ] KPI grid de 7 estados: `grid-cols-2 sm:grid-cols-4 md:grid-cols-7`

---

## FASE 1 — Galería y documentos descargables ⬜ PENDIENTE
> **Objetivo:** Que el colegio pueda subir fotos y documentos sin tocar código.

### 1.1 Galería de fotos pública
- [ ] Crear tabla `galerias` en Supabase (nombre, descripción, portada, created_at)
- [ ] Crear tabla `galeria_fotos` (galeria_id, url, caption, orden)
- [ ] SQL migración con RLS (anon select, authenticated insert/update/delete)
- [ ] Página pública `/galeria` — grid de álbumes por categoría (Instalaciones, Academias, Actos, Deportes)
- [ ] Página de álbum `/galeria/:slug` — grid de fotos con lightbox al hacer clic
- [ ] Admin `/admin/galeria` — crear álbumes, subir fotos múltiples via Cloudinary, reordenar, eliminar
- [ ] Enlace a galería en el navbar

### 1.2 Documentos descargables
- [ ] Habilitar subida de PDF en Cloudinary (endpoint `/raw/upload`)
- [ ] Crear tabla `documentos` (titulo, descripcion, categoria, url, updated_at)
  - Categorías: `reglamento | utiles | formularios | calendario`
- [ ] SQL migración con RLS
- [ ] Sección pública en `/admision` — lista de documentos con botón de descarga
- [ ] Admin `/admin/documentos` — subir PDF, reemplazar versión, eliminar

---

## FASE 2 — Calendario escolar ⬜ PENDIENTE
> **Objetivo:** Que los apoderados encuentren las fechas importantes sin llamar al colegio.

### 2.1 Calendario público
- [ ] Crear tabla `calendario_eventos` (titulo, fecha, fecha_fin, tipo, descripcion)
  - Tipos: `feriado | reunion | acto | evaluacion | otro`
- [ ] SQL migración con RLS
- [ ] Página pública `/calendario` — lista mensual con chips de color por tipo
- [ ] Widget de próximos eventos en la Home (3–5 eventos más cercanos)
- [ ] Enlace en navbar

### 2.2 Admin calendario
- [ ] Admin `/admin/calendario` — crear, editar, eliminar eventos
- [ ] Selector de tipo con color, fechas de inicio/fin

---

## FASE 3 — Mejoras al sistema de noticias ⬜ PENDIENTE
> **Objetivo:** Noticias más atractivas y fáciles de gestionar.

### 3.1 Página pública
- [ ] Noticia destacada (featured) arriba del grid — ancho completo
- [ ] Añadir campo `destacada: boolean` a la tabla noticias + SQL
- [ ] Cards más grandes: más foto, menos texto
- [ ] Compartir en WhatsApp / copiar enlace desde el detalle

### 3.2 Admin noticias
- [ ] Toggle "Noticia destacada" en el editor
- [ ] Preview antes de publicar (nueva tab)
- [ ] Ordenar lista: más reciente / más antiguo / solo borradores

### 3.3 Home
- [ ] Sección "Últimas noticias" con las 3 más recientes + botón "Ver todas"

---

## FASE 4 — Equipo desde base de datos ⬜ PENDIENTE
> **Objetivo:** Que el personal se actualice sin desarrollador.

- [ ] Verificar RLS correcto en tabla `trabajadores`
- [ ] Conectar sección "Nuestro equipo" en `/nosotros` a Supabase (hoy usa constantes)
- [ ] Verificar flujo completo del admin trabajadores (foto, crop, guardar)
- [ ] Mostrar categorías en página pública: Directivos / Docentes / Asistentes

---

## FASE 5 — Autogestión y producción ⬜ PENDIENTE
> **Objetivo:** Colegio 100% autónomo y página en producción.

### 5.1 Autogestión
- [ ] Admin `/admin/configuracion` — editar email, teléfono, redes sociales sin tocar código
- [ ] Permitir cambiar fotos del hero desde el admin
- [ ] Guía de uso del admin (PDF o Word simple para el colegio)

### 5.2 SEO
- [ ] Meta description por página (no solo en index.html)
- [ ] Open Graph tags para WhatsApp/Facebook (imagen, título, descripción)
- [ ] `sitemap.xml` estático
- [ ] `robots.txt`

### 5.3 Limpieza y deploy
- [ ] Página 404 (`src/pages/NotFound.tsx`)
- [ ] Eliminar archivos muertos: ruta `/old`, `VariantSwitcher`, scripts `.py` del raíz
- [ ] Completar email institucional en `school.ts`
- [ ] Hosting: Vercel (recomendado, gratis) o Netlify
- [ ] Variables de entorno configuradas en el host
- [ ] Dominio personalizado (si el colegio tiene o quiere comprar)
- [ ] Verificar RLS de todas las tablas con usuario real
- [ ] Test completo en móvil (iOS + Android)
- [ ] Crear usuario admin definitivo en Supabase Auth

---

## FASE 6 — Contenido real ⏳ BLOQUEADO (depende del cliente)

- [ ] Fotos del hero (2–3 horizontales, buena resolución)
- [ ] Fotos de instalaciones (biblioteca, patio, salas, comedor)
- [ ] Fotos de academias en acción (fútbol, danza, etc.)
- [ ] Fotos del equipo directivo y docentes
- [ ] Email institucional del colegio
- [ ] Logo en alta resolución (vectorial si existe)
- [ ] Reglamento interno PDF actualizado
- [ ] Listas de útiles 2026 por curso
- [ ] Calendario escolar 2026 oficial

---

## Criterio de autonomía — "el colegio no te necesita más"

| Tarea | Estado |
|-------|--------|
| Publicar noticias y eventos | ✅ Listo |
| Gestionar pre-inscripciones | ✅ Listo |
| Subir fotos a la galería | ⬜ Fase 1 |
| Actualizar documentos descargables | ⬜ Fase 1 |
| Editar el calendario escolar | ⬜ Fase 2 |
| Cambiar fotos del equipo | ⬜ Fase 4 |
| Cambiar teléfono/email sin tocar código | ⬜ Fase 5 |
| Página en producción con dominio | ⬜ Fase 5 |
