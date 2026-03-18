import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CarouselProps {
  children: React.ReactNode
  className?: string
  itemWidth?: number
  gap?: number
}

export function Carousel({
  children,
  className,
  itemWidth = 320,
  gap = 24,
}: CarouselProps) {
  const constraintsRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = React.useState(0)
  const [containerWidth, setContainerWidth] = React.useState(0)
  const [x, setX] = React.useState(0)

  React.useEffect(() => {
    const track = trackRef.current
    const container = constraintsRef.current
    if (!track || !container) return
    const updateWidths = () => {
      setTrackWidth(track.scrollWidth)
      setContainerWidth(container.offsetWidth)
    }
    updateWidths()
    const ro = new ResizeObserver(updateWidths)
    ro.observe(container)
    return () => ro.disconnect()
  }, [children])

  const maxDrag = Math.min(0, containerWidth - trackWidth)

  function slide(direction: 'prev' | 'next') {
    const step = itemWidth + gap
    setX((prev) => {
      const next = direction === 'next' ? prev - step : prev + step
      return Math.max(maxDrag, Math.min(0, next))
    })
  }

  return (
    <div
      className={cn('relative', className)}
      role="region"
      aria-label="Carrusel"
    >
      {/* Track */}
      <div ref={constraintsRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex"
          style={{ gap, x }}
          animate={{ x }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: maxDrag, right: 0 }}
          onDragEnd={(_, info) => {
            setX((prev) => {
              const next = prev + info.offset.x
              return Math.max(maxDrag, Math.min(0, next))
            })
          }}
        >
          {children}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mt-6">
        <Button
          variant="outline"
          size="icon"
          aria-label="Anterior"
          onClick={() => slide('prev')}
          disabled={x >= 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Siguiente"
          onClick={() => slide('next')}
          disabled={x <= maxDrag}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
