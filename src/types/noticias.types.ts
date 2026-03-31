export type NoticiaCategoria = 'noticia' | 'evento'
export type BloqueType = 'texto' | 'imagen' | 'video' | 'carrusel'
export type PreinscripcionEstado =
  | 'pendiente'
  | 'llamar_mas_tarde'
  | 'no_contesta'
  | 'entrevista_agendada'
  | 'contactado'
  | 'matriculado'
  | 'descartado'

export interface CarruselItem {
  url: string
  caption: string
}

export interface BloqueContenidoMap {
  texto:    { html: string }
  imagen:   { url: string; caption: string }
  video:    { url: string; title: string }
  carrusel: { items: CarruselItem[] }
}

export interface Bloque<T extends BloqueType = BloqueType> {
  id: string
  noticia_id: string
  tipo: T
  orden: number
  contenido: BloqueContenidoMap[T]
}

// Para el editor local, antes de guardar en DB
export interface LocalBloque {
  _tempId: string
  tipo: BloqueType
  contenido: BloqueContenidoMap[BloqueType]
}

export interface Noticia {
  id: string
  titulo: string
  slug: string
  categoria: NoticiaCategoria
  fecha_evento: string | null
  imagen_portada: string | null
  resumen: string | null
  publicado: boolean
  destacada: boolean
  created_at: string
  updated_at: string
}

export interface NoticiaConBloques extends Noticia {
  bloques: Bloque[]
}

export interface Preinscripcion {
  id: string
  name: string
  email: string
  phone: string | null
  child_name: string
  current_grade: string
  message: string | null
  estado: PreinscripcionEstado
  notas: string | null
  created_at: string
}

export type TrabajadorCategoria = 'directivo' | 'docente' | 'asistente'

export interface Trabajador {
  id: string
  name: string
  role: string
  categoria: TrabajadorCategoria
  photo: string
  orden: number
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  leido: boolean
  created_at: string
}
