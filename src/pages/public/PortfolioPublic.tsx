/**
 * Vista pública de un portafolio individual.
 * Prácticas: Routing con parámetros, UX de carga/skeleton.
 */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPortfolio, listProjectsByOwner, type Portfolio } from '../../services/firestore'
import type { DocumentData } from 'firebase/firestore'

const PortfolioPublic = () => {
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [projects, setProjects] = useState<(DocumentData & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        const [pf, pj] = await Promise.all([
          getPortfolio(id),
          listProjectsByOwner(id),
        ])
        setPortfolio(pf)
        setProjects(pj)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 ">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-32 w-full" />
        ))}
      </div>
    )
  }

  if (!portfolio) {
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
          <p className="badge badge-outline">{portfolio?.tags?.join(' · ')}</p>
          <h1 className="text-3xl font-bold">{portfolio.headline}</h1>
          <p className="text-base-content/70">{portfolio.about}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {portfolio.skills?.map((skill) => (
            <div key={skill} className="badge badge-primary">
              {skill}
            </div>
          ))}
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Proyectos</h2>
          <div className="badge badge-secondary">
            {projects.length} proyectos
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h3 className="card-title">{project.title}</h3>
                  <div className="badge badge-outline">{project.category}</div>
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
      </section>
    </div>
  )
}

export default PortfolioPublic
