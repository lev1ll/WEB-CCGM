# Página Web — Escuela Gabriela Mistral (EGM)
### Nueva Imperial, Región de La Araucanía

---

## ¿Dónde estamos? — Estado actual

### ✅ Prototipo 1 COMPLETO
La página web está funcionando al 100% en modo local (`npm run dev`).
Todas las páginas tienen estructura, diseño y animaciones finales.
**Lo que falta es reemplazar el contenido placeholder por el contenido real.**

---

## Estructura de la página

```
/              → Inicio (Home)
/nosotros      → Nosotros
/niveles       → Niveles educativos
/admision      → Admisión
/contacto      → Contacto
```

---

## 🔴 CÓMO CAMBIAR EL CONTENIDO

Todo el contenido textual está centralizado en archivos de constantes.
**Solo hay que editar estos archivos — nunca tocar los componentes.**

### 📄 Datos del colegio (aparece en Navbar, Footer, Contacto)
**Archivo:** `src/constants/school.ts`

```typescript
export const SCHOOL = {
  name: 'Escuela Gabriela Mistral',   // Nombre completo
  shortName: 'EGM',                   // Abreviación (aparece en navbar)
  rbd: '',                            // ← COMPLETAR
  address: '',                        // ← COMPLETAR (ej: "Calle Los Aromos 123")
  phone: '',                          // ← COMPLETAR (ej: "+56 9 1234 5678")
  email: '',                          // ← COMPLETAR (ej: "contacto@egm.cl")
  city: 'Nueva Imperial',
  region: 'Región de La Araucanía',
  socialMedia: {
    facebook: '',                     // ← COMPLETAR con URL completa
    instagram: '',                    // ← COMPLETAR con URL completa
    youtube: '',                      // ← COMPLETAR con URL completa
  },
}
```

---

### 📄 Página de Inicio
**Archivo:** `src/constants/home.ts`

| Constante | Qué es |
|---|---|
| `HERO_CONTENT` | Título principal, subtítulo y texto del botón |
| `HOME_STATS` | Los 3 números animados (años, alumnos, docentes) |
| `HOME_VALORES` | Las 6 tarjetas de valores con icono y descripción |
| `HOME_TESTIMONIOS` | Los 5 testimonios de apoderados (nombre, cargo, texto) |
| `HOME_GALLERY_IMAGES` | Las 8 fotos de la galería (reemplazar URLs de Unsplash) |
| `HOME_FAQ` | Las preguntas frecuentes |

---

### 📄 Página Nosotros
**Archivo:** `src/constants/nosotros.ts`

| Constante | Qué es |
|---|---|
| `HISTORIA_TIMELINE` | Los hitos históricos del colegio (año, título, descripción) |
| `MISION_VISION` | Texto de Misión y Visión |
| `EQUIPO` | Directivos: nombre, cargo, bio corta |
| `VALORES_INSTITUCIONALES` | Los 5 valores con icono y descripción |

---

### 📄 Página Niveles
**Archivo:** `src/constants/niveles.ts`

| Constante | Qué es |
|---|---|
| `NIVELES` | Descripción de cada nivel educativo con características |
| `EXTRAESCOLARES` | Lista de talleres extraprogramáticos |

---

### 📄 Página Admisión
**Archivo:** `src/constants/admision.ts`

| Constante | Qué es |
|---|---|
| `ADMISSION_STEPS` | Los 4 pasos del proceso |
| `ADMISSION_REQUIREMENTS` | Lista de documentos requeridos |
| `ADMISSION_CALENDAR` | Fechas del calendario de admisión |
| `ADMISSION_FAQ` | Preguntas frecuentes de admisión |

---

### 🖼️ IMÁGENES Y LOGO

#### ¿Dónde poner las fotos?
Carpeta: `public/images/`
(si no existe, créala — todo lo que esté en `public/` es accesible como URL directa)

#### Ejemplo de uso en código:
```
public/images/logo.png       →  URL en web: /images/logo.png
public/images/hero.jpg       →  URL en web: /images/hero.jpg
public/images/foto-patio.jpg →  URL en web: /images/foto-patio.jpg
```

