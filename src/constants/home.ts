export const HERO_CONTENT = {
  eyebrow: 'Escuela Gabriela Mistral · Nueva Imperial, Araucanía',
  headline: 'Formando personas con valores para un mundo mejor',
  subheadline:
    'Ofrecemos una educación de excelencia de 1° a 8° Básico, integrando conocimiento, carácter y comunidad en el corazón de La Araucanía.',
  cta1: { label: 'Conoce más', href: '/nosotros' },
  cta2: { label: 'Contáctanos', href: '/contacto' },
} as const

export const HOME_STATS = [
  { value: 30, suffix: '+', label: 'Años de historia' },
  { value: 800, suffix: '+', label: 'Alumnos' },
  { value: 45, suffix: '', label: 'Docentes titulados' },
] as const

export const HOME_VALORES = [
  {
    icon: 'Heart',
    title: 'Fe',
    description: 'Formamos personas con una fe sólida y activa, fundamento de toda nuestra labor educativa.',
  },
  {
    icon: 'Star',
    title: 'Excelencia',
    description: 'Buscamos el máximo desarrollo de los talentos y capacidades de cada estudiante.',
  },
  {
    icon: 'Users',
    title: 'Comunidad',
    description: 'Somos una familia donde apoderados, alumnos y docentes caminamos juntos.',
  },
  {
    icon: 'Shield',
    title: 'Integridad',
    description: 'Enseñamos con el ejemplo: coherencia entre lo que decimos, creemos y hacemos.',
  },
  {
    icon: 'Lightbulb',
    title: 'Innovación',
    description: 'Incorporamos tecnología y metodologías modernas al servicio del aprendizaje.',
  },
  {
    icon: 'BookOpen',
    title: 'Saber',
    description: 'Promovemos el amor por el conocimiento y el aprendizaje continuo a lo largo de la vida.',
  },
] as const

export const HOME_TESTIMONIOS = [
  {
    name: 'María González',
    role: 'Apoderada · 3° Básico',
    text: 'El CCGM transformó la vida de mi hijo. No solo aprendió matemáticas y lenguaje — aprendió a ser una buena persona. Los profesores se preocupan genuinamente de cada niño.',
    initials: 'MG',
  },
  {
    name: 'Carlos Muñoz',
    role: 'Apoderado · 1° Medio',
    text: 'Llevamos 6 años en el colegio y nunca hemos tenido dudas. La formación valórica combinada con la excelencia académica es difícil de encontrar. Recomiendo el CCGM 100%.',
    initials: 'CM',
  },
  {
    name: 'Andrea Rojas',
    role: 'Apoderada · Pre-Kínder',
    text: 'Desde el primer día sentimos que nuestra hija era parte de una gran familia. El ambiente es cálido, seguro y lleno de amor. Es exactamente lo que buscábamos.',
    initials: 'AR',
  },
  {
    name: 'Felipe Torres',
    role: 'Apoderado · 4° Medio',
    text: 'Mi hijo egresó con las herramientas para enfrentar la universidad y la vida. La educación integral que entrega el CCGM es invaluable. Estamos muy agradecidos.',
    initials: 'FT',
  },
  {
    name: 'Claudia Pinto',
    role: 'Apoderada · 5° Básico',
    text: 'La comunidad del CCGM es única. Hay talleres, actividades, participación de los papás... Es un colegio que realmente involucra a las familias en la educación.',
    initials: 'CP',
  },
] as const

export const HOME_GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop',
    alt: 'Alumnos en clases',
    span: 'wide' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop',
    alt: 'Lectura en biblioteca',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop',
    alt: 'Actividades deportivas',
    span: 'tall' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop',
    alt: 'Trabajo en equipo',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop',
    alt: 'Ciencias y experimentos',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop',
    alt: 'Estudio y libros',
    span: 'wide' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=600&auto=format&fit=crop',
    alt: 'Actividades artísticas',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dab?w=600&auto=format&fit=crop',
    alt: 'Clases al aire libre',
    span: 'normal' as const,
  },
] as const

export const HOME_FAQ = [
  {
    question: '¿Cuáles son los niveles educativos que ofrece el CCGM?',
    answer:
      'Ofrecemos educación desde Pre-Kínder (4 años) hasta 4° Medio (17-18 años), abarcando los niveles de Educación Parvularia, Educación Básica (1° a 8°) y Educación Media (1° a 4° Medio).',
  },
  {
    question: '¿Cómo es el proceso de admisión?',
    answer:
      'El proceso de admisión comienza con una pre-inscripción en línea, seguida de una entrevista con la familia y el alumno. Revisamos el historial académico y realizamos una evaluación diagnóstica. Todo el proceso está detallado en nuestra página de Admisión.',
  },
  {
    question: '¿El colegio tiene jornada completa?',
    answer:
      'Sí, tenemos jornada escolar completa (JEC). Los horarios varían según el nivel: Parvularia tiene horario de media jornada y jornada completa, mientras que Básica y Media funcionan en jornada completa con horarios de 8:00 a 16:00 hrs.',
  },
  {
    question: '¿Qué actividades extraprogramáticas ofrecen?',
    answer:
      'Contamos con talleres deportivos (fútbol, básquetbol, atletismo), artísticos (música, teatro, danza), académicos (robótica, inglés avanzado, matemática olímpica) y tecnológicos (programación, diseño). Muchos talleres son sin costo adicional.',
  },
  {
    question: '¿Cuáles son los valores cristianos que promueven?',
    answer:
      'Promovemos valores como el amor al prójimo, la integridad, la responsabilidad, el servicio y la búsqueda de la verdad, siempre desde una perspectiva cristiana ecuménica que respeta la diversidad de creencias de nuestras familias.',
  },
  {
    question: '¿El colegio tiene orientación religiosa obligatoria?',
    answer:
      'Si bien somos un colegio de orientación cristiana, respetamos la libertad de creencia. La clase de Religión es electiva según la normativa ministerial. Nuestros valores se transmiten transversalmente en el ambiente escolar, no de forma impositiva.',
  },
  {
    question: '¿Cuándo abren el proceso de matrícula?',
    answer:
      'El proceso de matrícula para nuevos alumnos generalmente abre en octubre/noviembre de cada año para el año escolar siguiente. Los alumnos actuales tienen proceso de renovación prioritaria en septiembre. Suscríbete a nuestro newsletter para recibir notificaciones.',
  },
] as const
