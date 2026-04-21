import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Bus, MapPin } from 'lucide-react'

// Fix Leaflet default icon (Vite strips assets)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Coordenadas clave
const ESCUELA: [number, number] = [-38.7428, -72.9521]
const CENTRO_IMPERIAL: [number, number] = [-38.7398, -72.9492]
const LILY: [number, number] = [-38.7661195, -72.7751037]

// Ruta real S-40 obtenida desde OSRM (OpenStreetMap routing)
const RUTA: [number, number][] = [
  [-38.742785, -72.952101],
  [-38.742679, -72.948843],
  [-38.748392, -72.948508],
  [-38.748499, -72.946100],
  [-38.749190, -72.945037],
  [-38.749438, -72.943101],
  [-38.749706, -72.940544],
  [-38.750415, -72.938910],
  [-38.751047, -72.937067],
  [-38.752464, -72.932658],
  [-38.754107, -72.927441],
  [-38.755122, -72.924250],
  [-38.756008, -72.922389],
  [-38.757740, -72.918911],
  [-38.757949, -72.917947],
  [-38.757569, -72.912077],
  [-38.757494, -72.909616],
  [-38.758133, -72.907321],
  [-38.759569, -72.902583],
  [-38.761062, -72.897616],
  [-38.762879, -72.891601],
  [-38.764229, -72.887140],
  [-38.765895, -72.881633],
  [-38.767054, -72.877861],
  [-38.767818, -72.874625],
  [-38.769612, -72.869277],
  [-38.769821, -72.866598],
  [-38.769414, -72.863937],
  [-38.768794, -72.860517],
  [-38.767801, -72.854906],
  [-38.767089, -72.850880],
  [-38.766878, -72.847395],
  [-38.765908, -72.842111],
  [-38.765182, -72.839805],
  [-38.764769, -72.837702],
  [-38.764182, -72.833840],
  [-38.764237, -72.831737],
  [-38.764708, -72.829091],
  [-38.765696, -72.825112],
  [-38.766957, -72.818195],
  [-38.768067, -72.815547],
  [-38.768385, -72.812566],
  [-38.768480, -72.810312],
  [-38.768070, -72.807436],
  [-38.767233, -72.801758],
  [-38.766401, -72.796333],
  [-38.765883, -72.792881],
  [-38.765773, -72.791574],
  [-38.766073, -72.786663],
  [-38.766504, -72.780338],
  LILY,
]

// Icono personalizado para escuela
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


function FitBounds() {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(L.latLngBounds(RUTA), { padding: [40, 40] })
  }, [map])
  return null
}

const LEYENDA = [
  { color: '#2563eb', label: 'Ruta del bus (ida y vuelta)' },
  { color: '#3b82f680', label: 'Zonas de cobertura' },
]

export function MapaTransporte() {
  return (
    <SectionWrapper variant="secondary">
      <SectionTitle
        title="Servicio de movilización escolar"
        subtitle="Cubrimos toda Nueva Imperial y llegamos hasta la primera zona de Labranza"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 space-y-4">
        {/* Mapa */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-md" style={{ height: 480 }}>
          <MapContainer
            center={CENTRO_IMPERIAL}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            zoomControl
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <FitBounds />

            {/* Cobertura Imperial */}
            <Circle
              center={CENTRO_IMPERIAL}
              radius={2200}
              pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.12, weight: 1.5, dashArray: '6 4' }}
            />

            {/* Ruta principal */}
            <Polyline
              positions={RUTA}
              pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }}
            />
            {/* Sombra/halo para efecto activo */}
            <Polyline
              positions={RUTA}
              pathOptions={{ color: '#93c5fd', weight: 10, opacity: 0.3, lineCap: 'round' }}
            />

            {/* Marker escuela */}
            <Marker position={ESCUELA} icon={iconEscuela}>
              <Popup>
                <strong>Escuela Gabriela Mistral</strong><br />
                General Urrutia 763, Nueva Imperial
              </Popup>
            </Marker>

            {/* Cobertura Labranza — zona Supermercado Lily */}
            <Circle
              center={LILY}
              radius={800}
              pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.12, weight: 1.5, dashArray: '6 4' }}
            >
              <Popup>
                <strong>Zona Labranza</strong><br />
                Hasta Supermercado Lily
              </Popup>
            </Circle>
          </MapContainer>
        </div>

        {/* Leyenda + info */}
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
            <Chip icon={<Bus className="h-3.5 w-3.5" />} text="Toda Nueva Imperial" />
            <Chip icon={<MapPin className="h-3.5 w-3.5" />} text="Hasta Supermercado Lily, Labranza" />
          </div>
        </div>
      </AnimatedSection>
    </SectionWrapper>
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
