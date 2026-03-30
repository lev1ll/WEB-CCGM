export const ADMISSION_STEPS = [
  {
    step: 1,
    icon: 'FileText',
    title: 'Pre-inscripción',
    description:
      'Completa el formulario de pre-inscripción en línea con los datos del alumno y la familia. Sin costo y sin compromiso.',
  },
  {
    step: 2,
    icon: 'CalendarCheck',
    title: 'Entrevista familiar',
    description:
      'El equipo directivo agenda una entrevista con los apoderados y el postulante para conocerse y responder preguntas.',
  },
  {
    step: 3,
    icon: 'ClipboardList',
    title: 'Evaluación diagnóstica',
    description:
      'El alumno realiza una evaluación para conocer su nivel actual y asegurar la mejor integración al curso.',
  },
  {
    step: 4,
    icon: 'CheckCircle2',
    title: 'Matrícula',
    description:
      'Una vez aceptado, se completa la documentación requerida y se formaliza la matrícula para el año escolar.',
  },
] as const

export const ADMISSION_REQUIREMENTS = [
  {
    category: 'Documentos personales',
    items: [
      'Certificado de nacimiento del alumno (original)',
      'Cédula de identidad del alumno (copia)',
      'Carnet de vacunas al día',
      'Cédulas de identidad de ambos apoderados o tutor legal',
      'Certificado de residencia (boleta de servicio básico)',
    ],
  },
  {
    category: 'Documentos académicos',
    items: [
      'Informe de notas del año anterior (original timbrado por el establecimiento de origen)',
      'Certificado de conducta del establecimiento anterior',
      'Informe de personalidad del establecimiento anterior',
      'Informe PIE o de atención diferenciada si el alumno tiene NEE (si aplica)',
      'Carta de retiro del establecimiento de origen',
    ],
  },
] as const

export const ADMISSION_CALENDAR = [
  {
    period: 'Apertura de pre-inscripciones',
    dateRange: 'Septiembre 2025',
    description: 'Disponible el formulario de pre-inscripción en línea para el año 2026.',
    isActive: false,
  },
  {
    period: 'Entrevistas familiares',
    dateRange: 'Octubre – Noviembre 2025',
    description: 'Agendamiento y realización de entrevistas con familias postulantes.',
    isActive: true,
  },
  {
    period: 'Evaluaciones diagnósticas',
    dateRange: 'Noviembre 2025',
    description: 'Aplicación de evaluaciones a los postulantes citados.',
    isActive: false,
  },
  {
    period: 'Comunicación de resultados',
    dateRange: 'Noviembre – Diciembre 2025',
    description: 'Notificación a las familias sobre el resultado del proceso de admisión.',
    isActive: false,
  },
  {
    period: 'Período de matrícula',
    dateRange: 'Diciembre 2025 – Enero 2026',
    description: 'Firma de documentación y formalización de la matrícula para el año escolar 2026.',
    isActive: false,
  },
] as const

export const ADMISSION_FAQ = [
  {
    question: '¿Para qué niveles hay cupos disponibles?',
    answer:
      'La Escuela Gabriela Mistral atiende desde 1° hasta 8° Año Básico (educación básica completa). Los cupos varían según el nivel y la disponibilidad de cada año. Te recomendamos inscribirte con anticipación para asegurar un lugar.',
  },
  {
    question: '¿El proceso de admisión tiene algún costo?',
    answer:
      'La pre-inscripción y la entrevista familiar son completamente gratuitas. Solo al momento de formalizar la matrícula se cobra el monto correspondiente, el cual se informa en la entrevista familiar.',
  },
  {
    question: '¿Aceptan alumnos con necesidades educativas especiales (NEE)?',
    answer:
      'Sí. Contamos con un equipo PIE (Programa de Integración Escolar) compuesto por educadoras diferenciales, psicólogo y fonoaudiólogo. La escuela acepta postulantes con NEE independientemente de la disponibilidad de cupos PIE; sin embargo, si los cupos PIE están completos al momento de la matrícula, no podemos garantizar la asignación de apoyo diferenciado de forma inmediata. En ese caso, el alumno queda en lista de espera para el próximo cupo disponible. Para más información consulta directamente con la Coordinadora PIE.',
  },
  {
    question: '¿Cuál es el enfoque valórico de la escuela?',
    answer:
      'Somos una escuela sustentada en valores cristianos. Nuestro accionar formativo se centra en valores como el amor al prójimo, el respeto mutuo, la honestidad, la perseverancia, la solidaridad y la fe. Formamos ciudadanos íntegros y comprometidos con su comunidad.',
  },
  {
    question: '¿La escuela cuenta con beneficios de alimentación o transporte?',
    answer:
      'Sí. A través de los programas de apoyo del Estado y la gestión de la Corporación Educacional GM, apoyamos a estudiantes vulnerables con alimentación (JUNAEB), transporte de acercamiento y otros beneficios. Consulta en secretaría para más información según tu situación.',
  },
  {
    question: '¿Puedo inscribir a mi hijo fuera del período de admisión?',
    answer:
      'Las admisiones fuera de período se evalúan caso a caso según la disponibilidad de cupos en cada nivel. Contáctanos directamente al +56 9 9643 2865 o visítanos en General Urrutia N° 763, Nueva Imperial.',
  },
] as const
