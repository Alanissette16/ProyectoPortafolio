
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiEdit2, FiGithub, FiImage, FiPlus, FiSave, FiTrash2, FiX, FiLoader } from 'react-icons/fi'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { addProject, deleteProject, listAllProjects, listProjectsByOwner, updateProject, listProgrammers } from '../../services/data.service'
import { FormUtils } from '../../utils/FormUtils'

// Utility for image compression
const compressImage = async (base64Str: string, maxWidth = 800, maxHeight = 600, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64Str
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
  })
}

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  githubUrl: string
  demoUrl?: string
  technologies: string[]
  teamMembers: string[]
  category: 'academico' | 'laboral'
  createdAt: Date
  role?: string
  repoUrl?: string
  techStack?: string[]
}

const ProjectsAdmin = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [programmers, setProgrammers] = useState<any[]>([])

  // Arrays dinámicos
  const [technologies, setTechnologies] = useState<string[]>(['React'])
  const [selectedProgrammerIds, setSelectedProgrammerIds] = useState<string[]>([])

  // Controles temporales para agregar nuevos elementos
  const [newTechnology, setNewTechnology] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    category: 'academico' as 'academico' | 'laboral'
  })

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // Reglas de validación
  const validationRules = {
    title: [
      (val: string) => FormUtils.required(val),
      (val: string) => FormUtils.minLength(val, 3)
    ],
    description: [
      (val: string) => FormUtils.required(val),
      (val: string) => FormUtils.minLength(val, 10)
    ],
    githubUrl: [
      (val: string) => val && FormUtils.url(val)
    ],
    demoUrl: [
      (val: string) => val && FormUtils.url(val)
    ],
  }

  useEffect(() => {
    if (user?.uid) {
      fetchProjects()
      fetchProgrammers()
    }
  }, [user?.uid])

  const fetchProgrammers = async () => {
    try {
      const data = await listProgrammers()
      setProgrammers(data)
    } catch (error) {
      console.error('Error fetching programmers:', error)
    }
  }

  const fetchProjects = async () => {
    if (!user?.uid) return
    try {
      // Admin ve TODOS los proyectos
      const projectsData = await listAllProjects()
      const adaptedProjects = projectsData.map((p: any) => ({
        ...p,
        githubUrl: p.repoUrl || p.githubUrl || '',
        technologies: p.techStack || p.technologies || [],
        createdAt: new Date()
      }))
      setProjects(adaptedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const onAddTechnology = () => {
    if (!newTechnology.trim() || newTechnology.length < 2) return
    setTechnologies([...technologies, newTechnology.trim()])
    setNewTechnology('')
  }

  const onDeleteTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index))
  }

  const onAddProgrammer = (id: string) => {
    if (!id || selectedProgrammerIds.includes(id)) return
    setSelectedProgrammerIds([...selectedProgrammerIds, id])
  }

  const onDeleteProgrammer = (id: string) => {
    setSelectedProgrammerIds(selectedProgrammerIds.filter(pid => pid !== id))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const fieldRules = (validationRules as any)[name]
      if (fieldRules) {
        const error = FormUtils.validate(value, fieldRules)
        setFormErrors(prev => ({ ...prev, [name]: error || '' }))
      }
    }
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    const fieldRules = (validationRules as any)[fieldName]
    if (fieldRules) {
      const error = FormUtils.validate((formData as any)[fieldName], fieldRules)
      setFormErrors(prev => ({ ...prev, [fieldName]: error || '' }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as { [key: string]: boolean })
    setTouched(allTouched)

    const errors = FormUtils.validateForm(formData, validationRules)

    if (technologies.length < 1) errors['technologies'] = 'Al menos 1 tecnología'
    if (selectedProgrammerIds.length < 1) errors['programadorId'] = 'Seleccione al menos un programador'

    setFormErrors(errors)

    if (FormUtils.hasErrors(errors)) {
      alert('Por favor corrige los errores')
      return
    }

    setLoading(true)

    try {
      let imageUrl = formData.imageUrl

      if (imageFile) {
        const rawBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(imageFile)
        })
        imageUrl = await compressImage(rawBase64)
      } else if (formData.imageUrl.startsWith('data:image')) {
        imageUrl = await compressImage(formData.imageUrl)
      }

      const selectedNames = selectedProgrammerIds.map(id => {
        const prog = programmers.find(p => p.id.toString() === id.toString())
        return prog ? `${prog.displayName || ''} ${prog.lastName || ''}`.trim() : `ID: ${id}`
      })

      const projectData: any = {
        title: formData.title,
        description: formData.description,
        imageUrl,
        githubUrl: formData.githubUrl,
        technologies: technologies,
        teamMembers: selectedNames,
        category: formData.category,
        programadorId: selectedProgrammerIds[0],
        createdAt: new Date()
      }

      if (formData.demoUrl) projectData.demoUrl = formData.demoUrl

      if (editingId) {
        await updateProject(editingId, projectData)
      } else {
        await addProject(projectData.programadorId, projectData)
      }

      alert('✓ Guardado correctamente')
      resetForm()
      fetchProjects()
    } catch (error: any) {
      console.error('Error:', error)
      alert('Error: ' + (error.message || 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl || '',
      category: project.category || 'academico',
    })
    setTechnologies(project.technologies)
    const ownerId = (project as any).programadorId?.toString()
    if (ownerId) setSelectedProgrammerIds([ownerId])
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar proyecto?')) return
    try {
      await deleteProject(id)
      fetchProjects()
    } catch (error) {
      console.error(error)
      alert('Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      githubUrl: '',
      demoUrl: '',
      category: 'academico',
    })
    setTechnologies(['React'])
    setSelectedProgrammerIds([])
    setNewTechnology('')
    setImageFile(null)
    setImagePreview('')
    setEditingId(null)
    setShowForm(false)
    setFormErrors({})
    setTouched({})
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-[#D4AF37]/10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link to="/admin" className="p-2 rounded-xl text-[#8B7355] hover:bg-[#FFF8E7] hover:text-[#D4AF37] transition-all"><ArrowLeft size={24} /></Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#5D4E37] tracking-tight">Portafolio</h1>
              <p className="text-[#8B7355] text-sm mt-1">Gestiona los proyectos realizados</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${showForm ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#D4AF37] text-white hover:bg-[#B5952F] shadow-lg shadow-[#D4AF37]/20'}`}>
            {showForm ? <><FiX /> Cancelar</> : <><FiPlus /> Nuevo Proyecto</>}
          </button>
        </div>

        <AnimatePresence mode='wait'>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-xl border border-[#D4AF37]/10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#FFF8E7] to-[#fff5d6] px-6 py-4 border-b border-[#D4AF37]/10">
                <h2 className="text-lg font-bold text-[#5D4E37] flex items-center gap-2">{editingId ? <FiEdit2 /> : <FiPlus />} {editingId ? 'Editar' : 'Crear'}</h2>
              </div>
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-[#8B7355] block mb-1">Título *</label>
                        <input name="title" value={formData.title} onChange={handleChange} onBlur={() => handleBlur('title')} className={`w-full px-4 py-3 rounded-xl border ${touched.title && formErrors.title ? 'border-red-300' : 'border-gray-200'}`} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#8B7355] block mb-1">Programadores *</label>
                        <select onChange={(e) => onAddProgrammer(e.target.value)} value="" className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-2">
                          <option value="" disabled>Seleccionar...</option>
                          {programmers.map(p => <option key={p.id} value={p.id}>{p.displayName} {p.lastName}</option>)}
                        </select>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl">
                          {selectedProgrammerIds.map(id => {
                            const p = programmers.find(x => x.id.toString() === id.toString())
                            return (
                              <span key={id} className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4AF37]/10 rounded-lg text-xs font-bold">
                                {p ? `${p.displayName} ${p.lastName}` : id}
                                <button type="button" onClick={() => onDeleteProgrammer(id)} className="text-red-500 ml-1"><FiX /></button>
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#8B7355] block mb-1">Descripción *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} onBlur={() => handleBlur('description')} rows={3} className={`w-full px-4 py-3 rounded-xl border ${touched.description && formErrors.description ? 'border-red-300' : 'border-gray-200'}`} />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-[#8B7355] block mb-1">Imagen *</label>
                        <div className="h-40 bg-gray-50 rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden">
                          {imagePreview || formData.imageUrl ? <img src={imagePreview || formData.imageUrl} className="w-full h-full object-cover" /> : <FiImage size={32} className="text-gray-300" />}
                          <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"><input type="file" onChange={handleImageChange} className="hidden" /><span className="text-white text-xs font-bold">Cambiar</span></label>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#8B7355] block mb-1">Tecnologías *</label>
                        <div className="flex gap-2">
                          <input
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTechnology())}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm"
                            placeholder="React, Node..."
                          />
                          <button type="button" onClick={onAddTechnology} className="px-4 bg-[#D4AF37] text-white rounded-xl"><FiPlus /></button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {technologies.map((t, i) => (
                            <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 flex items-center gap-1 font-bold">
                              {t}
                              <button type="button" onClick={() => onDeleteTechnology(i)} className="text-blue-400 hover:text-red-500"><FiX size={10} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#8B7355] block mb-1">URLs</label>
                        <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="GitHub" className="w-full px-4 py-2 rounded-xl border border-gray-200 mb-2 text-sm" />
                        <input name="demoUrl" value={formData.demoUrl} onChange={handleChange} placeholder="Demo" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button type="button" onClick={resetForm} className="font-bold text-gray-500">Cancelar</button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-[#D4AF37] text-white rounded-xl font-bold shadow-lg disabled:opacity-50">
                      {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Publicar'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-50 relative">
                {project.imageUrl && <img src={project.imageUrl} className="w-full h-full object-cover" />}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleEdit(project)} className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#D4AF37] transition-colors"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-colors"><FiTrash2 /></button>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{project.category}</span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">{project.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.technologies?.map((t, i) => <span key={i} className="text-[10px] bg-gray-50 px-2 py-1 rounded border">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsAdmin
