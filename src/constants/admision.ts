export const ADMISSION_STEPS = [
  {
    step: 1,
    icon: 'ClipboardList',
    title: 'Anótate en la lista',
    description:
      'Ingresa a la plataforma oficial Anótate del MINEDUC y regístrate en la lista de postulantes. Es gratuito y sin compromiso.',
  },
  {
    step: 2,
    icon: 'Phone',
    title: 'Te contactamos',
    description:
      'Una vez inscrito en la lista, nuestro equipo se comunicará contigo para coordinar la visita y entregarte toda la información.',
  },
  {
    step: 3,
    icon: 'CheckCircle2',
    title: 'Matrícula',
    description:
      'Vienes a la escuela con los documentos requeridos y formalizas la matrícula de forma gratuita para el año escolar.',
  },
] as const

export const ADMISSION_REQUIREMENTS = [
  {
    category: 'Documentos personales',
    items: [
      'Cédula de identidad del estudiante o certificado de nacimiento (obligatorio)',
      'Cédula de identidad del apoderado (obligatorio)',
    ],
  },
  {
    category: 'Documentos académicos',
    items: [
      'Certificado de estudios',
      'Informe de notas (solo cuando se solicita la incorporación en el transcurso del año)',
      'Informe PIE o de atención diferenciada si el alumno tiene NEE (si aplica)',
      'Documento de traslado',
    ],
  },
] as const

export const BENEFICIOS = [
  {
    icon: 'BadgeCheck',
    title: 'Matrícula y escolaridad gratuita',
    desc: 'Sin costos de matrícula ni mensualidades. Educación de calidad completamente gratuita para todos.',
  },
  {
    icon: 'Bus',
    title: 'Transporte escolar propio',
    desc: 'Moderna locomoción escolar para facilitar el acceso desde distintos sectores de la comuna.',
  },
  {
    icon: 'Trophy',
    title: 'Becas para alumnos destacados',
    desc: 'Beca Gabriel Mistral (alto rendimiento) y Beca Mi Notebook (permanencia escolar).',
  },
  {
    icon: 'HeartHandshake',
    title: 'Equipo de apoyo especializado',
    desc: 'Educadoras diferenciales, psicóloga, fonoaudióloga y psicopedagogas permanentes en la escuela.',
  },
  {
    icon: 'Palette',
    title: 'Academias artísticas, deportivas e inglés',
    desc: 'Danza, fútbol, polideportivo, manualidades, inglés y matemática extracurricular.',
  },
  {
    icon: 'Clock',
    title: 'Jornada escolar completa',
    desc: 'JEC de 1° a 8° básico. Primer ciclo con horario diferido y asistentes de aula.',
  },
  {
    icon: 'Heart',
    title: 'Formación cristiana y valórica',
    desc: 'Valores, fe y principios que forman personas íntegras y comprometidas con su comunidad.',
  },
  {
    icon: 'Monitor',
    title: 'Infraestructura tecnológica',
    desc: 'Laboratorio de computación moderno y circuito cerrado de televisión en todo el establecimiento.',
  },
] as const

export const ADMISSION_FAQ = [
  {
    question: '¿Para qué niveles hay cupos disponibles?',
    answer:
      'La Escuela Gabriela Mistral atiende desde 1° hasta 8° Año Básico (educación básica completa). Aceptamos alumnos durante todo el año según disponibilidad de cupos en cada nivel. Contáctanos directamente para consultar cupos en el nivel que necesitas.',
  },
  {
    question: '¿El proceso de admisión tiene algún costo?',
    answer:
      'No. La matrícula y la escolaridad son completamente gratuitas. No hay mensualidades ni cobros de ningún tipo. La Escuela Gabriela Mistral es un establecimiento particular subvencionado acogido al régimen de gratuidad.',
  },
  {
    question: '¿Aceptan alumnos con necesidades educativas especiales (NEE)?',
    answer:
      'Sí. Contamos con un equipo PIE (Programa de Integración Escolar) compuesto por educadoras diferenciales, psicólogo y fonoaudiólogo. Para mayor información consulte directamente con la escuela.',
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
    question: '¿Puedo inscribir a mi hijo en cualquier momento del año?',
    answer:
      'Sí. Aceptamos alumnos durante todo el año según disponibilidad de cupos en cada nivel. No es necesario esperar un período específico de admisión. Contáctanos al +56 45 261 2597 o visítanos en General Urrutia N° 763, Nueva Imperial.',
  },
] as const
