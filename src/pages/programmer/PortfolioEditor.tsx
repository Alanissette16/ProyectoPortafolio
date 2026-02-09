/**
 * Editor de portafolio del programador - REDISEÑADO
 * Características: Vista previa en tiempo real, UI moderna, pills para skills
 */
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FiUser, FiBookOpen, FiCode, FiTag, FiDroplet, FiEye, FiSave } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile, upsertPortfolio, getPortfolio } from '../../services/data.service'
import { FormUtils } from '../../utils/FormUtils'

const initial = {
  headline: '',
  about: '',
  skills: '',
  tags: '',
  theme: 'rosegold',
}

const PortfolioEditor = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [showPreview, setShowPreview] = useState(true)

  // Parse skills/tags for preview
  const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean)
  const tagsArray = form.tags.split(',').map((s) => s.trim()).filter(Boolean)

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      const data = await getPortfolio(user.uid)
      if (data) {
        let skillsStr = ''
        let tagsStr = ''

        try {
          if (data.skills) {
            const skillsArray = typeof data.skills === 'string'
              ? JSON.parse(data.skills)
              : data.skills

            if (Array.isArray(skillsArray)) {
              skillsStr = skillsArray.map(s => typeof s === 'object' ? (s.name || s.label || '') : s).join(', ')
            } else {
              skillsStr = data.skills || ''
            }
          }
        } catch {
          skillsStr = data.skills || ''
        }

        try {
          if (data.tags) {
            const tagsArray = typeof data.tags === 'string'
              ? JSON.parse(data.tags)
              : data.tags

            if (Array.isArray(tagsArray)) {
              tagsStr = tagsArray.map(t => typeof t === 'object' ? (t.name || t.label || '') : t).join(', ')
            } else {
              tagsStr = data.tags || ''
            }
          }
        } catch {
          tagsStr = data.tags || ''
        }

        const formData = {
          headline: data.headline || '',
          about: data.about || '',
          skills: skillsStr,
          tags: tagsStr,
          theme: data.theme || 'rosegold',
        }
        setForm(formData)
      }
    }
    load()
  }, [user?.uid])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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
    setFormErrors({})

    const rules = {
      headline: [FormUtils.required],
      about: [FormUtils.required, (v: string) => FormUtils.minLength(v, 20)],
    }

    const validationErrors = FormUtils.validateForm(form, rules)
    setFormErrors(validationErrors)

    if (FormUtils.hasErrors(validationErrors)) {
      setLoading(false)
      return
    }

    try {
      const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean)
      const tagsArray = form.tags.split(',').map((s) => s.trim()).filter(Boolean)

      await upsertPortfolio(user.uid, {
        headline: form.headline,
        about: form.about,
        skills: JSON.stringify(skillsArray),
        tags: JSON.stringify(tagsArray),
        theme: form.theme,
      })
      setMessage('¡Portafolio guardado exitosamente!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Error al cargar perfil. Revisa tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Mi Portafolio
        </h1>
        <p className="text-base-content/70 mt-1">
          Personaliza cómo se ve tu perfil público
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Column */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-lg">Información</h2>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn btn-ghost btn-sm gap-2 lg:hidden"
                >
                  <FiEye /> Vista previa
                </button>
              </div>

              {message && (
                <div className="alert alert-success shadow-lg">
                  <FiSave />
                  <span>{message}</span>
                </div>
              )}
              {error && (
                <div className="alert alert-error shadow-lg">
                  <span>{error}</span>
                </div>
              )}

              {/* Headline */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FiUser className="text-primary" />
                    Headline *
                  </span>
                </label>
                <input
                  name="headline"
                  value={form.headline}
                  onChange={handleChange}
                  className={`input input-bordered focus:input-primary ${formErrors.headline ? 'input-error' : ''}`}
                  placeholder="Desarrollador Full Stack | React & Node.js"
                  required
                />
                {formErrors.headline && <span className="text-error text-xs mt-1">{formErrors.headline}</span>}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Tu título profesional en una línea
                  </span>
                </label>
              </div>

              {/* About */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FiBookOpen className="text-primary" />
                    Sobre mí
                  </span>
                </label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  className={`textarea textarea-bordered h-24 focus:textarea-primary ${formErrors.about ? 'textarea-error' : ''}`}
                  placeholder="Soy un apasionado por la tecnología..."
                  required
                />
                {formErrors.about && <span className="text-error text-xs mt-1">{formErrors.about}</span>}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Cuéntanos sobre ti, tu experiencia y qué te apasiona...
                  </span>
                </label>
              </div>

              {/* Skills */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FiCode className="text-primary" />
                    Skills
                  </span>
                </label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary"
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Separa con comas (,)
                  </span>
                </label>
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FiTag className="text-primary" />
                    Tags
                  </span>
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary"
                  placeholder="Frontend, Backend, Fullstack"
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Categorías de trabajo
                  </span>
                </label>
              </div>

              {/* Theme */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FiDroplet className="text-primary" />
                    Tema del portafolio
                  </span>
                </label>
                <select
                  name="theme"
                  value={form.theme}
                  onChange={handleChange}
                  className="select select-bordered focus:select-primary"
                >
                  <option value="rosegold">✨ Rosa Dorado</option>
                  <option value="lavender">💜 Lavanda</option>
                  <option value="rosepink">💗 Rosa Pink</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="card-actions justify-end pt-4">
                <button
                  className="btn btn-primary gap-2 w-full sm:w-auto"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Guardar portafolio
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Column */}
        <div className={`${showPreview ? 'block' : 'hidden lg:block'} space-y-4`}>
          <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300 sticky top-4">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <FiEye className="text-primary" />
                <h2 className="card-title text-lg">Vista Previa</h2>
              </div>

              {/* Preview Header */}
              <div className="space-y-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-20 h-20">
                    <span className="text-3xl font-bold">
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    {user?.displayName || 'Tu Nombre'}
                  </h3>
                  <p className="text-base-content/70 mt-1">
                    {form.headline || 'Tu headline aparecerá aquí'}
                  </p>
                </div>

                {/* About Preview */}
                {form.about && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Sobre mí</h4>
                    <p className="text-sm text-base-content/80 whitespace-pre-wrap">
                      {form.about}
                    </p>
                  </div>
                )}

                {/* Skills Preview */}
                {skillsArray.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, index) => (
                        <span key={index} className="badge badge-primary gap-1">
                          <FiCode className="w-3 h-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Preview */}
                {tagsArray.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tagsArray.map((tag, index) => (
                        <span key={index} className="badge badge-secondary badge-outline">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Theme Preview */}
                <div className="mt-4 p-3 rounded-lg bg-base-100/50 border border-base-content/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tema seleccionado:</span>
                    <span className="badge badge-ghost">
                      {form.theme === 'rosegold' && '✨ Rosa Dorado'}
                      {form.theme === 'lavender' && '💜 Lavanda'}
                      {form.theme === 'rosepink' && '💗 Rosa Pink'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioEditor
