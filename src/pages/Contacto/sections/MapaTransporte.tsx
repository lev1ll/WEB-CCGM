import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { supabase } from '@/lib/supabase'

// Fix Leaflet default icon (Vite strips assets)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Tipos ─────────────────────────────────────────────────────────
type RutaBus = { id: string; nombre: string; color: string; puntos: [number, number][] }
type ZonaCobertura = { id: string; nombre: string; descripcion: string; latitud: number; longitud: number; radio_metros: number }
type FotoBus = { slot: number; src: string; alt: string }

// ── Fallbacks ─────────────────────────────────────────────────────
const ESCUELA: [number, number] = [-38.7428, -72.9521]
const CENTRO_IMPERIAL: [number, number] = [-38.7398, -72.9492]

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

export function MapaTransporte() {
  const [titulo, setTitulo] = useState('Servicio de movilización escolar')
  const [subtitulo, setSubtitulo] = useState('Cubrimos toda Nueva Imperial y llegamos hasta la primera zona de Labranza')
  const [rutas, setRutas] = useState<RutaBus[]>([])
  const [zonas, setZonas] = useState<ZonaCobertura[]>([])
  const [fotos, setFotos] = useState<FotoBus[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoaded(true); return }
    Promise.all([
      supabase.from('config_movilizacion').select('titulo,subtitulo').eq('id', 1).single(),
      supabase.from('rutas_bus').select('id,nombre,color,puntos').eq('activo', true).order('orden'),
      supabase.from('zonas_cobertura').select('id,nombre,descripcion,latitud,longitud,radio_metros').eq('activo', true).order('orden'),
      supabase.from('movilizacion_fotos').select('slot,src,alt').order('slot'),
    ]).then(([cfg, ruts, zon, fots]) => {
      if (cfg.data) {
        setTitulo(cfg.data.titulo)
        setSubtitulo(cfg.data.subtitulo)
      }
      if (ruts.data && ruts.data.length > 0) setRutas(ruts.data as RutaBus[])
      if (zon.data && zon.data.length > 0) setZonas(zon.data as ZonaCobertura[])
      if (fots.data && fots.data.length > 0) setFotos(fots.data as FotoBus[])
      setLoaded(true)
    })
  }, [])

  const todosPuntos = rutas.flatMap(r => r.puntos)
  const mapCenter: [number, number] = todosPuntos.length > 0
    ? todosPuntos[Math.floor(todosPuntos.length / 2)]
    : CENTRO_IMPERIAL

  return (
    <SectionWrapper variant="secondary">
      <SectionTitle title={titulo} subtitle={subtitulo} />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 space-y-4">
        {/* Mapa */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-md h-72 sm:h-[480px]">
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

              {rutas.flatMap(r =>
                r.puntos.length > 1 ? [
                  <Polyline key={`${r.id}-main`} positions={r.puntos} pathOptions={{ color: r.color, weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }} />,
                  <Polyline key={`${r.id}-halo`} positions={r.puntos} pathOptions={{ color: '#93c5fd', weight: 10, opacity: 0.3, lineCap: 'round' }} />,
                ] : []
              )}

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

              <Marker position={ESCUELA} icon={iconEscuela}>
                <Popup>
                  <strong>Escuela Gabriela Mistral</strong><br />
                  General Urrutia 763, Nueva Imperial
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        {/* Fotos de buses */}
        {fotos.length > 0 && <BusFotos fotos={fotos} />}
      </AnimatedSection>
    </SectionWrapper>
  )
}

function BusFotos({ fotos }: { fotos: FotoBus[] }) {
  return (
    <div className={`mx-auto w-full ${fotos.length === 1 ? 'max-w-md' : 'max-w-2xl'}`}>
      <div className={fotos.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
        {fotos.map(f => (
          <div key={f.slot} className="aspect-video rounded-2xl overflow-hidden border border-border shadow-md">
            <img src={f.src} alt={f.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
