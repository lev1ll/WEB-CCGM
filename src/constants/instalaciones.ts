export interface Instalacion {
  id: string
  name: string
  description: string
  image: string
  icon: string
}

export const INSTALACIONES: Instalacion[] = [
  {
    id: 'sala-computacion',
    name: 'Sala de Computación',
    description: 'Equipada con computadores modernos para que nuestros alumnos desarrollen habilidades digitales desde temprana edad.',
    image: '/images/instalaciones/sala-computacion.jpg',
    icon: 'Monitor',
  },
  {
    id: 'gimnasio',
    name: 'Gimnasio',
    description: 'Espacio deportivo techado para clases de educación física, actividades recreativas y torneos internos.',
    image: '/images/instalaciones/gimnasio.jpg',
    icon: 'Dumbbell',
  },
  {
    id: 'patio',
    name: 'Patio',
    description: 'Amplio patio al aire libre donde los estudiantes comparten, juegan y se desarrollan durante los recreos.',
    image: '/images/instalaciones/patio.jpg',
    icon: 'TreePine',
  },
  {
    id: 'comedor',
    name: 'Comedor',
    description: 'Comedor equipado donde se sirve alimentación saludable a través del programa JUNAEB para nuestros alumnos.',
    image: '/images/instalaciones/comedor.jpg',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'sala-clases',
    name: 'Salas de Clases',
    description: 'Salas amplias, iluminadas y equipadas con pizarras digitales y material didáctico para un aprendizaje efectivo.',
    image: '/images/instalaciones/sala-clases.jpg',
    icon: 'School',
  },
]

// ─── EQUIPO / TRABAJADORES ───────────────────────────────────────────────────
// Desactivado hasta tener fotos y datos del personal.
// Cuando esté listo, descomentar en Nosotros/index.tsx

export type CargoCategoria = 'directivo' | 'docente' | 'asistente'

export interface Trabajador {
  id: string
  name: string
  role: string
  categoria: CargoCategoria
  photo: string   // ruta en public/images/equipo/nombre.jpg
  initials: string
}

export const CATEGORIA_LABELS: Record<CargoCategoria, string> = {
  directivo: 'Equipo Directivo',
  docente:   'Docentes',
  asistente: 'Asistentes de la Educación',
}

export const TRABAJADORES: Trabajador[] = [
  // ── Directivos ──
  {
    id: 'director',
    name: '',           // TODO: nombre real
    role: 'Director/a',
    categoria: 'directivo',
    photo: '',
    initials: 'D',
  },
  {
    id: 'jefe-utp',
    name: '',           // TODO: nombre real
    role: 'Jefe/a de UTP',
    categoria: 'directivo',
    photo: '',
    initials: 'U',
  },
  // ── Docentes (agregar uno por cada profesor) ──
  {
    id: 'docente-1',
    name: '',           // TODO: nombre real
    role: 'Profesora 1° y 2° Básico',
    categoria: 'docente',
    photo: '',
    initials: 'P',
  },
  {
    id: 'docente-2',
    name: '',           // TODO: nombre real
    role: 'Profesor 3° y 4° Básico',
    categoria: 'docente',
    photo: '',
    initials: 'P',
  },
  // ── Asistentes ──
  {
    id: 'asistente-1',
    name: '',           // TODO: nombre real
    role: 'Asistente de Educación',
    categoria: 'asistente',
    photo: '',
    initials: 'A',
  },
]
