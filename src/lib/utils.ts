import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export function toEmbedUrl(url: string): string | null {
  if (!url) return null
  // YouTube: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID
  const ytId = extractYouTubeId(url)
  if (ytId) return `https://www.youtube.com/embed/${ytId}`
  // Vimeo: vimeo.com/ID
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

export async function cropToSquare(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const size = Math.min(img.width, img.height)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas no disponible'))
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size)
      URL.revokeObjectURL(url)
      canvas.toBlob(blob => {
        if (!blob) return reject(new Error('Error al recortar imagen'))
        resolve(new File([blob], file.name, { type: 'image/jpeg' }))
      }, 'image/jpeg', 0.9)
    }
    img.onerror = () => reject(new Error('Error al cargar imagen'))
    img.src = url
  })
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary no configurado (faltan VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET)')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Error al subir imagen a Cloudinary')
  const data = await res.json() as { secure_url: string }
  return data.secure_url
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
