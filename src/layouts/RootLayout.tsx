import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/chatbot/ChatWidget'

/**
 * RootLayout
 * Envuelve todas las páginas con el Navbar sticky, el Footer
 * y el widget flotante del chatbot de Claude (Haiku).
 */
export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      {/* pt-16 para compensar el Navbar fixed de h-16 */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />

      {/* Widget flotante del asistente IA — siempre visible */}
      <ChatWidget />
    </div>
  )
}
