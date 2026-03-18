export interface Nivel {
  id: string
  name: string
  grades: string
  ageRange: string
  icon: string
  description: string
  highlights: readonly string[]
  color: string
  bgColor: string
}

export const NIVELES: Nivel[] = [
  {
    id: 'primero-segundo',
    name: '1° y 2° Básico',
    grades: '1° y 2° Básico',
    ageRange: '6 a 8 años',
    icon: 'Smile',
    description:
      'Los primeros años de la escuela son fundamentales. Desarrollamos la lectoescritura, el pensamiento matemático inicial y las habilidades de convivencia en un ambiente cálido y estructurado.',
    highlights: [
      'Lectura y escritura con método silábico y global',
      'Matemática concreta con material manipulable',
      'Hábitos y rutinas escolares',
      'Educación física y psicomotricidad',
      'Inglés inicial (2 hrs/semana)',
      'Taller de valores y convivencia',
    ],
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'tercero-cuarto',
    name: '3° y 4° Básico',
    grades: '3° y 4° Básico',
    ageRange: '8 a 10 años',
    icon: 'BookOpen',
    description:
      'Consolidamos las habilidades de lectura y escritura, ampliamos el pensamiento matemático y comenzamos el estudio de las ciencias naturales y sociales de forma más estructurada.',
    highlights: [
      'Comprensión lectora y producción de textos',
      'Operaciones y resolución de problemas',
      'Ciencias Naturales y Sociales',
      'Inglés con énfasis en comunicación oral',
      'Talleres artísticos y musicales',
      'Proyecto lector trimestral',
    ],
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'quinto-sexto',
    name: '5° y 6° Básico',
    grades: '5° y 6° Básico',
    ageRange: '10 a 12 años',
    icon: 'Lightbulb',
    description:
      'Etapa de mayor autonomía académica. Profundizamos en todas las asignaturas del plan de estudios y fomentamos el pensamiento crítico, la investigación y el trabajo colaborativo.',
    highlights: [
      'Historia, Geografía y Ciencias Sociales',
      'Biología, Física y Química introductorias',
      'Inglés con habilidades de escritura',
      'Educación tecnológica y computación',
      'Orientación y proyecto de vida',
      'Talleres de liderazgo estudiantil',
    ],
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'septimo-octavo',
    name: '7° y 8° Básico',
    grades: '7° y 8° Básico',
    ageRange: '12 a 14 años',
    icon: 'GraduationCap',
    description:
      'La etapa final de la enseñanza básica. Preparamos a nuestros alumnos para la transición a la educación media con sólidos fundamentos académicos, orientación vocacional y formación en valores.',
    highlights: [
      'Preparación para pruebas de diagnóstico',
      'Orientación vocacional y elección de liceo',
      'Ciencias con laboratorio experimental',
      'Inglés con certificación básica',
      'Consejo de curso y liderazgo estudiantil',
      'Proyecto de ciencias anual',
    ],
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
]

export type ExtraescolarCategory = 'deportivo' | 'artistico' | 'academico' | 'tecnologico'

export interface Extraescolar {
  name: string
  icon: string
  category: ExtraescolarCategory
}

export const EXTRAESCOLARES: Extraescolar[] = [
  { name: 'Fútbol', icon: 'Trophy', category: 'deportivo' },
  { name: 'Básquetbol', icon: 'Circle', category: 'deportivo' },
  { name: 'Atletismo', icon: 'Wind', category: 'deportivo' },
  { name: 'Voleibol', icon: 'Circle', category: 'deportivo' },
  { name: 'Música', icon: 'Music', category: 'artistico' },
  { name: 'Teatro', icon: 'Drama', category: 'artistico' },
  { name: 'Danza', icon: 'Star', category: 'artistico' },
  { name: 'Coro', icon: 'Mic', category: 'artistico' },
  { name: 'Robótica', icon: 'Bot', category: 'tecnologico' },
  { name: 'Programación', icon: 'Code', category: 'tecnologico' },
  { name: 'Diseño digital', icon: 'Palette', category: 'tecnologico' },
  { name: 'Matemática olímpica', icon: 'Calculator', category: 'academico' },
  { name: 'Inglés avanzado', icon: 'Globe', category: 'academico' },
  { name: 'Debate', icon: 'MessageSquare', category: 'academico' },
  { name: 'Ciencia creativa', icon: 'FlaskConical', category: 'academico' },
]

export const CATEGORY_LABELS: Record<ExtraescolarCategory, string> = {
  deportivo: 'Deportivo',
  artistico: 'Artístico',
  tecnologico: 'Tecnológico',
  academico: 'Académico',
}
