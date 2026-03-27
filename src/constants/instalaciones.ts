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
    name: 'María González Rojas',
    role: 'Directora',
    categoria: 'directivo',
    photo: '',
    initials: 'MG',
  },
  {
    id: 'jefe-utp',
    name: 'Carlos Muñoz Pérez',
    role: 'Jefe de UTP',
    categoria: 'directivo',
    photo: '',
    initials: 'CM',
  },
  {
    id: 'pie',
    name: 'Ana Soto Vargas',
    role: 'Coordinadora PIE',
    categoria: 'directivo',
    photo: '',
    initials: 'AS',
  },
  // ── Docentes ──
  {
    id: 'docente-1',
    name: 'Lucía Ramírez Torres',
    role: 'Profesora 1° y 2° Básico',
    categoria: 'docente',
    photo: '',
    initials: 'LR',
  },
  {
    id: 'docente-2',
    name: 'Jorge Flores Silva',
    role: 'Profesor 3° y 4° Básico',
    categoria: 'docente',
    photo: '',
    initials: 'JF',
  },
  {
    id: 'docente-3',
    name: 'Patricia Vega Morales',
    role: 'Profesora 5° y 6° Básico',
    categoria: 'docente',
    photo: '',
    initials: 'PV',
  },
  {
    id: 'docente-4',
    name: 'Roberto Díaz Castro',
    role: 'Profesor 7° y 8° Básico',
    categoria: 'docente',
    photo: '',
    initials: 'RD',
  },
  {
    id: 'docente-5',
    name: 'Claudia Ortiz Núñez',
    role: 'Profesora de Educación Física',
    categoria: 'docente',
    photo: '',
    initials: 'CO',
  },
  // ── Asistentes ──
  {
    id: 'asistente-1',
    name: 'Sandra López Reyes',
    role: 'Asistente de Educación',
    categoria: 'asistente',
    photo: '',
    initials: 'SL',
  },
  {
    id: 'asistente-2',
    name: 'Miguel Herrera Campos',
    role: 'Inspector General',
    categoria: 'asistente',
    photo: '',
    initials: 'MH',
  },
  {
    id: 'asistente-3',
    name: 'Verónica Pinto Araya',
    role: 'Secretaria',
    categoria: 'asistente',
    photo: '',
    initials: 'VP',
  },
]