#### Para reemplazar el Hero (foto de fondo principal):
Edita `src/pages/Home/sections/Hero.tsx` línea ~23:
```tsx
// Cambiar esto:
src="https://images.unsplash.com/..."
// Por esto:
src="/images/hero.jpg"
```

#### Para reemplazar fotos de galería:
Edita `src/constants/home.ts`, en `HOME_GALLERY_IMAGES`:
```typescript
{ src: '/images/foto-clases.jpg', alt: 'Alumnos en clases', span: 'wide' },
{ src: '/images/foto-patio.jpg',  alt: 'Recreo',            span: 'normal' },
// etc.
```

#### Para el logo (en Navbar y Footer):
Actualmente se usa un ícono de graduación (`GraduationCap`).
Para usar una imagen real, edita `src/components/layout/Navbar.tsx` línea ~36:
```tsx
// Reemplazar el ícono por:
<img src="/images/logo.png" alt="Logo EGM" className="h-8 w-auto" />
```

#### Formatos recomendados:
| Uso | Formato | Tamaño máximo |
|---|---|---|
| Logo | PNG o SVG | 200KB |
| Hero (fondo principal) | JPG o WebP | 500KB |
| Galería | JPG o WebP | 300KB c/u |
| Fotos de equipo | JPG | 150KB c/u |

---

## ⚙️ SUPABASE — Configuración del backend

Supabase es el backend que recibe los formularios de contacto y pre-inscripción.

