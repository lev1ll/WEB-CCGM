import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toast'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
/**
 * RootLayout
 * Envuelve todas las páginas con el Navbar sticky y el Footer.
 * Las animaciones de entrada las maneja cada AnimatedSection individualmente.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Skip to main content — accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Saltar al contenido
      </a>

      <ScrollToTop />
      <Navbar />

      {/* pt-16 para compensar el Navbar fixed de h-16 */}
      <main id="main-content" className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
