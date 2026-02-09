import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { listProjectsByOwner, updateProject, addProject, deleteProject } from '../../services/data.service'
import { useAuth } from '../../context/AuthContext'
import { FiImage, FiTrash2 } from 'react-icons/fi'

const emptyProject = {
  title: '',
  description: '',
  category: 'academico',
  techStack: '',
  repoUrl: '',
  demoUrl: '',
  imageUrl: '',
}

const ProjectsPage = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm] = useState(emptyProject)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  const loadProjects = useCallback(async () => {
    if (!user?.uid) return
    try {
      const data = await listProjectsByOwner(user.uid)
      setProjects(data)
    } catch (error) {
      console.error('Error al cargar proyectos:', error)
      setError('No se pudieron cargar los proyectos.')
      setProjects([])
    }
  }, [user?.uid])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  /* 
   * Función para convertir imagen a Base64 y simular subida.
   * NOTA: Esto guarda la imagen como string en la BD. 
   * Idealmente el backend debería manejar subida de archivos real.
   */
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      // Subir imagen (ahora devuelve base64) si se seleccionó nueva
      let imageUrl = form.imageUrl
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
        repoUrl: form.repoUrl,
        demoUrl: form.demoUrl,
        imageUrl: imageUrl,
      }

      if (editingId) {
        // Actualizar proyecto existente
        await updateProject(editingId, payload)
        setMessage('Proyecto actualizado.')
      } else {
        // Crear nuevo proyecto
        if (!user?.uid) throw new Error('Usuario no autenticado')
        await addProject(user.uid, payload)
        setMessage('Proyecto creado.')
      }

      setForm(emptyProject)
      setEditingId(null)
      setImageFile(null)
      setImagePreview('')
      await loadProjects()
    } catch (err) {
      console.error('Error al guardar proyecto:', err)
      setError('No se pudo guardar el proyecto.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return

    try {
      await deleteProject(id)
      setMessage('Proyecto eliminado correctamente')
      await loadProjects()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error al eliminar proyecto:', err)
      setError('No se pudo eliminar el proyecto')
      setTimeout(() => setError(''), 3000)
    }
  }

  const startEdit = (p: any) => {
    setEditingId(p.id)
    setForm({
      title: p.title,
      description: p.description,
      category: p.category || 'academico',
      techStack: p.techStack?.join(', ') || '',
      repoUrl: p.repoUrl || '',
      demoUrl: p.demoUrl || '',
      imageUrl: p.imageUrl || '',
    })
    setImagePreview(p.imageUrl || '')
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold">Proyectos</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="card-title">
                {editingId ? 'Editar proyecto' : 'Nuevo proyecto'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptyProject)
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
            {message && <div className="alert alert-success text-sm">{message}</div>}
            {error && <div className="alert alert-error text-sm">{error}</div>}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Título *</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Descripción</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="textarea textarea-bordered"
                rows={3}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Categoría</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="academico">Académico</option>
                <option value="laboral">Laboral</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tecnologías (coma)</span>
              </label>
              <input
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="React, Firebase, Tailwind"
              />
            </div>

            {/* Imagen del proyecto */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Imagen del proyecto</span>
              </label>
              <div className="flex flex-col gap-2">
                {imagePreview && (
                  <div className="avatar">
                    <div className="w-32 rounded">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  </div>
                )}
                <label className="btn btn-outline btn-sm gap-2 w-fit">
                  <FiImage />
                  Seleccionar imagen
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Repo</span>
                </label>
                <input
                  name="repoUrl"
                  value={form.repoUrl}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Demo</span>
                </label>
                <input
                  name="demoUrl"
                  value={form.demoUrl}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="https://app..."
                />
              </div>
            </div>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading
                  ? 'Guardando...'
                  : editingId
                    ? 'Actualizar proyecto'
                    : 'Crear proyecto'}
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="card bg-base-100 shadow-sm">
              <div className="card-body space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{p.title}</h3>
                    {p.category && (
                      <span className={`badge badge-sm ${p.category === 'academico' ? 'badge-primary' : 'badge-secondary'}`}>
                        {p.category === 'academico' ? 'Académico' : 'Laboral'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(p.id)}>
                      <FiTrash2 />
                    </button>
                    <button className="btn btn-ghost btn-xs" onClick={() => startEdit(p)}>
                      Editar
                    </button>
                  </div>
                </div>
                <p className="text-sm text-base-content/70">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.techStack?.map((t: string) => (
                    <span key={t} className="badge badge-ghost">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="card-actions justify-end">
                  {p.repoUrl && (
                    <a
                      className="btn btn-outline btn-xs"
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Código
                    </a>
                  )}
                  {p.demoUrl && (
                    <a
                      className="btn btn-primary btn-xs"
                      href={p.demoUrl}
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
          {!projects.length && (
            <div className="alert alert-info text-sm">Aún no hay proyectos.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
