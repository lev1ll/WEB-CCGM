import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot } from 'lucide-react'
import { ChatBubble } from './ChatBubble'
import { ChatMessageItem } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { type ChatMessage } from '@/types'
import { SCHOOL } from '@/constants/school'

function generateId(): string {
  return Math.random().toString(36).slice(2)
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `¡Hola! Soy el asistente virtual del ${SCHOOL.name}. ¿En qué puedo ayudarte hoy?`,
  timestamp: new Date(),
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // TODO: conectar con Supabase Edge Function (chat-proxy) en fase de backend
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content:
          'Gracias por tu pregunta. Pronto estaré conectado al sistema para responderte en tiempo real.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[1050] flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 sm:w-96 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="Asistente virtual CCGM"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-primary px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-foreground">Asistente CCGM</p>
                <p className="text-xs text-primary-foreground/70">Disponible ahora</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 overflow-y-auto p-4 h-72">
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <ChatBubble isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />
    </div>
  )
}
