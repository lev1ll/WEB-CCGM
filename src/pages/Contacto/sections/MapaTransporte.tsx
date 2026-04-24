import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Bus, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Fix Leaflet default icon (Vite strips assets)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Tipos ─────────────────────────────────────────────────────────
type Chip = { icon: 'Bus' | 'MapPin'; text: string }
type RutaBus = { id: string; nombre: string; color: string; puntos: [number, number][] }
type ZonaCobertura = { id: string; nombre: string; descripcion: string; latitud: number; longitud: number; radio_metros: number }
type FotoBus = { slot: number; src: string; alt: string }

// ── Fallbacks hardcodeados (por si la DB está vacía) ──────────────
const ESCUELA: [number, number] = [-38.7428, -72.9521]
const CENTRO_IMPERIAL: [number, number] = [-38.7398, -72.9492]

const FALLBACK_CHIPS: Chip[] = [
  { icon: 'Bus', text: 'Toda Nueva Imperial' },
  { icon: 'MapPin', text: 'Hasta Supermercado Lily, Labranza' },
]

// ── Icono escuela ─────────────────────────────────────────────────
const iconEscuela = L.divIcon({
  className: '',
  html: `<div style="
    background:#1d4ed8;color:white;border-radius:50%;
    width:36px;height:36px;display:flex;align-items:center;
    justify-content:center;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.4);font-size:18px;
  ">🏫</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

function FitBounds({ puntos }: { puntos: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (puntos.length > 1) map.fitBounds(L.latLngBounds(puntos), { padding: [40, 40] })
  }, [map, puntos])
  return null
}

const ICON_COMPONENTS = { Bus, MapPin }

export function MapaTransporte() {
  const [titulo, setTitulo] = useState('Servicio de movilización escolar')
  const [subtitulo, setSubtitulo] = useState('Cubrimos toda Nueva Imperial y llegamos hasta la primera zona de Labranza')
  const [chips, setChips] = useState<Chip[]>(FALLBACK_CHIPS)
  const [rutas, setRutas] = useState<RutaBus[]>([])
  const [zonas, setZonas] = useState<ZonaCobertura[]>([])
  const [fotos, setFotos] = useState<FotoBus[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoaded(true); return }
    Promise.all([
      supabase.from('config_movilizacion').select('titulo,subtitulo,chips').eq('id', 1).single(),
      supabase.from('rutas_bus').select('id,nombre,color,puntos').eq('activo', true).order('orden'),
      supabase.from('zonas_cobertura').select('id,nombre,descripcion,latitud,longitud,radio_metros').eq('activo', true).order('orden'),
      supabase.from('movilizacion_fotos').select('slot,src,alt').order('slot'),
    ]).then(([cfg, ruts, zon, fots]) => {
      if (cfg.data) {
        setTitulo(cfg.data.titulo)
        setSubtitulo(cfg.data.subtitulo)
        if (Array.isArray(cfg.data.chips) && cfg.data.chips.length > 0) setChips(cfg.data.chips)
      }
      if (ruts.data && ruts.data.length > 0) setRutas(ruts.data as RutaBus[])
      if (zon.data && zon.data.length > 0) setZonas(zon.data as ZonaCobertura[])
      if (fots.data && fots.data.length > 0) setFotos(fots.data as FotoBus[])
      setLoaded(true)
    })
  }, [])

  // Todos los puntos de todas las rutas (para FitBounds)
  const todosPuntos = rutas.flatMap(r => r.puntos)
  const mapCenter: [number, number] = todosPuntos.length > 0 ? todosPuntos[Math.floor(todosPuntos.length / 2)] : CENTRO_IMPERIAL

  const LEYENDA = [
    { color: '#2563eb', label: 'Ruta del bus (ida y vuelta)' },
    { color: '#3b82f680', label: 'Zonas de cobertura' },
  ]

  return (
    <SectionWrapper variant="secondary">
      <SectionTitle title={titulo} subtitle={subtitulo} />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 space-y-4">
        {/* Mapa */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-md" style={{ height: 480 }}>
          {loaded && (
            <MapContainer
              center={mapCenter}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              zoomControl
              scrollWheelZoom
              zoomSnap={0.5}
              zoomDelta={0.5}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {todosPuntos.length > 1 && <FitBounds puntos={todosPuntos} />}

              {/* Rutas */}
              {rutas.flatMap(r =>
                r.puntos.length > 1 ? [
                  <Polyline key={`${r.id}-main`} positions={r.puntos} pathOptions={{ color: r.color, weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }} />,
                  <Polyline key={`${r.id}-halo`} positions={r.puntos} pathOptions={{ color: '#93c5fd', weight: 10, opacity: 0.3, lineCap: 'round' }} />,
                ] : []
              )}

              {/* Zonas de cobertura */}
              {zonas.map(z => (
                <Circle
                  key={z.id}
                  center={[z.latitud, z.longitud]}
                  radius={z.radio_metros}
                  pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.12, weight: 1.5, dashArray: '6 4' }}
                >
                  {z.descripcion && (
                    <Popup>
                      <strong>{z.nombre}</strong><br />{z.descripcion}
                    </Popup>
                  )}
                </Circle>
              ))}

              {/* Marker escuela */}
              <Marker position={ESCUELA} icon={iconEscuela}>
                <Popup>
                  <strong>Escuela Gabriela Mistral</strong><br />
                  General Urrutia 763, Nueva Imperial
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        {/* Leyenda + chips */}
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div className="flex flex-wrap gap-4">
            {LEYENDA.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block w-5 h-2 rounded-full" style={{ background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {chips.map((chip, i) => {
              const Icon = ICON_COMPONENTS[chip.icon]
              return <Chip key={i} icon={<Icon className="h-3.5 w-3.5" />} text={chip.text} />
            })}
          </div>
        </div>

        {/* Carrusel de fotos de buses */}
        {fotos.length > 0 && <BusCarousel fotos={fotos} />}
      </AnimatedSection>
    </SectionWrapper>
  )
}

function BusCarousel({ fotos }: { fotos: FotoBus[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (fotos.length < 2) return
    const id = setInterval(() => setCurrent(c => (c + 1) % fotos.length), 4000)
    return () => clearInterval(id)
  }, [fotos.length])

  const prev = () => setCurrent(c => (c - 1 + fotos.length) % fotos.length)
  const next = () => setCurrent(c => (c + 1) % fotos.length)

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border shadow-md bg-black" style={{ height: 300 }}>
      {fotos.map((f, i) => (
        <img
          key={f.slot}
          src={f.src}
          alt={f.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {fotos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {fotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {icon}
      {text}
    </span>
  )
}
