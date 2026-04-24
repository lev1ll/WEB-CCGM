import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Polyline, Circle, Marker, useMapEvents } from 'react-leaflet'
import { Loader2, Plus, Trash2, Bus, MapPin, Save, ChevronLeft, GripVertical, Upload, ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/utils'
import CropModal from '@/components/shared/CropModal'

// Fix Leaflet default icon (Vite strips assets)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Tipos ─────────────────────────────────────────────────────────

type Chip = { icon: 'Bus' | 'MapPin'; text: string }
type Config = { titulo: string; subtitulo: string; chips: Chip[] }
type Ruta = { id: string; nombre: string; color: string; puntos: [number, number][]; activo: boolean; orden: number }
type Zona = { id: string; nombre: string; descripcion: string; latitud: number; longitud: number; radio_metros: number; activo: boolean; orden: number }

const CENTRO_DEFAULT: [number, number] = [-38.7398, -72.9492]

// ── Componentes de mapa auxiliares ───────────────────────────────

function ClickToAdd({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onAdd(e.latlng.lat, e.latlng.lng) })
  return null
}

function ClickToSet({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onChange(e.latlng.lat, e.latlng.lng) })
  return null
}

function makeNumIcon(n: number) {
  return L.divIcon({
    className: '',
    html: `<div style="background:#2563eb;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);">${n}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function makeCenterIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="background:#2563eb;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);">+</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

// ── Tabs ─────────────────────────────────────────────────────────

type Tab = 'texto' | 'rutas' | 'zonas' | 'fotos'

// ── Página principal ─────────────────────────────────────────────

export default function AdminMovilizacion() {
  const [tab, setTab] = useState<Tab>('texto')
  const [config, setConfig] = useState<Config>({ titulo: '', subtitulo: '', chips: [] })
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [zonas, setZonas] = useState<Zona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    if (!supabase) return
    setLoading(true)
    setError(null)
    const [cfgRes, rutasRes, zonasRes] = await Promise.all([
      supabase.from('config_movilizacion').select('*').eq('id', 1).single(),
      supabase.from('rutas_bus').select('*').order('orden'),
      supabase.from('zonas_cobertura').select('*').order('orden'),
    ])
    if (cfgRes.error && cfgRes.error.code !== 'PGRST116') setError(`Error al cargar: ${cfgRes.error.message}`)
    if (cfgRes.data) setConfig({ titulo: cfgRes.data.titulo, subtitulo: cfgRes.data.subtitulo, chips: cfgRes.data.chips ?? [] })
    if (rutasRes.data) setRutas(rutasRes.data as Ruta[])
    if (zonasRes.data) setZonas(zonasRes.data as Zona[])
    setLoading(false)
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'texto', label: 'Texto de la sección' },
    { id: 'rutas', label: 'Rutas del bus' },
    { id: 'zonas', label: 'Zonas de cobertura' },
    { id: 'fotos', label: 'Fotos de buses' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Movilización escolar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Edita los recorridos del bus, las zonas de cobertura y los textos de la sección.</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
        </div>
      ) : (
        <>
          {tab === 'texto'  && <TabTexto  config={config} setConfig={setConfig} onSaved={load} />}
          {tab === 'rutas'  && <TabRutas  rutas={rutas} onReload={load} />}
          {tab === 'zonas'  && <TabZonas  zonas={zonas} onReload={load} />}
          {tab === 'fotos'  && <TabFotos />}
        </>
      )}
    </div>
  )
}

// ── Tab Texto ─────────────────────────────────────────────────────

function TabTexto({ config, setConfig, onSaved }: { config: Config; setConfig: (c: Config) => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    if (!supabase) return
    setSaving(true); setOk(false); setError(null)
    const { error: e } = await supabase.from('config_movilizacion').upsert({ id: 1, ...config }, { onConflict: 'id' })
    if (e) setError(`Error al guardar: ${e.message}`)
    else { setOk(true); onSaved() }
    setSaving(false)
  }

  function addChip() {
    setConfig({ ...config, chips: [...config.chips, { icon: 'Bus', text: '' }] })
  }

  function updateChip(i: number, partial: Partial<Chip>) {
    const chips = config.chips.map((c, idx) => idx === i ? { ...c, ...partial } : c)
    setConfig({ ...config, chips })
  }

  function removeChip(i: number) {
    setConfig({ ...config, chips: config.chips.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Encabezado de la sección</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              value={config.titulo}
              onChange={e => setConfig({ ...config, titulo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
            <input
              value={config.subtitulo}
              onChange={e => setConfig({ ...config, subtitulo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Chips de información</h2>
          <button onClick={addChip} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>
        <p className="text-xs text-gray-500">Son los badges que aparecen debajo del mapa, p. ej. "Toda Nueva Imperial".</p>
        {config.chips.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin chips todavía.</p>}
        {config.chips.map((chip, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <select
              value={chip.icon}
              onChange={e => updateChip(i, { icon: e.target.value as Chip['icon'] })}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="Bus">🚌 Bus</option>
              <option value="MapPin">📍 Mapa</option>
            </select>
            <input
              value={chip.text}
              onChange={e => updateChip(i, { text: e.target.value })}
              placeholder="Texto del chip"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={() => removeChip(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}
      {ok    && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">Guardado correctamente.</div>}

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Guardar cambios
      </button>
    </div>
  )
}

// ── Tab Rutas ─────────────────────────────────────────────────────

function TabRutas({ rutas, onReload }: { rutas: Ruta[]; onReload: () => void }) {
  const [editing, setEditing] = useState<Ruta | null>(null)

  if (editing) {
    return <RutaEditor ruta={editing} onBack={() => { setEditing(null); onReload() }} />
  }

  async function toggleActivo(r: Ruta) {
    if (!supabase) return
    await supabase.from('rutas_bus').update({ activo: !r.activo }).eq('id', r.id)
    onReload()
  }

  async function deleteRuta(id: string) {
    if (!supabase) return
    await supabase.from('rutas_bus').delete().eq('id', id)
    onReload()
  }

  async function addNew() {
    if (!supabase) return
    const { data } = await supabase.from('rutas_bus')
      .insert({ nombre: 'Nueva ruta', color: '#2563eb', puntos: [], activo: true, orden: rutas.length })
      .select().single()
    if (data) { onReload(); setEditing(data as Ruta) }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Nueva ruta
        </button>
      </div>

      {rutas.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">No hay rutas. Crea una con el botón de arriba.</div>
      )}

      {rutas.map(r => (
        <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <span className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow" style={{ background: r.color }} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{r.nombre}</p>
            <p className="text-xs text-gray-500">{r.puntos.length} puntos · {r.activo ? 'Visible' : 'Oculta'}</p>
          </div>
          <button
            onClick={() => toggleActivo(r)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${r.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
          >
            {r.activo ? 'Visible' : 'Oculta'}
          </button>
          <button onClick={() => setEditing(r)} className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
            Editar
          </button>
          <ConfirmDeleteBtn onDelete={() => deleteRuta(r.id)} />
        </div>
      ))}
    </div>
  )
}

function RutaEditor({ ruta, onBack }: { ruta: Ruta; onBack: () => void }) {
  const [nombre, setNombre] = useState(ruta.nombre)
  const [color, setColor] = useState(ruta.color)
  const [puntos, setPuntos] = useState<[number, number][]>(ruta.puntos)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPoint = useCallback((lat: number, lng: number) => {
    setPuntos(prev => [...prev, [lat, lng]])
  }, [])

  function movePoint(i: number, lat: number, lng: number) {
    setPuntos(prev => prev.map((p, idx) => idx === i ? [lat, lng] : p))
  }

  function removePoint(i: number) {
    setPuntos(prev => prev.filter((_, idx) => idx !== i))
  }

  async function save() {
    if (!supabase) return
    setSaving(true); setError(null)
    const { error: e } = await supabase.from('rutas_bus').update({ nombre, color, puntos }).eq('id', ruta.id)
    if (e) setError(`Error al guardar: ${e.message}`)
    else onBack()
    setSaving(false)
  }

  const center: [number, number] = puntos.length > 0 ? puntos[Math.floor(puntos.length / 2)] : CENTRO_DEFAULT

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Volver a rutas
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Datos de la ruta</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="font-semibold text-gray-800">Puntos de la ruta</p>
          <p className="text-xs text-gray-500 mt-0.5">Haz clic en el mapa para agregar un punto al final de la ruta. Arrastra los marcadores para moverlos.</p>
        </div>
        <div style={{ height: 560 }}>
          <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom zoomSnap={0.5} zoomDelta={0.5}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickToAdd onAdd={addPoint} />
            {puntos.length > 1 && (
              <Polyline positions={puntos} pathOptions={{ color, weight: 4, opacity: 0.9 }} />
            )}
            {puntos.map((p, i) => (
              <Marker
                key={i}
                position={p}
                icon={makeNumIcon(i + 1)}
                draggable
                eventHandlers={{ dragend: (e) => { const ll = (e.target as L.Marker).getLatLng(); movePoint(i, ll.lat, ll.lng) } }}
              />
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Lista de puntos */}
      {puntos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 max-h-56 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700 mb-3">{puntos.length} punto{puntos.length !== 1 ? 's' : ''}</p>
          {puntos.map((p, i) => (
            <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
              <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
              <span className="flex-1 font-mono">{p[0].toFixed(6)}, {p[1].toFixed(6)}</span>
              <button onClick={() => removePoint(i)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Guardar ruta
      </button>
    </div>
  )
}

// ── Tab Zonas ─────────────────────────────────────────────────────

function TabZonas({ zonas, onReload }: { zonas: Zona[]; onReload: () => void }) {
  const [editing, setEditing] = useState<Zona | null>(null)

  if (editing) {
    return <ZonaEditor zona={editing} onBack={() => { setEditing(null); onReload() }} />
  }

  async function toggleActivo(z: Zona) {
    if (!supabase) return
    await supabase.from('zonas_cobertura').update({ activo: !z.activo }).eq('id', z.id)
    onReload()
  }

  async function deleteZona(id: string) {
    if (!supabase) return
    await supabase.from('zonas_cobertura').delete().eq('id', id)
    onReload()
  }

  async function addNew() {
    if (!supabase) return
    const { data } = await supabase.from('zonas_cobertura')
      .insert({ nombre: 'Nueva zona', descripcion: '', latitud: CENTRO_DEFAULT[0], longitud: CENTRO_DEFAULT[1], radio_metros: 1000, activo: true, orden: zonas.length })
      .select().single()
    if (data) { onReload(); setEditing(data as Zona) }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Nueva zona
        </button>
      </div>

      {zonas.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">No hay zonas. Crea una con el botón de arriba.</div>
      )}

      {zonas.map(z => (
        <div key={z.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{z.nombre}</p>
            <p className="text-xs text-gray-500">Radio: {z.radio_metros.toLocaleString()} m · {z.activo ? 'Visible' : 'Oculta'}</p>
          </div>
          <button
            onClick={() => toggleActivo(z)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${z.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
          >
            {z.activo ? 'Visible' : 'Oculta'}
          </button>
          <button onClick={() => setEditing(z)} className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
            Editar
          </button>
          <ConfirmDeleteBtn onDelete={() => deleteZona(z.id)} />
        </div>
      ))}
    </div>
  )
}

function ZonaEditor({ zona, onBack }: { zona: Zona; onBack: () => void }) {
  const [nombre, setNombre] = useState(zona.nombre)
  const [descripcion, setDescripcion] = useState(zona.descripcion)
  const [lat, setLat] = useState(zona.latitud)
  const [lng, setLng] = useState(zona.longitud)
  const [radio, setRadio] = useState(zona.radio_metros)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setCenter = useCallback((newLat: number, newLng: number) => {
    setLat(newLat); setLng(newLng)
  }, [])

  async function save() {
    if (!supabase) return
    setSaving(true); setError(null)
    const { error: e } = await supabase.from('zonas_cobertura')
      .update({ nombre, descripcion, latitud: lat, longitud: lng, radio_metros: radio })
      .eq('id', zona.id)
    if (e) setError(`Error al guardar: ${e.message}`)
    else onBack()
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Volver a zonas
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Datos de la zona</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la zona</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Texto del popup (al hacer clic en el mapa)</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ej: Hasta Supermercado Lily" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="font-semibold text-gray-800">Centro de la zona</p>
          <p className="text-xs text-gray-500 mt-0.5">Haz clic en el mapa para mover el centro. El círculo azul muestra el radio actual.</p>
        </div>
        <div style={{ height: 560 }}>
          <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom zoomSnap={0.5} zoomDelta={0.5}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickToSet onChange={setCenter} />
            <Circle
              center={[lat, lng]}
              radius={radio}
              pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 2, dashArray: '6 4' }}
            />
            <Marker position={[lat, lng]} icon={makeCenterIcon()} />
          </MapContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Radio de cobertura: <span className="font-bold text-primary">{radio.toLocaleString()} m</span>
          </label>
          <input
            type="range"
            min={100} max={10000} step={100}
            value={radio}
            onChange={e => setRadio(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100 m</span><span>10 km</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 font-mono">
          Centro: {lat.toFixed(6)}, {lng.toFixed(6)}
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Guardar zona
      </button>
    </div>
  )
}

// ── Tab Fotos de buses ────────────────────────────────────────────

const SLOTS: { slot: 1 | 2; label: string }[] = [
  { slot: 1, label: 'Bus foto 1' },
  { slot: 2, label: 'Bus foto 2' },
]

function TabFotos() {
  const [fotos, setFotos] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<number | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropSlot, setCropSlot] = useState<number | null>(null)
  const [cropUploading, setCropUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadFotos() }, [])

  async function loadFotos() {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('movilizacion_fotos').select('slot,src')
    const map: Record<number, string> = {}
    ;(data ?? []).forEach((d: { slot: number; src: string }) => { map[d.slot] = d.src })
    setFotos(map)
    setLoading(false)
  }

  function handleFileSelect(slot: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setCropSlot(slot)
    setCropSrc(URL.createObjectURL(file))
  }

  async function handleCropConfirm(croppedFile: File) {
    if (cropSlot === null) return
    const slot = cropSlot
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null); setCropSlot(null); setCropUploading(true); setUploading(slot); setError(null)
    try {
      const url = await uploadToCloudinary(croppedFile)
      const { error: e } = await supabase!.from('movilizacion_fotos')
        .upsert({ slot, src: url, alt: `Bus escolar foto ${slot}` }, { onConflict: 'slot' })
      if (e) throw e
      await loadFotos()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Error desconocido'
      setError(`Error al guardar: ${msg}`)
    } finally {
      setUploading(null); setCropUploading(false)
    }
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null); setCropSlot(null)
  }

  async function handleDelete(slot: number) {
    if (!supabase) return
    setUploading(slot); setConfirmDelete(null)
    await supabase.from('movilizacion_fotos').delete().eq('slot', slot)
    setFotos(prev => { const n = { ...prev }; delete n[slot]; return n })
    setUploading(null)
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-1">Fotos del servicio de bus</h2>
        <p className="text-sm text-gray-500">Estas fotos aparecen en un carrusel debajo del mapa de recorridos. Sube hasta 2 fotos de los buses.</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {SLOTS.map(({ slot, label }) => {
            const src = fotos[slot]
            const isUploading = uploading === slot
            const fileId = `foto-bus-${slot}`
            return (
              <div key={slot} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="relative h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {src ? (
                    <img src={src} alt={label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <ImageIcon className="w-12 h-12" />
                      <span className="text-xs">Sin foto</span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                  {src && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Subida
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-1.5">
                    <p className="text-white text-sm font-bold">{label}</p>
                  </div>
                </div>
                <div className="p-3 flex gap-2">
                  <label
                    htmlFor={fileId}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {src ? 'Cambiar foto' : 'Subir foto'}
                  </label>
                  <input id={fileId} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect(slot, e)} />
                  {src && (
                    <button
                      onClick={() => setConfirmDelete(slot)}
                      disabled={isUploading}
                      className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 disabled:opacity-60 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          aspect={16 / 9}
          cropShape="rect"
          outputSize={1200}
          uploading={cropUploading}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-gray-900">¿Quitar esta foto?</h3>
            <p className="text-sm text-gray-500">La foto desaparecerá del carrusel en la página pública.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete!)} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Quitar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared: botón eliminar con confirmación inline ────────────────

function ConfirmDeleteBtn({ onDelete }: { onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false)
  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
        <button onClick={onDelete} className="text-xs px-2 py-1 bg-red-500 text-white rounded font-semibold hover:bg-red-600">Sí</button>
        <button onClick={() => setConfirm(false)} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded font-semibold hover:bg-gray-200">No</button>
      </div>
    )
  }
  return (
    <button onClick={() => setConfirm(true)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

// Suppress unused import warnings for icons used in JSX only
void Bus
