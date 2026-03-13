export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactMessage extends ContactFormData {
  id: string
  created_at: string
}
