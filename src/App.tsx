//enrutador principal de la aplicación con React Router v6
//define rutas públicas y protegidas con guards de autenticación y rol
//layouts: PublicLayout (navbar+footer) y DashboardLayout (sidebar)

//importaciones de React y Router
import { Suspense, lazy } from 'react' //lazy: carga páginas solo cuando se necesitan (optimización)
import { Navigate, Route, Routes } from 'react-router-dom' //sistema de navegación
import ProtectedRoute from './components/guards/ProtectedRoute' //protege rutas que requieren login
import RoleGuard from './components/guards/RoleGuard' //protege rutas por rol (admin/programmer)
import ScrollToTop from './components/common/ScrollToTop' //vuelve arriba al cambiar de página

//layouts (plantillas de página)
const PublicLayout = lazy(() => import('./layouts/PublicLayout')) //layout con NavBar y Footer
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout')) //layout de panel de control
const Home = lazy(() => import('./pages/public/Home'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const Projects = lazy(() => import('./pages/public/Projects'))
const PortfolioPublic = lazy(() => import('./pages/public/PortfolioPublic'))
const ProgrammerDirectory = lazy(
  () => import('./pages/public/ProgrammerDirectory'),
)
const AdvisoryRequest = lazy(() => import('./pages/public/AdvisoryRequest'))
const MyAdvisoryRequests = lazy(() => import('./pages/public/MyAdvisoryRequests'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin'))
const ProgrammerDashboard = lazy(
  () => import('./pages/programmer/ProgrammerDashboard'),
)
const ProgrammersPage = lazy(() => import('./pages/admin/ProgrammersPage'))
const ScheduleManager = lazy(() => import('./pages/admin/ScheduleManager'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const PortfolioEditor = lazy(
  () => import('./pages/programmer/PortfolioEditor'),
)
const ProfileEditor = lazy(
  () => import('./pages/programmer/ProfileEditor'),
)
const ProjectsPage = lazy(() => import('./pages/programmer/ProjectsPage'))
const AdvisoryInbox = lazy(() => import('./pages/programmer/AdvisoryInbox'))
const DiagnosticsPage = lazy(() => import('./pages/admin/DiagnosticsPage'))

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <span className="loading loading-spinner loading-lg text-primary" />
  </div>
)

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* rutas públicas (con NavBar y Footer) - todos pueden acceder */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/proyectos" element={<Projects />} />
            <Route path="/portafolio/:id" element={<PortfolioPublic />} />
            <Route path="/programadores" element={<ProgrammerDirectory />} />
            <Route path="/agendar-asesoria" element={<AdvisoryRequest />} />
            <Route path="/mis-solicitudes" element={<MyAdvisoryRequests />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* rutas de administrador - solo usuarios con role='admin' */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['admin']}>
                  <DashboardLayout role="admin" />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="programadores" element={<ProgrammersPage />} />
            <Route path="proyectos" element={<ProjectsAdmin />} />
            <Route path="horarios" element={<ScheduleManager />} />
            <Route path="usuarios" element={<UserManagement />} />
            <Route path="diagnostico" element={<DiagnosticsPage />} />
          </Route>

          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['programmer']}>
                  <DashboardLayout role="programmer" />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<ProgrammerDashboard />} />
            <Route path="perfil" element={<ProfileEditor />} />
            <Route path="portafolio" element={<PortfolioEditor />} />
            <Route path="proyectos" element={<ProjectsPage />} />
            <Route path="asesorias" element={<AdvisoryInbox />} />
            <Route path="horarios" element={<ScheduleManager />} />
          </Route>

          {/* si la URL no existe, redirige a la página principal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
