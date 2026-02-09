import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPortfolio, listProjectsByOwnerPaginated } from '../../services/data.service'
import { Portfolio } from '../../models/Portfolio'
import { Project } from '../../models/Project'


const PortfolioPublic = () => {
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 6

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      setLoading(true)
      try {
        // Load portfolio only once if possible, but here we keep it simple or split effects
        // ideally separate effects, but for now we can fetch both. 
        // to avoid re-fetching portfolio on page change, we can check if it exists

        const portfolioPromise = !portfolio ? getPortfolio(id) : Promise.resolve(null)
        const projectsPromise = listProjectsByOwnerPaginated(id, currentPage, pageSize)

        const [pf, pjResponse] = await Promise.all([
          portfolioPromise,
          projectsPromise,
        ])

        if (pf) {
          // Parse skills and tags if they're JSON strings
          if (typeof pf.skills === 'string') {
            try {
              pf.skills = JSON.parse(pf.skills)
            } catch {
              pf.skills = []
            }
          }
          if (typeof pf.tags === 'string') {
            try {
              pf.tags = JSON.parse(pf.tags)
            } catch {
              pf.tags = []
            }
          }
          setPortfolio(pf)
        }

        setProjects(pjResponse.content || [])
        setTotalPages(pjResponse.totalPages || 0)

      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, currentPage]) // Add currentPage dependency

  if (loading && !portfolio && projects.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 ">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-32 w-full" />
        ))}
      </div>
    )
  }

  if (!portfolio && !loading) {
    return (
      <div className="pt-20 px-4">
        <div className="alert alert-warning max-w-3xl mx-auto mt-4">
          Portafolio no encontrado o no publicado.
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6 pt-20 ">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="badge badge-outline">{Array.isArray(portfolio?.tags) ? portfolio?.tags.join(' · ') : ''}</p>
          <h1 className="text-3xl font-bold">{portfolio?.headline || 'Portafolio'}</h1>
          <p className="text-base-content/70">{portfolio?.about || ''}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(portfolio?.skills) && portfolio?.skills.map((skill: any, index: number) => {
            const skillName = typeof skill === 'string' ? skill : (skill?.name || '');
            return (
              <div key={`skill-${index}-${skillName}`} className="badge badge-primary">
                {skillName}
              </div>
            );
          })}
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Proyectos</h2>
          <div className="badge badge-secondary">
            Página {currentPage + 1} de {totalPages || 1}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 text-base-content/60">
            No hay proyectos para mostrar en esta página.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h3 className="card-title">{project.title}</h3>
                  </div>
                  <p className="text-sm text-base-content/70">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="badge badge-ghost">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions justify-end">
                    {project.repoUrl && (
                      <a
                        className="btn btn-sm btn-outline"
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Código
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        className="btn btn-sm btn-primary"
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="btn btn-circle btn-outline border-primary/20 hover:bg-primary hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-base-content/70 font-medium">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="btn btn-circle btn-outline border-primary/20 hover:bg-primary hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

      </section>
    </div>
  )
}

export default PortfolioPublic
