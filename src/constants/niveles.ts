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
    id: 'primer-ciclo',
    name: 'Primer Ciclo',
    grades: '1° a 4° Básico',
    ageRange: '6 a 10 años',
    icon: 'BookOpen',
    description:
      'Los primeros cuatro años de escolaridad son la base de todo aprendizaje posterior. Desarrollamos la lectoescritura, el pensamiento matemático y las habilidades de convivencia en un ambiente cálido, estructurado e inclusivo, preparando a cada estudiante para avanzar con confianza.',
    highlights: [
      'Lectura y escritura con método silábico y global',
      'Matemática concreta con material manipulable',
      'Hábitos y rutinas escolares',
      'Educación física, motricidad y deporte',
      'Talleres de convivencia y aprendizaje socioemocional',
      'Ciencias Naturales',
      'Historia, Geografía y Ciencias Sociales',
      'Talleres de inglés: aproximación al aprendizaje del idioma',
      'Grupos de recuperación de aprendizajes',
      'Academias: Fútbol, Polideportivo, Danza, Matemáticas, Reciclaje',
    ],
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'segundo-ciclo',
    name: 'Segundo Ciclo',
    grades: '5° a 8° Básico',
    ageRange: '10 a 14 años',
    icon: 'GraduationCap',
    description:
      'La etapa de mayor autonomía académica. Profundizamos en todas las asignaturas del plan de estudios, fomentamos el pensamiento crítico y la investigación, y preparamos a nuestros alumnos con sólidos fundamentos para enfrentar con éxito la educación media y la vida.',
    highlights: [
      'Historia, Geografía y Ciencias Sociales',
      'Ciencias Naturales: Biología, Física y Química',
      'Talleres de Física y Química (7° y 8° Básico)',
      'Taller de Geometría',
      'Inglés con habilidades de escritura y comunicación oral',
      'Talleres de convivencia y aprendizaje socioemocional',
      'Grupos de recuperación de aprendizajes',
      'Educación tecnológica',
      'Academias: Fútbol, Polideportivo, Danza, Matemáticas, Reciclaje, Inglés',
    ],
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
]

export type ExtraescolarCategory = 'deportivo' | 'artistico' | 'academico'
export type ExtraescolarCycle = 'ambos' | 'segundo'

export interface Extraescolar {
  name: string
  icon: string
  category: ExtraescolarCategory
  cycle: ExtraescolarCycle
}

export const EXTRAESCOLARES: Extraescolar[] = [
  { name: 'Fútbol',        icon: 'Trophy',        category: 'deportivo', cycle: 'ambos'   },
  { name: 'Polideportivo', icon: 'Dumbbell',       category: 'deportivo', cycle: 'ambos'   },
  { name: 'Danza',         icon: 'Music',          category: 'artistico', cycle: 'ambos'   },
  { name: 'Matemáticas',   icon: 'Calculator',     category: 'academico', cycle: 'ambos'   },
  { name: 'Reciclaje',     icon: 'Recycle',        category: 'academico', cycle: 'ambos'   },
  { name: 'Inglés',        icon: 'Globe',          category: 'academico', cycle: 'segundo' },
]

export const CATEGORY_LABELS: Record<ExtraescolarCategory, string> = {
  deportivo: 'Deportivo',
  artistico: 'Artístico',
  academico: 'Académico',
}

export const CYCLE_LABELS: Record<ExtraescolarCycle, string> = {
  ambos:   'Ambos ciclos',
  segundo: '2° ciclo',
}
