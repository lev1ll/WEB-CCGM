# Plan de trabajo — Semana de desarrollo
**Escuela Gabriela Mistral · Página Web CCGM**
Última actualización: 30 marzo 2026

---

## Estado actual del proyecto: ~78%

Lo técnico está prácticamente terminado. Lo que falta es contenido real (fotos), algunas funcionalidades de autogestión para que el colegio no dependa de un desarrollador, y el despliegue en producción.

---

## FASE 1 — Galería y documentos descargables ✅ PENDIENTE
> **Objetivo:** Que el colegio pueda subir fotos y documentos sin tocar código.
> **Tiempo estimado:** 1–2 días

### 1.1 Galería de fotos pública
- [ ] Crear tabla `galerias` en Supabase (nombre, descripción, portada, created_at)
- [ ] Crear tabla `galeria_fotos` (galeria_id, url, caption, orden)
- [ ] SQL migración con RLS (anon select, authenticated insert/update/delete)
- [ ] Página pública `/galeria` — grid masonry de álbumes por categoría (Instalaciones, Academias, Actos, Deportes)
- [ ] Página de álbum `/galeria/:slug` — grid de fotos con lightbox al hacer clic
- [ ] Admin `/admin/galeria` — crear álbumes, subir fotos (múltiples a la vez via Cloudinary), reordenar, eliminar
- [ ] Enlace a galería en el navbar

### 1.2 Documentos descargables
- [ ] Habilitar subida de PDF en Cloudinary (cambiar endpoint a `/raw/upload`)
- [ ] Crear tabla `documentos` (titulo, descripcion, categoria, url, updated_at)
  - Categorías: `reglamento | utiles | formularios | calendario`
- [ ] SQL migración con RLS
- [ ] Sección pública en `/admision` (o página propia) — lista de documentos con botón de descarga
- [ ] Admin `/admin/documentos` — subir PDF, reemplazar versión, eliminar

---

## FASE 2 — Calendario escolar ✅ PENDIENTE
> **Objetivo:** Que los apoderados encuentren las fechas importantes sin llamar al colegio.
> **Tiempo estimado:** 1 día

### 2.1 Calendario público
- [ ] Crear tabla `calendario_eventos` (titulo, fecha, fecha_fin, tipo, descripcion)
  - Tipos: `feriado | reunion | acto | evaluacion | otro`
- [ ] SQL migración con RLS
- [ ] Página pública `/calendario` — vista de lista mensual con chips de color por tipo
- [ ] Widget de próximos eventos en la Home (3–5 eventos más cercanos)
- [ ] Enlace en navbar

### 2.2 Admin calendario
- [ ] Admin `/admin/calendario` — crear, editar, eliminar eventos
- [ ] Selector de tipo con color, fechas de inicio/fin
- [ ] Vista de lista y posible mini-calendario visual

---

## FASE 3 — Mejoras al sistema de noticias ✅ PENDIENTE
> **Objetivo:** Que las noticias sean más fáciles de gestionar y más atractivas para los apoderados.
> **Tiempo estimado:** 1 día

### 3.1 Página pública de noticias
- [ ] Rediseñar la card de noticia — más grande, más foto, menos texto
- [ ] Añadir noticia destacada (featured) arriba del grid — ocupa el ancho completo
- [ ] Añadir campo `destacada: boolean` a la tabla noticias
- [ ] Breadcrumb en el detalle de noticia
- [ ] Compartir en WhatsApp / copiar enlace desde el detalle

### 3.2 Admin noticias
- [ ] Toggle "Noticia destacada" en el editor
- [ ] Preview del artículo antes de publicar (abre en nueva tab)
- [ ] Duplicar noticia existente como borrador
- [ ] Ordenar lista admin por: más reciente, más antiguo, solo borradores

### 3.3 Home — sección noticias
- [ ] Añadir sección "Últimas noticias" en la Home con las 3 más recientes
- [ ] Botón "Ver todas" que lleva a `/noticias`

---

