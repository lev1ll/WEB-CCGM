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
      'Una vez aceptado, se firma el contrato de matrícula y se completa la documentación requerida.',
  },
] as const

export const ADMISSION_REQUIREMENTS = [
  {
    category: 'Documentos personales',
    items: [
      'Certificado de nacimiento del alumno (original)',
      'Cédula de identidad del alumno (copia)',
      'Carnet de vacunas al día',
      'Cédulas de identidad de ambos apoderados',
      'Certificado de residencia (servicio básico)',
    ],
  },
  {
    category: 'Documentos académicos',
    items: [
      'Informe de notas del año anterior (original timbrado)',
      'Certificado de conducta del establecimiento anterior',
      'Informe de personalidad del establecimiento anterior',
      'Informe de atención diferenciada (si aplica)',
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
    description: 'Notificación por correo electrónico a las familias sobre el resultado del proceso.',
    isActive: false,
  },
  {
    period: 'Período de matrícula',
    dateRange: 'Diciembre 2025 – Enero 2026',
    description: 'Firma de contratos y pago de matrícula para el año escolar 2026.',
    isActive: false,
  },
] as const

export const ADMISSION_FAQ = [
  {
    question: '¿Hay cupos disponibles para todos los niveles?',
    answer:
      'Los cupos varían según el nivel y año. Pre-Kínder, Kínder y 1° Básico tienen cupos definidos al inicio del proceso. Para los demás niveles, los cupos dependen de las vacantes disponibles. Te recomendamos inscribirte pronto.',
  },
  {
    question: '¿El proceso de admisión tiene algún costo?',
    answer:
      'La pre-inscripción y la entrevista familiar son completamente gratuitas. Solo al momento de formalizar la matrícula se cobra el monto correspondiente, detallado en el contrato.',
  },
  {
    question: '¿Aceptan alumnos con necesidades educativas especiales?',
    answer:
      'Sí. Contamos con un equipo de apoyo educativo (psicólogo, educadora diferencial, fonoaudióloga) que evalúa cada caso. La decisión de admisión considera las posibilidades reales de acompañamiento que podemos ofrecer.',
  },
  {
    question: '¿Cuáles son los valores de mensualidad?',
    answer:
      'Los valores de mensualidad varían según el nivel educativo. Una vez iniciado el proceso de admisión, se entrega el detalle arancelario completo en la entrevista familiar.',
  },
  {
    question: '¿Existe alguna beca o beneficio económico?',
    answer:
      'Sí. El colegio tiene convenios de beca con fundaciones cristianas y aplica la Ley SEP (Subvención Escolar Preferencial) para alumnos prioritarios. Consulta en Administración para más información.',
  },
  {
    question: '¿Puedo inscribir a mi hijo fuera del período de admisión?',
    answer:
      'Las admisiones fuera de período se evalúan caso a caso según la disponibilidad de cupos. Contáctanos directamente para consultar la situación de tu hijo.',
  },
] as const
