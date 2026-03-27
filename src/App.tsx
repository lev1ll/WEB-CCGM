import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import AdminLayout from '@/layouts/AdminLayout'
import { HomePage } from '@/pages/Home'
// HomePage queda en /old por si se necesita comparar
import { NosotrosPage } from '@/pages/Nosotros'
import { NivelesPage } from '@/pages/Niveles'
import { AdmisionPage } from '@/pages/Admision'
import { ContactoPage } from '@/pages/Contacto'
import NoticiasPage from '@/pages/Noticias'
import NoticiaDetallePage from '@/pages/Noticias/NoticiaDetalle'
import AdminLoginPage from '@/pages/Admin/Login'
import AdminDashboard from '@/pages/Admin/Dashboard'
import AdminContactos from '@/pages/Admin/Contactos'
import AdminNoticiasPage from '@/pages/Admin/Noticias'
import NoticiaEditorPage from '@/pages/Admin/Noticias/Editor'
import AdminTrabajadores from '@/pages/Admin/Trabajadores'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { VariantProvider } from '@/context/VariantContext'
import { HomeNueva } from '@/pages/HomeNueva'

export default function App() {
  return (
    <VariantProvider>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* ── Sitio público ── */}
          <Route element={<RootLayout />}>
            <Route index element={<ErrorBoundary><HomeNueva /></ErrorBoundary>} />
            <Route path="old" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
            <Route path="nosotros" element={<ErrorBoundary><NosotrosPage /></ErrorBoundary>} />
            <Route path="niveles" element={<ErrorBoundary><NivelesPage /></ErrorBoundary>} />
            <Route path="admision" element={<ErrorBoundary><AdmisionPage /></ErrorBoundary>} />
            <Route path="contacto" element={<ErrorBoundary><ContactoPage /></ErrorBoundary>} />
            <Route path="noticias" element={<ErrorBoundary><NoticiasPage /></ErrorBoundary>} />
            <Route path="noticias/:slug" element={<ErrorBoundary><NoticiaDetallePage /></ErrorBoundary>} />
          </Route>

          {/* ── Panel Admin (layout separado, auth-guardado) ── */}
          <Route element={<AdminLayout />}>
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/contactos" element={<AdminContactos />} />
            <Route path="admin/noticias" element={<AdminNoticiasPage />} />
            <Route path="admin/noticias/nueva" element={<NoticiaEditorPage />} />
            <Route path="admin/noticias/:id/editar" element={<NoticiaEditorPage />} />
            <Route path="admin/trabajadores" element={<AdminTrabajadores />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
    </VariantProvider>
  )
}
