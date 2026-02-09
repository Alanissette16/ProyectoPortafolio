/**
 * Editor de perfil del programador (foto, nombre, bio, especialidad).
 */
import { motion } from 'framer-motion'
import { AlertTriangle, Briefcase, Camera, Clock, Github, Instagram, Linkedin, MapPin, Phone, Plus, Quote, Save, Sparkles, Users, X } from 'lucide-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../../services/data.service'

const initialForm = {
  displayName: '',
  lastName: '',
  email: '',
  specialty: '',
  bio: '',
  quote: '',
  location: '',
  github: '',
  instagram: '',
  linkedin: '',
  whatsapp: '',
  // Stats
  projects: '',
  experience: '',
  clients: '',
}

const ProfileEditor = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [skills, setSkills] = useState<{ name: string, level: number }[]>([
    { name: 'JavaScript', level: 80 },
    { name: 'React', level: 85 }
  ])
  const [newSkill, setNewSkill] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(80)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return
      try {
        const data = await getUserProfile(user.uid)
        if (data) {
          // Parse socials from JSON string if needed
          let socials = data.socials || {};
          if (typeof socials === 'string') {
            try {
              socials = JSON.parse(socials);
            } catch {
              socials = {};
            }
          }

          // Parse stats from JSON string if needed
          let stats = data.stats || {};
          if (typeof stats === 'string') {
            try {
              stats = JSON.parse(stats);
            } catch {
              stats = {};
            }
          }

          setForm({
            displayName: data.displayName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            specialty: data.specialty || '',
            bio: data.bio || '',
            quote: data.quote || '',
            location: data.location || '',
            github: socials?.github || '',
            instagram: socials?.instagram || '',
            linkedin: socials?.linkedin || '',
            whatsapp: socials?.whatsapp || '',
            projects: stats?.projects?.toString() || '',
            experience: stats?.experience || '',
            clients: stats?.clients?.toString() || '',
          })

          // Parse skills from JSON string if needed
          let skillsData = data.skills;
          if (typeof skillsData === 'string') {
            try {
              skillsData = JSON.parse(skillsData);
            } catch {
              skillsData = [];
            }
          }

          // Cargar skills con niveles
          const loadedSkills = skillsData || [{ name: 'JavaScript', level: 80 }]
          setSkills(Array.isArray(loadedSkills) ? loadedSkills.map((s: any) =>
            typeof s === 'string' ? { name: s, level: 80 } : s
          ) : [{ name: 'JavaScript', level: 80 }])

          // Cargar foto
          const savedPhoto = localStorage.getItem(`photo_${user.uid}`)
          setPhotoPreview(savedPhoto || data.photoURL || '')
        }
      } catch (err) {
        console.error('Error cargando perfil:', err)
      }
    }
    loadProfile()
  }, [user?.uid])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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

  // Convertir foto a Base64
  const convertPhotoToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.uid) {
      setError('Usuario no autenticado')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      let photoURL = user.photoURL

      // Guardar foto en localStorage si hay una nueva (o como string en BD)
      if (photoFile) {
        const base64 = await convertPhotoToBase64(photoFile)
        photoURL = base64
        localStorage.setItem(`photo_${user.uid}`, base64)
      }

      // Construir objeto socials sin undefined
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

      const payload = {
        displayName: form.displayName,
        lastName: form.lastName,
        email: form.email,
        specialty: form.specialty,
        bio: form.bio,
        quote: form.quote,
        location: form.location,
        skills: JSON.stringify(skills), // Convert array to JSON string
        socials: JSON.stringify(socials), // Convert object to JSON string
        stats: JSON.stringify(stats), // Convert object to JSON string
        photoURL: photoURL, // Updated photo
        // updatedAt: serverTimestamp(), // Backend handles this
      }

      // Actualizar documento en Backend
      await updateUserProfile(user.uid, payload)
      setMessage('✓ Perfil actualizado correctamente.')
      setPhotoFile(null)
    } catch (err: any) {
      console.error('❌ Error completo:', err)
      setError(`Error: ${err.message || 'No se pudo actualizar'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="p-6 md:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#5D4E37]">Editar mi perfil</h1>
          <p className="text-[#8B7355] font-body text-sm">Personaliza tu información profesional</p>
        </div>
        <Sparkles className="text-[#D4AF37]" size={28} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 font-body"
          >
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 font-body"
          >
            {error}
          </motion.div>
        )}

        {/* Photo Section */}
        <div className="p-6 rounded-2xl border border-[#D4AF37]/15" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(255, 250, 240, 0.8))' }}>
          <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-4">
            Foto de perfil
          </label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#D4AF37]/30 ring-offset-2">
                <img
                  src={photoPreview || '/default-avatar.png'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 rounded-full cursor-pointer text-white shadow-lg hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                <Camera size={18} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            <div>
              <p className="text-sm text-[#8B7355] font-body">
                Sube una foto profesional que te represente
              </p>
              <p className="text-xs text-[#8B7355]/70 font-body mt-1">
                Formatos: JPG, PNG. Max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-2">
              Nombre *
            </label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-2">
              Apellido *
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-2">
              Email *
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
              required
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#5D4E37] font-body mb-2">
              <MapPin size={16} className="text-[#D4AF37]" />
              Ubicación
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
              placeholder="Ej: Guayaquil, Ecuador"
            />
          </div>
        </div>

        {/* Especialidad */}
        <div>
          <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-2">
            Especialidad / Rol
          </label>
          <input
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
            placeholder="Ej: Full Stack Developer"
          />
        </div>

        {/* Biografía */}
        <div>
          <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-2">
            Biografía
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body resize-none"
            rows={4}
            placeholder="Cuéntanos sobre ti..."
          />
        </div>

        {/* Quote / Frase */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#5D4E37] font-body mb-2">
            <Quote size={16} className="text-[#D4AF37]" />
            Frase que te representa
          </label>
          <input
            name="quote"
            value={form.quote}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
            placeholder="Ej: El código es poesía que da vida a las ideas ✨"
          />
        </div>

        {/* Stats Section */}
        <div className="p-6 rounded-2xl border border-[#D4AF37]/15" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(255, 250, 240, 0.8))' }}>
          <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-4">
            Estadísticas de tu perfil
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="flex items-center gap-2 text-sm text-[#5D4E37] font-body mb-2">
                <Briefcase size={14} className="text-[#D4AF37]" />
                Proyectos realizados
              </label>
              <input
                name="projects"
                type="number"
                value={form.projects}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
                placeholder="15"
                min="0"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-[#5D4E37] font-body mb-2">
                <Clock size={14} className="text-[#D4AF37]" />
                Experiencia
              </label>
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
                placeholder="3 años"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-[#5D4E37] font-body mb-2">
                <Users size={14} className="text-[#D4AF37]" />
                Clientes
              </label>
              <input
                name="clients"
                type="number"
                value={form.clients}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
                placeholder="10"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Habilidades con niveles */}
        <div className="p-6 rounded-2xl border border-[#D4AF37]/15" style={{ background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.05), rgba(255, 250, 240, 0.8))' }}>
          <label className="block text-sm font-semibold text-[#5D4E37] font-body mb-4">
            Habilidades técnicas (mínimo 2)
          </label>

          {/* Agregar nueva habilidad */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body"
              placeholder="Nombre de habilidad (ej: TypeScript)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (newSkill.trim()) {
                    setSkills([...skills, { name: newSkill.trim(), level: newSkillLevel }])
                    setNewSkill('')
                    setNewSkillLevel(80)
                  }
                }
              }}
            />
            <input
              type="number"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-20 px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body text-center"
              placeholder="%"
              min="0"
              max="100"
            />
            <button
              type="button"
              onClick={() => {
                if (newSkill.trim()) {
                  setSkills([...skills, { name: newSkill.trim(), level: newSkillLevel }])
                  setNewSkill('')
                  setNewSkillLevel(80)
                }
              }}
              className="px-4 py-2.5 rounded-xl text-white font-semibold font-body flex items-center gap-2 hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #B8860B, #8B7355)' }}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Lista de habilidades */}
          <div className="space-y-3">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...skills]
                    newSkills[idx] = { ...skill, name: e.target.value }
                    setSkills(newSkills)
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none font-body"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...skills]
                    newSkills[idx] = { ...skill, level: parseInt(e.target.value) }
                    setSkills(newSkills)
                  }}
                  className="w-32 accent-[#D4AF37]"
                />
                <span className="text-sm font-medium text-[#5D4E37] w-12 text-center">{skill.level}%</span>
                <button
                  type="button"
                  onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                  className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {skills.length < 2 && (
            <p className="mt-3 text-sm text-amber-600 font-body flex items-center gap-1"><AlertTriangle size={16} /> Agrega al menos 2 habilidades</p>
          )}
        </div>

        {/* Redes Sociales */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#D4AF37]/20" />
            <span className="text-sm font-semibold text-[#8B7355] font-body">Redes Sociales</span>
            <div className="h-px flex-1 bg-[#D4AF37]/20" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#5D4E37] font-body mb-2">
                <Github size={16} className="text-[#D4AF37]" />
                GitHub
              </label>
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body text-sm"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#5D4E37] font-body mb-2">
                <Instagram size={16} className="text-[#D4AF37]" />
                Instagram
              </label>
              <input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#5D4E37] font-body mb-2">
                <Linkedin size={16} className="text-[#D4AF37]" />
                LinkedIn
              </label>
              <input
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body text-sm"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#5D4E37] font-body mb-2">
                <Phone size={16} className="text-[#D4AF37]" />
                WhatsApp
              </label>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-body text-sm"
                placeholder="https://wa.me/593..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            className="px-8 py-3 rounded-xl text-white font-semibold font-body flex items-center gap-2 hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', boxShadow: '0 8px 30px rgba(212, 175, 55, 0.3)' }}
            type="submit"
            disabled={loading}
          >
            <Save size={18} />
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default ProfileEditor
