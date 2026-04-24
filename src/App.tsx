import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { RootLayout } from '@/layouts/RootLayout'
import AdminLayout from '@/layouts/AdminLayout'
import { NosotrosPage } from '@/pages/Nosotros'
import { NivelesPage } from '@/pages/Niveles'
import { AdmisionPage } from '@/pages/Admision'
import { ContactoPage } from '@/pages/Contacto'
import NoticiasPage from '@/pages/Noticias'
import NoticiaDetallePage from '@/pages/Noticias/NoticiaDetalle'
import AdminLoginPage from '@/pages/Admin/Login'
import AdminDashboard from '@/pages/Admin/Dashboard'
import AdminNoticiasPage from '@/pages/Admin/Noticias'
import NoticiaEditorPage from '@/pages/Admin/Noticias/Editor'
import AdminTrabajadores from '@/pages/Admin/Trabajadores'
import AdminGaleria from '@/pages/Admin/Galeria'
import AdminDocumentos from '@/pages/Admin/Documentos'
import AdminHero from '@/pages/Admin/Hero'
import AdminAcademias from '@/pages/Admin/Academias'
import AdminInstalaciones from '@/pages/Admin/Instalaciones'
import RecursosPage from '@/pages/Recursos'
import CalendarioPage from '@/pages/Calendario'
import AdminCalendario from '@/pages/Admin/Calendario'
import AdminMovilizacion from '@/pages/Admin/Movilizacion'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { HomeNueva } from '@/pages/HomeNueva'
import { NotFoundPage } from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          {/* ── Sitio público ── */}
          <Route element={<RootLayout />}>
            <Route index element={<ErrorBoundary><HomeNueva /></ErrorBoundary>} />
            <Route path="nosotros" element={<ErrorBoundary><NosotrosPage /></ErrorBoundary>} />
            <Route path="niveles" element={<ErrorBoundary><NivelesPage /></ErrorBoundary>} />
            <Route path="admision" element={<ErrorBoundary><AdmisionPage /></ErrorBoundary>} />
            <Route path="contacto" element={<ErrorBoundary><ContactoPage /></ErrorBoundary>} />
            <Route path="noticias" element={<ErrorBoundary><NoticiasPage /></ErrorBoundary>} />
            <Route path="noticias/:slug" element={<ErrorBoundary><NoticiaDetallePage /></ErrorBoundary>} />
            <Route path="recursos" element={<ErrorBoundary><RecursosPage /></ErrorBoundary>} />
            <Route path="calendario" element={<ErrorBoundary><CalendarioPage /></ErrorBoundary>} />
          </Route>

          {/* ── Panel Admin (layout separado, auth-guardado) ── */}
          <Route element={<AdminLayout />}>
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/noticias" element={<AdminNoticiasPage />} />
            <Route path="admin/noticias/nueva" element={<NoticiaEditorPage />} />
            <Route path="admin/noticias/:id/editar" element={<NoticiaEditorPage />} />
            <Route path="admin/trabajadores" element={<AdminTrabajadores />} />
            <Route path="admin/galeria" element={<AdminGaleria />} />
            <Route path="admin/documentos" element={<AdminDocumentos />} />
            <Route path="admin/hero" element={<AdminHero />} />
            <Route path="admin/academias" element={<AdminAcademias />} />
            <Route path="admin/instalaciones" element={<AdminInstalaciones />} />
            <Route path="admin/calendario" element={<AdminCalendario />} />
            <Route path="admin/movilizacion" element={<AdminMovilizacion />} />
          </Route>

          {/* ── 404 — sin layout, pantalla completa propia ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
