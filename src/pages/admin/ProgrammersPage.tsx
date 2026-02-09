import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Save, X, Github, Linkedin, Instagram, Globe } from 'lucide-react'
import { FiEdit2, FiPlus, FiTrash2, FiUser } from 'react-icons/fi'
import { FormUtils } from '../../utils/FormUtils'
import { compressImage, getPhotoURL } from '../../utils/photoStorage'
import {
  listProgrammers,
  upsertProgrammer,
  deleteProgrammer,
} from '../../services/data.service'

// Datos base para el formulario de alta/edición
const initialForm = {
  displayName: '',
  lastName: '',
  email: '',
  specialty: '',
  bio: '',
  quote: '',
  location: '',
  role: 'programmer',
  photoURL: '',
  github: '',
  instagram: '',
  linkedin: '',
  whatsapp: '',
  // Stats
  projects: '',
  experience: '',
  clients: '',
}

const ProgrammersPage = () => {
  const [form, setForm] = useState(initialForm)
  const [programmers, setProgrammers] = useState<(any & { id: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  // Arrays dinámicos para habilidades con niveles
  const [skills, setSkills] = useState<{ name: string, level: number }[]>([
    { name: 'JavaScript', level: 80 },
    { name: 'React', level: 85 }
  ])
  const [newSkill, setNewSkill] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(80)

  // Reglas de validación
  const validationRules = {
    displayName: [
      (val: string) => FormUtils.required(val),
      (val: string) => FormUtils.minLength(val, 2)
    ],
    lastName: [
      (val: string) => FormUtils.required(val),
    ],
    email: [
      (val: string) => FormUtils.required(val),
      (val: string) => FormUtils.email(val)
    ],
    specialty: [
      (val: string) => FormUtils.required(val),
      (val: string) => FormUtils.minLength(val, 3)
    ],
    bio: [
      (val: string) => FormUtils.minLength(val, 10)
    ],
    location: [],
    quote: [],
    github: [
      (val: string) => val && FormUtils.url(val)
    ],
    instagram: [
      (val: string) => val && FormUtils.url(val)
    ],
    linkedin: [
      (val: string) => val && FormUtils.url(val)
    ],
    whatsapp: [
      (val: string) => val && FormUtils.url(val)
    ],
  }

  const loadProgrammers = async () => {
    const data = await listProgrammers()
    const processedData = data.map((dev: any) => {
      let skills = dev.skills;
      let socials = dev.socials;
      let stats = dev.stats;

      try {
        if (typeof skills === 'string') skills = JSON.parse(skills);
      } catch (e) {
        skills = [];
      }

      try {
        if (typeof socials === 'string') socials = JSON.parse(socials);
      } catch (e) {
        socials = {};
      }

      try {
        if (typeof stats === 'string') stats = JSON.parse(stats);
      } catch (e) {
        stats = {};
      }

      return { ...dev, skills, socials, stats };
    });
    setProgrammers(processedData)
  }
  useEffect(() => {
    loadProgrammers()
  }, [])

  // Agregar habilidad dinámicamente
  const onAddSkill = () => {
    if (!newSkill.trim() || newSkill.length < 2) return
    setSkills([...skills, { name: newSkill.trim(), level: newSkillLevel }])
    setNewSkill('')
    setNewSkillLevel(80)
  }

  // Eliminar habilidad
  const onDeleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  // Actualizar nivel de habilidad
  const onUpdateSkillLevel = (index: number, level: number) => {
    setSkills(skills.map((s, i) => i === index ? { ...s, level } : s))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Validar el campo en tiempo real si ya fue tocado
    if (touched[name]) {
      const fieldRules = validationRules[name as keyof typeof validationRules]
      if (fieldRules) {
        const error = FormUtils.validate(value, fieldRules)
        setFormErrors(prev => ({
          ...prev,
          [name]: error || ''
        }))
      }
    }
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))

    // Validar al perder el foco
    const fieldRules = validationRules[fieldName as keyof typeof validationRules]
    if (fieldRules) {
      const error = FormUtils.validate(form[fieldName as keyof typeof form], fieldRules)
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }))
    }
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  /* 
   * Función para convertir imagen a Base64 y simular subida.
   * NOTA: Esto guarda la imagen como string en la BD. 
   * Idealmente el backend debería manejar subida de archivos real.
   */
  const uploadPhoto = async (file: File): Promise<string> => {
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

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as { [key: string]: boolean })
    setTouched(allTouched)

    // Validar todo el formulario
    const errors = FormUtils.validateForm(form, validationRules)
    setFormErrors(errors)

    // Validar arrays dinámicos
    if (skills.length < 2) {
      errors['skills'] = 'Debe tener al menos 2 habilidades'
    }

    // Si hay errores, no enviar
    if (FormUtils.hasErrors(errors)) {
      setError('Por favor corrige los errores en el formulario.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Generar UID automático si es nuevo, o usar el existente si es edición
      // IMPORTANTE: El backend genera IDs numéricos (Long).
      // Si estamos editando, usamos el ID existente. Si es nuevo, el backend lo genera.
      // Para mantener compatibilidad con el frontend que espera strings, manejamos la conversión.
      const uid = editingId || undefined

      let photoURL = form.photoURL

      // Guardar foto en localStorage (comprimida) -> CAMBIO: Ahora Base64 directo a BD
      if (photoFile) {
        try {
          // Comprimir imagen antes de guardar
          const compressedBase64 = await compressImage(photoFile, 200, 0.7)
          photoURL = compressedBase64
        } catch (compressError) {
          console.error('Error comprimiendo imagen:', compressError)
          setError('Error al procesar la imagen. Intenta con una más pequeña.')
          setLoading(false)
          return
        }
      }

      // Construir objeto socials solo con valores que existan
      const socials: Record<string, string> = {}
      if (form.github) socials.github = form.github
      if (form.instagram) socials.instagram = form.instagram
      if (form.linkedin) socials.linkedin = form.linkedin
      if (form.whatsapp) socials.whatsapp = form.whatsapp

      // Construir stats
      const stats = {
        projects: parseInt(form.projects) || 0,
        experience: form.experience || '1 año',
        clients: parseInt(form.clients) || 0,
      }

      await upsertProgrammer(uid, {
        displayName: form.displayName,
        lastName: form.lastName,
        email: form.email,
        specialty: form.specialty,
        bio: form.bio,
        quote: form.quote,
        location: form.location,
        role: 'PROGRAMMER',
        photoURL: photoURL,
        skills: JSON.stringify(skills), // Send as JSON string
        socials: JSON.stringify(socials), // Send as JSON string
        stats: JSON.stringify(stats), // Send as JSON string
      })
      setMessage(editingId ? '✓ Programador actualizado correctamente.' : '✓ Programador guardado correctamente.')
      setForm(initialForm)
      setSkills([{ name: 'JavaScript', level: 80 }, { name: 'React', level: 85 }])
      setNewSkill('')
      setNewSkillLevel(80)
      setPhotoFile(null)
      setPhotoPreview('')
      setFormErrors({})
      setTouched({})
      setEditingId(null)
      await loadProgrammers()
    } catch (err: any) {
      console.error('Error al guardar programador:', err)
      setError(`Error al guardar: ${err.message || 'Verifica permisos de Firebase'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (dev: any & { id: string }) => {
    setEditingId(dev.id)

    // Helper to safely parse JSON
    const safeParse = (str: string | any, fallback: any) => {
      if (typeof str !== 'string') return str || fallback;
      try {
        return JSON.parse(str);
      } catch (e) {
        return fallback;
      }
    };

    const parsedSocials = safeParse(dev.socials, {});
    const parsedStats = safeParse(dev.stats, {});
    const parsedSkills = safeParse(dev.skills, [{ name: 'JavaScript', level: 80 }]);

    setForm({
      displayName: dev.displayName || '',
      lastName: dev.lastName || '',
      email: dev.email || '',
      specialty: dev.specialty || '',
      location: dev.location || '',
      bio: dev.bio || '',
      quote: dev.quote || '',
      role: 'programmer',
      photoURL: dev.photoURL || '',
      github: parsedSocials.github || '',
      instagram: parsedSocials.instagram || '',
      linkedin: parsedSocials.linkedin || '',
      whatsapp: parsedSocials.whatsapp || '',
      projects: parsedStats.projects?.toString() || '0',
      experience: parsedStats.experience || '1 año',
      clients: parsedStats.clients?.toString() || '0',
    })

    // Convertir skills al formato correcto
    const loadedSkills = parsedSkills || [{ name: 'JavaScript', level: 80 }]
    setSkills(Array.isArray(loadedSkills) ? loadedSkills.map((s: any) =>
      typeof s === 'string' ? { name: s, level: 80 } : s
    ) : [{ name: 'JavaScript', level: 80 }])

    setPhotoPreview(getPhotoURL(dev.photoURL))
    setFormErrors({})
    setTouched({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (uid: string, displayName: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${displayName}?`)) return

    try {
      await deleteProgrammer(uid)
      setMessage(`✓ ${displayName} eliminado correctamente.`)
      await loadProgrammers()
    } catch (err) {
      setError('No se pudo eliminar el programador.')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(initialForm)
    setSkills([{ name: 'JavaScript', level: 80 }, { name: 'React', level: 85 }])
    setNewSkill('')
    setNewSkillLevel(80)
    setPhotoFile(null)
    setPhotoPreview('')
    setFormErrors({})
    setTouched({})
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-[#D4AF37]/10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              to="/admin"
              className="p-2 rounded-xl text-[#8B7355] hover:bg-[#FFF8E7] hover:text-[#D4AF37] transition-all"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#5D4E37] tracking-tight">
                Gestión de Programadores
              </h1>
              <p className="text-[#8B7355] text-sm mt-1">
                Crea, edita y administra los perfiles del equipo técnico
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Formulario (Izquierda) */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-[#D4AF37]/10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#FFF8E7] to-[#fff5d6] px-6 py-4 border-b border-[#D4AF37]/10 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#5D4E37] flex items-center gap-2">
                  {editingId ? <FiEdit2 /> : <FiPlus />}
                  {editingId ? 'Editar Perfil' : 'Nuevo Programador'}
                </h2>
                {/* Botón Reset/Cancelar */}
                {(editingId || form.displayName) && (
                  <button
                    onClick={handleCancelEdit}
                    type="button"
                    className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {message && (
                    <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm border border-green-100 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {message}
                    </div>
                  )}
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      {error}
                    </div>
                  )}

                  {/* Foto de Perfil */}
                  <div className="flex flex-col items-center gap-4 py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-md">
                        {photoPreview || form.photoURL ? (
                          <img src={photoPreview || getPhotoURL(form.photoURL)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <FiUser size={32} />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                        <span className="text-xs font-medium">Cambiar</span>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">Click en la imagen para subir foto</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="text-xs font-bold text-[#8B7355] ml-1 mb-1.5 block">Nombre</label>
                      <input
                        type="text"
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        onBlur={() => handleBlur('displayName')}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all ${touched.displayName && formErrors.displayName ? 'border-red-300' : 'border-gray-200 focus:border-[#D4AF37]'
                          }`}
                        placeholder="Ej. Ana"
                      />
                      {touched.displayName && formErrors.displayName && <p className="text-red-500 text-[10px] mt-1 ml-1">{formErrors.displayName}</p>}
                    </div>
                    <div className="form-control">
                      <label className="text-xs font-bold text-[#8B7355] ml-1 mb-1.5 block">Apellido</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        onBlur={() => handleBlur('lastName')}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all ${touched.lastName && formErrors.lastName ? 'border-red-300' : 'border-gray-200 focus:border-[#D4AF37]'
                          }`}
                        placeholder="Ej. García"
                      />
                      {touched.lastName && formErrors.lastName && <p className="text-red-500 text-[10px] mt-1 ml-1">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="text-xs font-bold text-[#8B7355] ml-1 mb-1.5 block">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all ${touched.email && formErrors.email ? 'border-red-300 input-error' : 'border-gray-200 focus:border-[#D4AF37]'
                        }`}
                      placeholder="correo@ejemplo.com"
                    />
                    {touched.email && formErrors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{formErrors.email}</p>}
                  </div>

                  <div className="form-control">
                    <label className="text-xs font-bold text-[#8B7355] ml-1 mb-1.5 block">Especialidad</label>
                    <input
                      type="text"
                      name="specialty"
                      value={form.specialty}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all ${touched.specialty && formErrors.specialty ? 'border-red-300' : 'border-gray-200 focus:border-[#D4AF37]'
                        }`}
                      placeholder="Ej. Full Stack Developer"
                    />
                    {touched.specialty && formErrors.specialty && <p className="text-red-500 text-[10px] mt-1 ml-1">{formErrors.specialty}</p>}
                  </div>

                  <div className="form-control">
                    <label className="text-xs font-bold text-[#8B7355] ml-1 mb-1.5 block">Bio (Resumen)</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none ${touched.bio && formErrors.bio ? 'border-red-300' : 'border-gray-200 focus:border-[#D4AF37]'
                        }`}
                      placeholder="Breve descripción profesional..."
                    />
                    {touched.bio && formErrors.bio && <p className="text-red-500 text-[10px] mt-1 ml-1">{formErrors.bio}</p>}
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-xs font-bold text-[#8B7355] ml-1 block">Habilidades (Skills)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Nueva habilidad..."
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4AF37] outline-none text-sm"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newSkillLevel}
                        onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                        className="w-20 px-2 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D4AF37] outline-none text-sm text-center"
                      />
                      <button
                        type="button"
                        onClick={onAddSkill}
                        className="px-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#B5952F] transition-colors"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-medium border border-amber-100">
                          {typeof skill === 'string' ? skill : `${skill.name} (${skill.level}%)`}
                          <button
                            type="button"
                            onClick={() => onDeleteSkill(index)}
                            className="text-amber-400 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    {formErrors.skills && <p className="text-red-500 text-[10px] mt-1 ml-1">{formErrors.skills}</p>}
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8B7355] uppercase">Proyectos</label>
                      <input type="text" name="projects" value={form.projects} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8B7355] uppercase">Experiencia</label>
                      <input type="text" name="experience" value={form.experience} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="1 año" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8B7355] uppercase">Clientes</label>
                      <input type="text" name="clients" value={form.clients} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="0" />
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-xs font-bold text-[#8B7355] ml-1 block">Redes Sociales</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" name="github" value={form.github} onChange={handleChange} placeholder="GitHub URL" className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs" />
                      </div>
                      <div className="relative">
                        <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs" />
                      </div>
                      <div className="relative">
                        <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram URL" className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-xl font-bold tracking-wide shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={20} /> Guardando...
                        </span>
                      ) : (
                        editingId ? 'Actualizar Programador' : 'Guardar Nuevo Programador'
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          {/* Listado (Derecha - ocupa más espacio en escritorio) */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#D4AF37]/5">
              <h3 className="text-lg font-bold text-[#5D4E37] px-2 mb-4">Equipo Registrado</h3>
              <div className="space-y-4">
                {programmers.map((dev) => (
                  <div key={dev.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="relative">
                      <img
                        src={getPhotoURL(dev.photoURL)}
                        alt={dev.displayName}
                        className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-2 ring-white"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        DEV
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-800 truncate">{dev.displayName} {dev.lastName}</h4>
                      <p className="text-sm text-[#8B7355] truncate">{dev.specialty || 'Programador'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {/* Mostrar solo los primeros 3 skills */}
                        {(Array.isArray(dev.skills) ? dev.skills : []).slice(0, 3).map((s: any, i: number) => (
                          <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            {typeof s === 'string' ? s : s.name}
                          </span>
                        ))}
                        {(Array.isArray(dev.skills) ? dev.skills.length : 0) > 3 && (
                          <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-md">+{dev.skills.length - 3}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          handleEdit(dev)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-amber-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(dev.id, dev.displayName || 'Programador')}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {programmers.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p>No hay programadores registrados aún.</p>
                    <p className="text-sm mt-2 text-gray-300">Completa el formulario para agregar uno.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div >
    </div >
  )
}


export default ProgrammersPage
