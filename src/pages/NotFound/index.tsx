import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, GraduationCap } from 'lucide-react'
import { SCHOOL } from '@/constants/school'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0F0D0C] flex flex-col items-center justify-center px-4 text-center">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <img
            src="/images/logo_gabriela_mistral.png"
            alt={SCHOOL.name}
            className="h-12 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <GraduationCap className="hidden h-8 w-8 text-secondary" />
        </Link>
      </motion.div>

      {/* 404 */}
      <motion.p
        className="text-[10rem] sm:text-[14rem] font-extrabold leading-none select-none
                   text-transparent bg-clip-text"
        style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.48 0.27 27), oklch(0.78 0.20 78))' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        404
      </motion.p>

      {/* Texto */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-2 space-y-3"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Página no encontrada
        </h1>
        <p className="text-white/50 max-w-sm mx-auto text-sm leading-relaxed">
          La página que buscas no existe o fue movida.<br />
          Vuelve al inicio para encontrar lo que necesitas.
        </p>
      </motion.div>

      {/* Cita */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-10 max-w-xs text-xs text-white/25 italic leading-relaxed"
      >
        "Enseñar siempre: en el patio y en la calle como en la sala de clase."
        <cite className="block mt-1 not-italic text-secondary/40">— Gabriela Mistral</cite>
      </motion.blockquote>

      {/* Botón */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90
                     text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  )
}
