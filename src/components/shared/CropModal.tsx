import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react'

interface Props {
  imageSrc: string
  onConfirm: (file: File) => void
  onCancel: () => void
  uploading?: boolean
  aspect?: number           // default 1 (cuadrado)
  cropShape?: 'rect' | 'round'  // default 'round'
  outputSize?: number       // tamaño del lado mayor del canvas (default 400)
}

async function getCroppedFile(imageSrc: string, croppedAreaPixels: Area, outputSize = 400, aspect = 1): Promise<File> {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = imageSrc
  await new Promise<void>(resolve => { image.onload = () => resolve() })

  const canvas = document.createElement('canvas')
  // Mantener la proporción del área recortada en el canvas de salida
  if (aspect >= 1) {
    canvas.width  = outputSize
    canvas.height = Math.round(outputSize / aspect)
  } else {
    canvas.height = outputSize
    canvas.width  = Math.round(outputSize * aspect)
  }
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(
    image,
    croppedAreaPixels.x, croppedAreaPixels.y,
    croppedAreaPixels.width, croppedAreaPixels.height,
    0, 0, canvas.width, canvas.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) return reject(new Error('Error al recortar'))
      resolve(new File([blob], 'foto.jpg', { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.92)
  })
}

export default function CropModal({ imageSrc, onConfirm, onCancel, uploading, aspect = 1, cropShape = 'round', outputSize = 400 }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleConfirm() {
    if (!croppedAreaPixels) return
    const file = await getCroppedFile(imageSrc, croppedAreaPixels, outputSize, aspect)
    onConfirm(file)
  }

  // Para aspect ratios anchos (landscape) usar menos alto; para portrait más alto
  const cropAreaHeight = aspect >= 1 ? 56 : 72  // en unidades tailwind ×4px → 224 o 288px

  return (
    <Dialog open onOpenChange={open => !open && onCancel()}>
      <DialogContent className={aspect > 1 ? 'max-w-lg' : 'max-w-sm'}>
        <DialogHeader>
          <DialogTitle>Ajustar foto</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-xs -mt-1">Arrastra para reencuadrar · usa el zoom para acercar</DialogDescription>

        {/* Crop area */}
        <div className={`relative w-full bg-gray-900 rounded-xl overflow-hidden`} style={{ height: `${cropAreaHeight * 4}px` }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === 'rect'}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <ZoomIn className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={uploading}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Usar esta foto'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
