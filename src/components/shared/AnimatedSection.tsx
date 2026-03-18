import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

const initialMap = {
  up:    { opacity: 0, y: 24 },
  down:  { opacity: 0, y: -24 },
  left:  { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  none:  { opacity: 0 },
}

const animateMap = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  none:  { opacity: 1 },
}

// Animate on mount — no IntersectionObserver needed.
// Using whileInView/useInView caused blank pages because the IO fires
// asynchronously, leaving content at opacity:0 until user interaction.
// With `animate` the content is always visible after the mount transition.
export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={initialMap[direction]}
      animate={animateMap[direction]}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}
