import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Loader2, AlertCircle, Pencil, ChevronUp, ChevronDown, Copy } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { HorarioCelda, AtencionApoderado } from '@/types/noticias.types'

const CURSOS = ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°']
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as const
const DIA_LABELS: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado',
}
const DIA_COLS = DIAS.map(d => ({ key: d, label: DIA_LABELS[d] }))

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

// ─── Atención de Apoderados ────────────────────────────────────────────────

type AtencionForm = { nombre: string; cargo: string; dia: string; hora_inicio: string; hora_fin: string }
const EMPTY_ATENCION: AtencionForm = { nombre: '', cargo: '', dia: 'lunes', hora_inicio: '', hora_fin: '' }

function TabAtencion() {
  const { select, upsert, remove, update: updateRow } = useSupabaseQuery()
  const [items, setItems] = useState<AtencionApoderado[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AtencionApoderado | null>(null)
  const [form, setForm] = useState<AtencionForm>(EMPTY_ATENCION)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [moving, setMoving] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await select<AtencionApoderado>('atencion_apoderados', {
      order: { column: 'orden', ascending: true },
    })
    setItems(data)
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(EMPTY_ATENCION)
    setFormError(null)
    setDialogOpen(true)
  }

  function openEdit(item: AtencionApoderado) {
    setEditing(item)
    setForm({
      nombre: item.nombre, cargo: item.cargo, dia: item.dia,
      hora_inicio: item.hora_inicio, hora_fin: item.hora_fin,
    })
    setFormError(null)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.nombre.trim() || !form.cargo.trim() || !form.hora_inicio || !form.hora_fin) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    setSaving(true)
    setFormError(null)
    const payload = editing
      ? { id: editing.id, ...form }
      : { ...form, orden: items.length }
    const r = await upsert('atencion_apoderados', payload as Record<string, unknown>)
    if (r.success) { await load(); setDialogOpen(false) }
    else setFormError(r.error ?? 'Error al guardar')
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await remove('atencion_apoderados', id)
    setItems(prev => prev.filter(x => x.id !== id))
    setDeletingId(null)
  }

  async function moveItem(index: number, dir: 'up' | 'down') {
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= items.length) return
    setMoving(items[index].id)
    const newItems = [...items]
    ;[newItems[index], newItems[target]] = [newItems[target], newItems[index]]
    const withOrden = newItems.map((t, i) => ({ ...t, orden: i }))
    setItems(withOrden)
    await Promise.all(withOrden.map(t =>
      updateRow('atencion_apoderados', t.id, { orden: t.orden } as Record<string, unknown>)
    ))
    setMoving(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Horario de atención de docentes a apoderados</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando...
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400 italic py-8 text-center">Sin registros. Agrega el primero.</p>
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['', 'Nombre', 'Cargo', 'Día', 'Horario', ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-3">
                      <div className="flex flex-col">
                        <button
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0 || moving === item.id}
                          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Mover arriba"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === items.length - 1 || moving === item.id}
                          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Mover abajo"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{item.cargo}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{DIA_LABELS[item.dia] ?? item.dia}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{item.hora_inicio} – {item.hora_fin}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50">
                          {deletingId === item.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil: cards */}
          <div className="md:hidden space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.cargo}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {DIA_LABELS[item.dia] ?? item.dia} · {item.hora_inicio} – {item.hora_fin}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col mr-1">
                      <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0 || moving === item.id}
                        className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1 || moving === item.id}
                        className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => openEdit(item)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50">
                      {deletingId === item.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={open => !open && setDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar' : 'Agregar'} atención de apoderados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Nombre completo *">
              <input
                value={form.nombre}
                onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej: María González Rojas"
                className={inputClass}
              />
            </Field>
            <Field label="Cargo *">
              <input
                value={form.cargo}
                onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))}
                placeholder="Ej: Prof. Jefe 3° Básico"
                className={inputClass}
              />
            </Field>
            <Field label="Día *">
              <select
                value={form.dia}
                onChange={e => setForm(p => ({ ...p, dia: e.target.value }))}
                className={inputClass}
              >
                {Object.entries(DIA_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hora inicio *">
                <input type="time" value={form.hora_inicio}
                  onChange={e => setForm(p => ({ ...p, hora_inicio: e.target.value }))}
                  className={inputClass} />
              </Field>
              <Field label="Hora fin *">
                <input type="time" value={form.hora_fin}
                  onChange={e => setForm(p => ({ ...p, hora_fin: e.target.value }))}
                  className={inputClass} />
              </Field>
            </div>
            {formError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {formError}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setDialogOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : editing ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Horarios de Cursos ────────────────────────────────────────────────────

function TabHorarios() {
  const { select, bulkInsert, update: updateRow } = useSupabaseQuery()
  const [curso, setCurso] = useState('1°')
  const [celdas, setCeldas] = useState<HorarioCelda[]>([])
  const [localValues, setLocalValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [addBloqueOpen, setAddBloqueOpen] = useState(false)
  const [newBloque, setNewBloque] = useState({ hora_inicio: '', hora_fin: '' })
  const [savingBloque, setSavingBloque] = useState(false)
  const [bloqueError, setBloqueError] = useState<string | null>(null)
  const [deletingBloque, setDeletingBloque] = useState<string | null>(null)
  // Copiar horario
  const [copyOpen, setCopyOpen] = useState(false)
  const [copySource, setCopySource] = useState('')
  const [copying, setCopying] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  useEffect(() => { loadCeldas() }, [curso])

  async function loadCeldas() {
    setLoading(true)
    const data = await select<HorarioCelda>('horarios', {
      filter: { curso },
      order: { column: 'hora_inicio', ascending: true },
    })
    setCeldas(data)
    const lv: Record<string, string> = {}
    data.forEach(c => { lv[cellKey(c.dia, c.hora_inicio, c.hora_fin)] = c.asignatura })
    setLocalValues(lv)
    setLoading(false)
  }

  const bloques = useMemo(() => {
    const seen = new Set<string>()
    const result: { hora_inicio: string; hora_fin: string }[] = []
    celdas.forEach(c => {
      const key = `${c.hora_inicio}|${c.hora_fin}`
      if (!seen.has(key)) { seen.add(key); result.push({ hora_inicio: c.hora_inicio, hora_fin: c.hora_fin }) }
    })
    return result.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
  }, [celdas])

  function cellKey(dia: string, hi: string, hf: string) { return `${dia}|${hi}|${hf}` }

  function getCelda(dia: string, hi: string, hf: string) {
    return celdas.find(c => c.dia === dia && c.hora_inicio === hi && c.hora_fin === hf)
  }

  async function handleCellBlur(dia: string, hi: string, hf: string, value: string) {
    const celda = getCelda(dia, hi, hf)
    if (!celda || celda.asignatura === value) return
    await updateRow('horarios', celda.id, { asignatura: value } as Record<string, unknown>)
    setCeldas(prev => prev.map(c => c.id === celda.id ? { ...c, asignatura: value } : c))
  }

  async function addBloque() {
    if (!newBloque.hora_inicio || !newBloque.hora_fin) {
      setBloqueError('Ingresa hora inicio y hora fin.')
      return
    }
    if (newBloque.hora_inicio >= newBloque.hora_fin) {
      setBloqueError('La hora de inicio debe ser antes que la hora de fin.')
      return
    }
    const exists = bloques.some(b => b.hora_inicio === newBloque.hora_inicio && b.hora_fin === newBloque.hora_fin)
    if (exists) { setBloqueError('Este bloque ya existe para este curso.'); return }

    setSavingBloque(true)
    setBloqueError(null)
    const rows = DIAS.map(dia => ({
      curso, dia,
      hora_inicio: newBloque.hora_inicio,
      hora_fin: newBloque.hora_fin,
      asignatura: '',
      orden: 0,
    }))
    const r = await bulkInsert('horarios', rows as Record<string, unknown>[])
    if (r.success) {
      await loadCeldas()
      setAddBloqueOpen(false)
      setNewBloque({ hora_inicio: '', hora_fin: '' })
    } else {
      setBloqueError(r.error ?? 'Error al crear el bloque.')
    }
    setSavingBloque(false)
  }

  async function deleteBloque(hi: string, hf: string) {
    if (!supabase) return
    const key = `${hi}|${hf}`
    setDeletingBloque(key)
    await supabase.from('horarios').delete().eq('curso', curso).eq('hora_inicio', hi).eq('hora_fin', hf)
    await loadCeldas()
    setDeletingBloque(null)
  }

  async function copiarDesde() {
    if (!copySource || !supabase) return
    setCopying(true)
    setCopyError(null)
    try {
      const sourceCells = await select<HorarioCelda>('horarios', { filter: { curso: copySource } })
      if (sourceCells.length === 0) {
        setCopyError(`${copySource} Básico no tiene bloques cargados aún.`)
        return
      }
      await supabase.from('horarios').delete().eq('curso', curso)
      const newRows = sourceCells.map(({ id: _id, created_at: _ca, curso: _c, ...rest }) => ({ ...rest, curso }))
      const r = await bulkInsert('horarios', newRows as Record<string, unknown>[])
      if (r.success) { await loadCeldas(); setCopyOpen(false) }
      else setCopyError(r.error ?? 'Error al copiar')
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Selector de curso */}
      <div className="flex flex-wrap gap-2">
        {CURSOS.map(c => (
          <button
            key={c}
            onClick={() => setCurso(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              curso === c
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c} Básico
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-between items-center gap-2">
        <p className="text-xs text-gray-400">Haz clic en una celda para editar (guarda al salir del campo)</p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setCopyOpen(true); setCopySource(''); setCopyError(null) }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copiar de...
          </button>
          <button
            onClick={() => { setAddBloqueOpen(true); setBloqueError(null); setNewBloque({ hora_inicio: '', hora_fin: '' }) }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar bloque
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando...
        </div>
      ) : bloques.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500">Sin bloques para {curso} Básico.</p>
          <p className="text-xs text-gray-400 mt-1">Usa "Agregar bloque" o "Copiar de..." para comenzar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 -mx-1 px-1">
          <table className="w-full text-sm" style={{ minWidth: 560 }}>
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">Horario</th>
                {DIA_COLS.map(d => (
                  <th key={d.key} className="px-3 py-3 text-center text-xs font-semibold min-w-[100px]">{d.label}</th>
                ))}
                <th className="px-2 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bloques.map((bloque, i) => (
                <tr key={`${bloque.hora_inicio}|${bloque.hora_fin}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-center font-bold text-primary text-xs whitespace-nowrap">
                    {bloque.hora_inicio}<br />{bloque.hora_fin}
                  </td>
                  {DIAS.map(dia => {
                    const key = cellKey(dia, bloque.hora_inicio, bloque.hora_fin)
                    return (
                      <td key={dia} className="px-1 py-1">
                        <input
                          value={localValues[key] ?? ''}
                          onChange={e => setLocalValues(prev => ({ ...prev, [key]: e.target.value }))}
                          onBlur={e => handleCellBlur(dia, bloque.hora_inicio, bloque.hora_fin, e.target.value)}
                          placeholder="—"
                          className="w-full px-2 py-1.5 text-xs text-center border border-transparent hover:border-gray-200 focus:border-primary focus:outline-none focus:bg-white rounded-md bg-transparent transition-colors"
                        />
                      </td>
                    )
                  })}
                  <td className="px-1 py-2 text-center">
                    <button
                      onClick={() => deleteBloque(bloque.hora_inicio, bloque.hora_fin)}
                      disabled={deletingBloque === `${bloque.hora_inicio}|${bloque.hora_fin}`}
                      className="p-1 text-gray-300 hover:text-red-500 rounded disabled:opacity-50 transition-colors"
                      title="Eliminar bloque"
                    >
                      {deletingBloque === `${bloque.hora_inicio}|${bloque.hora_fin}`
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog agregar bloque */}
      <Dialog open={addBloqueOpen} onOpenChange={open => !open && setAddBloqueOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Agregar bloque horario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              Se creará una fila para <strong>{curso} Básico</strong> de lunes a viernes con este horario.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hora inicio">
                <input type="time" value={newBloque.hora_inicio}
                  onChange={e => setNewBloque(p => ({ ...p, hora_inicio: e.target.value }))}
                  className={inputClass} />
              </Field>
              <Field label="Hora fin">
                <input type="time" value={newBloque.hora_fin}
                  onChange={e => setNewBloque(p => ({ ...p, hora_fin: e.target.value }))}
                  className={inputClass} />
              </Field>
            </div>
            {bloqueError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {bloqueError}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setAddBloqueOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={addBloque} disabled={savingBloque}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {savingBloque ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Agregar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog copiar horario */}
      <Dialog open={copyOpen} onOpenChange={open => !open && setCopyOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Copiar horario de otro curso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              Se copiarán todos los bloques y asignaturas al curso <strong>{curso} Básico</strong>.
              Los bloques actuales serán <span className="text-red-500 font-medium">reemplazados</span>.
            </p>
            <Field label="Copiar desde">
              <select value={copySource} onChange={e => setCopySource(e.target.value)} className={inputClass}>
                <option value="">Selecciona un curso...</option>
                {CURSOS.filter(c => c !== curso).map(c => (
                  <option key={c} value={c}>{c} Básico</option>
                ))}
              </select>
            </Field>
            {copyError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {copyError}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setCopyOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={copiarDesde} disabled={!copySource || copying}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {copying ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Copiar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────

export default function AdminHorarios() {
  const [tab, setTab] = useState<'atencion' | 'horarios'>('atencion')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Horarios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestiona la atención de apoderados y los horarios semanales por curso</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {([['atencion', 'Atención de Apoderados'], ['horarios', 'Horarios de Cursos']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'atencion' ? <TabAtencion /> : <TabHorarios />}
    </div>
  )
}
