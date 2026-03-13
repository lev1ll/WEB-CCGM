import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  isOpen: boolean
  onToggle: () => void
  hasUnread?: boolean
}

export function ChatBubble({ isOpen, onToggle, hasUnread = false }: ChatBubbleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente virtual'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors',
        'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <X className="h-6 w-6" />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.span>
        )}
      </AnimatePresence>

      {hasUnread && !isOpen && (
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive border-2 border-background" />
      )}
    </motion.button>
  )
}
