import { type ChatMessage } from '@/types'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: ChatMessage
}

export function ChatMessageItem({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted text-foreground rounded-tl-sm'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
