/**
 * Projects FOREING - Página de proyectos con estilo femenino
 * Diseño elegante con tarjetas modernas y filtros suaves
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Heart, 
  ExternalLink, 
  Github, 
  Filter,
  Search,
  Star,
  Eye,
  Flower2,
  Gem,
  Crown,
  ArrowUpRight,
  X,
  Loader2
} from 'lucide-react'
import { listAllProjects } from '../../services/firestore'

// Interfaz para proyectos
interface ProjectType {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  category: string
  tags: string[]
  client?: string
  year: string
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  color: string
}

const categories = ['Todos', 'E-commerce', 'Mobile App', 'Web Design', 'Branding', 'Dashboard', 'academico', 'laboral']

// Colores para asignar a proyectos de Firestore
const projectColors = ['pink', 'purple', 'rose', 'amber', 'emerald', 'cyan']

// Proyectos de ejemplo (siempre se muestran)
const exampleProjects: ProjectType[] = [
  {
    id: 'example-1',
    title: 'Bloom Beauty',
    description: 'E-commerce de productos de belleza con diseño minimalista y experiencia de compra fluida.',
    longDescription: 'Plataforma completa de comercio electrónico especializada en productos de belleza y cuidado personal. Incluye catálogo dinámico, carrito de compras, pasarela de pagos y panel de administración.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    category: 'E-commerce',
    tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    client: 'Bloom Beauty Co.',
    year: '2024',
    featured: true,
    liveUrl: '#',
    githubUrl: '#',
    color: 'pink'
  },
  {
    id: 'example-2',
    title: 'Wellness App',
    description: 'Aplicación móvil de bienestar con seguimiento de hábitos, meditaciones y ejercicios.',
    longDescription: 'App móvil diseñada para el bienestar integral. Incluye tracker de hábitos, biblioteca de meditaciones guiadas, rutinas de ejercicio y análisis de progreso personal.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    category: 'Mobile App',
    tags: ['React Native', 'Firebase', 'TypeScript'],
    client: 'WellnessLife',
    year: '2024',
    featured: true,
    liveUrl: '#',
    githubUrl: '#',
    color: 'purple'
  },
  {
    id: 'example-3',
    title: 'Studio Creativo',
    description: 'Portafolio digital para agencia de diseño con animaciones elegantes.',
    longDescription: 'Sitio web de portafolio para agencia creativa con animaciones fluidas, galería de proyectos interactiva y sistema de contacto integrado.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    category: 'Web Design',
    tags: ['Next.js', 'Framer Motion', 'TailwindCSS'],
    client: 'Studio Luna',
    year: '2023',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
    color: 'rose'
  },
  {
    id: 'example-4',
    title: 'Café Artesanal',
    description: 'Sistema de pedidos online para cafetería con diseño cálido y acogedor.',
    longDescription: 'Plataforma de pedidos para cafetería artesanal con menú digital, sistema de reservaciones, programa de lealtad y gestión de inventario.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    category: 'E-commerce',
    tags: ['Vue.js', 'Supabase', 'Stripe'],
    client: 'Café Origen',
    year: '2023',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
    color: 'amber'
  },
  {
    id: 'example-5',
    title: 'Fashion Brand',
    description: 'Rediseño de marca y tienda online para boutique de moda sostenible.',
    longDescription: 'Proyecto integral de branding y desarrollo web para marca de moda sostenible. Incluye identidad visual, tienda online y estrategia de contenido.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
    category: 'Branding',
    tags: ['Figma', 'Shopify', 'Adobe Suite'],
    client: 'Verde Moda',
    year: '2024',
    featured: true,
    liveUrl: '#',
    githubUrl: '#',
    color: 'emerald'
  },
  {
    id: 'example-6',
    title: 'Health Dashboard',
    description: 'Dashboard de salud con visualización de datos y métricas personalizadas.',
    longDescription: 'Panel de control de salud con integración de dispositivos wearables, visualización de métricas vitales y generación de reportes médicos.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    category: 'Dashboard',
    tags: ['React', 'D3.js', 'Python', 'PostgreSQL'],
    client: 'HealthTech',
    year: '2023',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
    color: 'cyan'
  }
]

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>(exampleProjects)
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>(exampleProjects)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar proyectos de Firestore y combinar con los de ejemplo
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const firestoreProjects = await listAllProjects()
        
        // Convertir proyectos de Firestore al formato esperado
        const convertedProjects: ProjectType[] = firestoreProjects.map((proj: any, index: number) => {
          // Obtener imagen de localStorage si existe
          const localImage = localStorage.getItem(`project_img_${proj.id}`)
          
          // Determinar categoría formateada
          let category = proj.category || 'Web Design'
          if (category === 'academico') category = 'academico'
          if (category === 'laboral') category = 'laboral'

          return {
            id: proj.id,
            title: proj.title || 'Sin título',
            description: proj.description || '',
            longDescription: proj.description || '',
            image: localImage || proj.imageUrl || 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
            category: category,
            tags: proj.technologies || proj.techStack || [],
            client: proj.teamMembers?.[0] || 'FOREING',
            year: proj.createdAt?.toDate?.()?.getFullYear?.()?.toString() || new Date().getFullYear().toString(),
            featured: proj.featured || false,
            liveUrl: proj.demoUrl || '',
            githubUrl: proj.repoUrl || proj.githubUrl || '',
            color: projectColors[index % projectColors.length]
          }
        })

        // Combinar proyectos de ejemplo + proyectos de Firestore
        const allProjects = [...exampleProjects, ...convertedProjects]
        setProjects(allProjects)
        setFilteredProjects(allProjects)
      } catch (error) {
        // En caso de error, mantener los proyectos de ejemplo
        setProjects(exampleProjects)
        setFilteredProjects(exampleProjects)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  useEffect(() => {
    let filtered = projects

    if (activeCategory !== 'Todos') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredProjects(filtered)
  }, [activeCategory, searchTerm, projects])

  const colorClasses: Record<string, { gradient: string, bg: string, text: string }> = {
    pink: { gradient: 'from-[#D4AF37] to-[#B8860B]', bg: 'bg-[#FFF8E7]', text: 'text-[#D4AF37]' },
    purple: { gradient: 'from-[#D4A574] to-[#D4AF37]', bg: 'bg-[#FFFAF0]', text: 'text-[#B8860B]' },
    rose: { gradient: 'from-[#B8860B] to-[#D4AF37]', bg: 'bg-[#FFF5E6]', text: 'text-[#D4AF37]' },
    amber: { gradient: 'from-[#D4AF37] to-[#D4A574]', bg: 'bg-[#FFF8E7]', text: 'text-[#B8860B]' },
    emerald: { gradient: 'from-[#D4A574] to-[#B8860B]', bg: 'bg-[#FFFAF0]', text: 'text-[#D4AF37]' },
    cyan: { gradient: 'from-[#D4AF37] to-[#D4A574]', bg: 'bg-[#FFF5E6]', text: 'text-[#B8860B]' },
  }

  return (
    <div className="min-h-screen bg-[#FFFCF9] pt-24 pb-20">
      {/* Fondo Rosa Dorado Minimalista */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#FFEDE3]/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-48 bg-gradient-to-tl from-[#FFE4D4]/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-6" style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)', borderColor: 'rgba(212, 175, 55, 0.3)' }}
          >
            <Gem className="text-[#D4AF37]" size={18} />
            <span className="font-medium bg-clip-text text-transparent font-body" style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>
              Nuestro Trabajo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-display font-bold mb-6"
          >
            <span className="text-base-content">Proyectos </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #B8860B, #D4A574)' }}>
              Destacados
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-base-content/60 max-w-2xl mx-auto font-body"
          >
            Cada proyecto es una historia de creatividad, innovación y dedicación ✨
          </motion.p>
        </div>

        {/* Filtros y Búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={20} />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-body shadow-lg shadow-[#D4AF37]/5"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 font-body ${
                  activeCategory === category
                    ? 'text-white shadow-lg'
                    : 'bg-white border border-[#D4AF37]/20 text-base-content/70 hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7]'
                }`}
                style={activeCategory === category ? { background: 'linear-gradient(to right, #D4AF37, #B8860B)', boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.3)' } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
            <p className="text-base-content/60 font-body">Cargando proyectos...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const colors = colorClasses[project.color] || colorClasses.pink
              
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#D4AF37]/5 border border-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-500">
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>
                        <Star size={12} className="fill-current" />
                        Destacado
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-base-content/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-3 rounded-xl bg-white/90 backdrop-blur-sm text-[#D4AF37] hover:bg-white transition-colors shadow-lg"
                        >
                          <Eye size={20} />
                        </button>
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-white/90 backdrop-blur-sm text-[#B8860B] hover:bg-white transition-colors shadow-lg"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-white/90 backdrop-blur-sm text-base-content/70 hover:bg-white transition-colors shadow-lg"
                          >
                            <Github size={20} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} font-body`}>
                          {project.category}
                        </span>
                        <span className="text-xs text-base-content/40 font-body">{project.year}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-display font-bold text-base-content mb-2 group-hover:text-[#D4AF37] transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-base-content/60 font-body text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 rounded-lg text-xs text-base-content/60 font-body" style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* View More */}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold hover:opacity-90 transition-opacity font-body`}
                      >
                        Ver Detalles
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Flower2 className="mx-auto text-[#D4AF37]" size={48} />
            <p className="text-xl text-base-content/60 font-body">
              No se encontraron proyectos con esos criterios ✨
            </p>
            <button
              onClick={() => { setActiveCategory('Todos'); setSearchTerm(''); }}
              className="mt-4 text-[#D4AF37] font-semibold hover:text-[#B8860B] font-body"
            >
              Ver todos los proyectos
            </button>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-base-content/60 hover:text-[#D4AF37] transition-colors shadow-lg"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <div className="relative h-72 sm:h-80">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-content/60 to-transparent" />
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm font-body`}>
                      {selectedProject.category}
                    </span>
                    <span className="text-sm opacity-80">{selectedProject.year}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold">{selectedProject.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Client */}
                <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)' }}>
                  <Crown className="text-[#D4AF37]" size={20} />
                  <div>
                    <p className="text-xs text-base-content/50 font-body">Cliente</p>
                    <p className="font-semibold text-base-content font-body">{selectedProject.client}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base-content/70 font-body leading-relaxed mb-6">
                  {selectedProject.longDescription}
                </p>

                {/* Tags */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-base-content/70 mb-3 font-body flex items-center gap-2">
                    <Sparkles size={14} className="text-[#D4AF37]" />
                    Tecnologías utilizadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-4 py-2 rounded-xl text-sm text-[#B8860B] font-medium font-body" style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white font-semibold hover:opacity-90 transition-opacity shadow-lg font-body" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)', boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.25)' }}
                    >
                      <ExternalLink size={18} />
                      Ver Sitio Web
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-[#D4AF37]/30 text-[#B8860B] font-semibold hover:bg-[#FFF8E7] transition-colors font-body"
                    >
                      <Github size={18} />
                      Ver Código
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Projects
