export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

export interface ChatbotLog {
  id: string
  question: string
  session_id: string
  created_at: string
}