## FASE 4 — Página Equipo / Nosotros mejorada ✅ PENDIENTE
> **Objetivo:** Que el equipo se pueda actualizar sin desarrollador cuando cambie el personal.
> **Tiempo estimado:** 0.5 días

### 4.1 Equipo desde base de datos
- [ ] Verificar que `trabajadores` en Supabase tiene RLS correcto
- [ ] Conectar la sección "Nuestro equipo" en `/nosotros` a Supabase en vez de constantes hardcodeadas
- [ ] Admin trabajadores ya está — verificar que funciona el flujo completo (foto, crop, guardar)
- [ ] Añadir categorías visibles en la página pública: Directivos / Docentes / Asistentes

---

## FASE 5 — Autogestión y producción ✅ PENDIENTE
> **Objetivo:** Que el colegio pueda operar completamente sin el desarrollador.
> **Tiempo estimado:** 1 día

### 5.1 Ajustes de autogestión
- [ ] Guía de uso del admin (documento Word o PDF simple) — cómo publicar noticias, subir fotos, gestionar pre-inscripciones
- [ ] Añadir admin `/admin/configuracion` — editar datos del colegio (email, teléfono, redes sociales) sin tocar código
- [ ] Permitir cambiar las fotos del hero desde el admin (tabla `configuracion` o similar)

### 5.2 SEO y meta tags
- [ ] `<meta>` description real en cada página (no solo en index.html)
- [ ] Open Graph tags para compartir en WhatsApp/Facebook (imagen, título, descripción)
- [ ] `sitemap.xml` estático con las rutas principales
- [ ] `robots.txt`

### 5.3 Deploy y producción
- [ ] Elegir hosting: Vercel (recomendado, gratis) o Netlify
- [ ] Configurar variables de entorno en el host
- [ ] Dominio personalizado (si el colegio tiene uno o quiere comprar)
- [ ] Verificar Supabase RLS en todas las tablas con usuario real
- [ ] Test completo en móvil (iOS + Android)
- [ ] Crear usuario admin definitivo en Supabase Auth
- [ ] Eliminar archivos muertos: `/old`, `VariantSwitcher`, scripts `.py` del raíz

### 5.4 Página 404
- [ ] Crear `src/pages/NotFound.tsx` — diseño simple con logo y botón volver al inicio

---

## FASE 6 — Contenido real (depende del cliente) ⏳ BLOQUEADO
> **Bloqueador:** El cliente debe entregar el material.

- [ ] Fotos del hero (2–3 fotos horizontales de buena resolución)
- [ ] Fotos de las instalaciones (biblioteca, patio, salas, comedor)
- [ ] Fotos de las academias en acción (fútbol, danza, etc.)
- [ ] Fotos del equipo directivo y docentes
- [ ] Email institucional del colegio
- [ ] Logo en alta resolución (si existe versión vectorial)
- [ ] Reglamento interno en PDF actualizado
- [ ] Listas de útiles 2026 por curso
- [ ] Calendario escolar 2026 oficial

---

## Resumen por día

| Día | Fases | Resultado |
|-----|-------|-----------|
| Lunes 31 mar | Fase 1 (Galería + Documentos) | Sube fotos sin código |
| Martes 1 abr | Fase 2 (Calendario) | Apoderados ven fechas online |
| Miércoles 2 abr | Fase 3 (Noticias mejoradas) | Canal de comunicación más potente |
| Jueves 3 abr | Fase 4 + inicio Fase 5 | Equipo desde DB, SEO básico |
| Viernes 4 abr | Fase 5 completa (Deploy) | Página en producción, colegio autónomo |

---

## Criterio de "el colegio no te necesita más"

El colegio podrá operar sin el desarrollador cuando pueda:
1. ✅ Publicar noticias y eventos (ya funciona)
2. ✅ Gestionar pre-inscripciones (ya funciona)
3. ⬜ Subir fotos a la galería
4. ⬜ Actualizar documentos descargables
5. ⬜ Editar el calendario escolar
6. ⬜ Cambiar fotos del equipo
7. ⬜ Cambiar teléfono/email del colegio sin tocar código

Con las fases 1–5 completadas, el colegio es 100% autónomo.