### Paso 1: Crear cuenta y proyecto
1. Ve a [supabase.com](https://supabase.com) → crea cuenta gratuita
2. Crea un nuevo proyecto (nombre: `egm-web`, contraseña segura)
3. Espera ~2 minutos a que se inicialice

### Paso 2: Crear las tablas (copiar en SQL Editor)
Ve a **SQL Editor** en el panel de Supabase y ejecuta:

```sql
-- Tabla para el formulario de contacto
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);
alter table contact_messages enable row level security;
create policy "anon insert" on contact_messages for insert to anon with check (true);

-- Tabla para pre-inscripciones de admisión
create table preinscripciones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  child_name text not null,
  current_grade text,
  message text,
  created_at timestamptz default now()
);
alter table preinscripciones enable row level security;
create policy "anon insert" on preinscripciones for insert to anon with check (true);

-- Tabla para logs del chatbot (opcional, para cuando se active el chatbot IA)
create table chatbot_logs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  session_id text not null,
  created_at timestamptz default now()
);
alter table chatbot_logs enable row level security;
create policy "anon insert" on chatbot_logs for insert to anon with check (true);
```

### Paso 3: Obtener las credenciales
En Supabase: **Project Settings → API**
- Copia `Project URL` → es tu `VITE_SUPABASE_URL`
- Copia `anon public` key → es tu `VITE_SUPABASE_ANON_KEY`

### Paso 4: Crear el archivo `.env.local`
En la raíz del proyecto crea el archivo `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```
⚠️ Este archivo NO debe subirse a GitHub (ya está en .gitignore por defecto).

### Paso 5: Reiniciar el servidor de desarrollo
```bash
npm run dev
```

### ¿Cómo ver los formularios enviados?
En Supabase → **Table Editor** → selecciona `contact_messages` o `preinscripciones`.
Cada fila es un formulario enviado, con fecha y hora.

---

## 💰 COSTOS DE MANTENCIÓN — Estimado anual

### Opción A: Económica (recomendada para empezar)

| Servicio | Proveedor | Costo aprox. |
|---|---|---|
| **Dominio** `.cl` | NIC Chile (nic.cl) | ~$15.000 CLP/año |
| **Hosting** (deploy) | Vercel (free tier) | **$0** |
| **Backend / DB** | Supabase (free tier) | **$0** |
| **Total estimado** | | **~$15.000 CLP/año** |

**Vercel free tier incluye:** hosting ilimitado, HTTPS automático, deploys desde GitHub, CDN global.
**Supabase free tier incluye:** 500MB base de datos, 2GB transferencia, 50.000 filas.

> Para una escuela pequeña-mediana, el free tier de ambos servicios es más que suficiente.

---

### Opción B: Con más capacidad (cuando crezca)

| Servicio | Proveedor | Costo aprox. |
|---|---|---|
| **Dominio** `.cl` | NIC Chile | ~$15.000 CLP/año |
| **Hosting** | Vercel Pro | ~$240.000 CLP/año |
| **Backend / DB** | Supabase Pro | ~$300.000 CLP/año |
| **Total estimado** | | **~$555.000 CLP/año** |

---

### Opción C: Dominio `.com` (alternativa)

| Servicio | Proveedor | Costo aprox. |
|---|---|---|
| **Dominio** `.com` | Namecheap / GoDaddy | ~$12.000 CLP/año |
| **Hosting** | Vercel (free tier) | **$0** |
| **Backend** | Supabase (free tier) | **$0** |
| **Total estimado** | | **~$12.000 CLP/año** |

---

### Resumen recomendado
**Para empezar:** usa `escuelagabrielamistral.cl` en NIC Chile (~$15.000/año) + Vercel gratis + Supabase gratis.
**Costo total año 1:** ~$15.000 CLP (~15 USD) solo el dominio.

---

## 🚀 ROADMAP — Plan de trabajo

### ✅ Prototipo 1 (COMPLETO)
- [x] Diseño y estructura de todas las páginas
- [x] Animaciones y sistema de diseño
- [x] Componentes reutilizables
- [x] Formularios de contacto y admisión (código listo)

### 🔲 Prototipo 2 — Contenido real (EN CURSO)
- [x] Dirección: S-40 699, Nueva Imperial
- [x] Teléfono: +56 9 9643 2865
- [x] Ciudad y región correctas
- [x] Supabase conectado (.env.local listo)
- [x] Tablas creadas en Supabase
- [x] Colores azul + amarillo del colegio
- [x] Niveles solo 1° a 8° Básico
- [ ] **Email** — pendiente (el dueño lo pasa después)
- [ ] **Logo** — guardar imagen en `public/images/logo.png`
- [ ] **URL sistema de matrículas** — pendiente (se añade después)
- [ ] Reemplazar fotos de Unsplash con fotos reales del colegio
- [ ] Revisar y ajustar textos (testimonios, historia, FAQ, equipo)
- [ ] Probar formulario de contacto end-to-end

### 🔲 Versión 1.0 — Publicación
- [ ] Registrar dominio (ej: `escuelaimperial.cl` en nic.cl)
- [ ] Conectar dominio a Vercel
- [ ] Deploy a producción con `npm run build`
- [ ] Prueba final en dispositivos móviles
- [ ] Configurar Google Analytics (opcional)

### 🔲 Versión 2.0 — Mejoras futuras (opcional)
- [ ] Chatbot IA integrado con Claude (Supabase Edge Function)
- [ ] Blog / noticias del colegio
- [ ] Portal de apoderados
- [ ] Galería con más fotos y categorías
- [ ] Versión en mapudungun (dado el contexto de La Araucanía)

---

## 📁 Estructura del proyecto

```
src/
├── constants/          ← AQUÍ SE CAMBIA EL CONTENIDO
│   ├── school.ts       ← Datos del colegio
│   ├── home.ts         ← Contenido página Inicio
│   ├── nosotros.ts     ← Historia, equipo, valores
│   ├── niveles.ts      ← Niveles educativos y talleres
│   └── admision.ts     ← Pasos, requisitos, calendario, FAQ
│
├── pages/              ← Páginas (no tocar, solo para agregar secciones)
│   ├── Home/sections/
│   ├── Nosotros/sections/
│   ├── Niveles/sections/
│   ├── Admision/sections/
│   └── Contacto/sections/
│
├── components/         ← Componentes reutilizables (no tocar)
│   ├── ui/             ← Button, Card, Badge, Avatar, etc.
│   ├── shared/         ← AnimatedSection, PageHero, SectionTitle
│   └── layout/         ← Navbar, Footer
│
├── hooks/              ← Lógica reutilizable (no tocar)
└── lib/                ← Configuración Supabase (no tocar)

public/
└── images/             ← AQUÍ VAN LAS FOTOS Y EL LOGO
    ├── logo.png
    ├── hero.jpg
    └── ...
```

---

## ⚡ Comandos útiles

```bash
# Ver la página en modo desarrollo (local)
npm run dev

# Verificar que no hay errores antes de publicar
npm run build

# Ver la versión de producción localmente
npm run preview
```

---

*Última actualización: Prototipo 1 completado — Marzo 2026*
