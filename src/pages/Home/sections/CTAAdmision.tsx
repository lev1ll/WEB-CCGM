import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, ClipboardList, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

const MINEDUC_URL = 'https://registropublicodigital.mineduc.gob.cl/rpd-app-registro-apoderado/login'

const PASOS = [
  {
    num: '1',
    titulo: 'Contáctanos',
    desc: 'Escríbenos o llámanos para conocer más sobre nuestra escuela y el proceso de admisión.',
  },
  {
    num: '2',
    titulo: 'Anótate en la lista MINEDUC',
    desc: 'Ingresa al Registro Público Digital del MINEDUC, busca la Escuela Gabriela Mistral de Nueva Imperial y regístra a tu hijo/a.',
  },
  {
    num: '3',
    titulo: 'Ven a la escuela',
    desc: 'Una vez coordinado, visítanos presencialmente para completar la matrícula con la documentación requerida.',
  },
]

export function CTAAdmision() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-28">
      {/* Decorative diagonal pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection direction="up">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-4">
            Proceso de admisión 2026
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            ¿Quieres que tu hijo/a
            <br className="hidden sm:block" /> estudie con nosotros?
          </h2>
          <p className="mt-5 text-lg text-white/75 max-w-xl mx-auto">
            El proceso es simple. Sigue estos tres pasos para asegurar el cupo de tu hijo/a en la Escuela Gabriela Mistral.
          </p>

          {/* Pasos */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            {PASOS.map((paso) => (
              <div key={paso.num} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-navy-deep font-bold text-sm mb-4">
                  {paso.num}
                </div>
                <h3 className="font-bold text-white mb-2">{paso.titulo}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-navy-deep font-bold px-8 w-full sm:w-auto gap-2"
              >
                <Link to="/contacto">
                  <MessageCircle className="h-5 w-5" />
                  Contáctanos
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 w-full sm:w-auto gap-2"
              >
                <a href={MINEDUC_URL} target="_blank" rel="noopener noreferrer">
                  <ClipboardList className="h-5 w-5" />
                  Anotarme en lista MINEDUC
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>

          <p className="mt-6 text-sm text-white/50">
            ¿Tienes dudas?{' '}
            <Link to="/contacto" className="underline hover:text-white transition-colors">
              Escríbenos
            </Link>{' '}
            y te ayudamos a guiarte en el proceso.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
