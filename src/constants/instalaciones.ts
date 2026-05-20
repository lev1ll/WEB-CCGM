export interface Instalacion {
  id: string
  name: string
  description: string
}

export const INSTALACIONES: Instalacion[] = [
  {
    id: 'sala-computacion',
    name: 'Sala de Computación',
    description: 'Equipada con computadores modernos para que nuestros alumnos desarrollen habilidades digitales desde temprana edad.',
  },
  {
    id: 'gimnasio',
    name: 'Gimnasio',
    description: 'Espacio deportivo techado para clases de educación física, actividades recreativas y torneos internos.',
  },
  {
    id: 'patio',
    name: 'Patio',
    description: 'Amplio patio al aire libre donde los estudiantes comparten, juegan y se desarrollan durante los recreos.',
  },
  {
    id: 'comedor',
    name: 'Comedor',
    description: 'Comedor equipado donde se sirve alimentación saludable a través del programa JUNAEB para nuestros alumnos.',
  },
  {
    id: 'sala-clases',
    name: 'Salas de Clases',
    description: 'Salas amplias, iluminadas y equipadas con pizarras digitales y material didáctico para un aprendizaje efectivo.',
  },
]
