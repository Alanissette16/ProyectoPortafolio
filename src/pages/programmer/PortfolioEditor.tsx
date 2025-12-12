/**
 * Editor de portafolio del programador.
 * Prácticas: Formularios controlados, validación mínima, feedback DaisyUI.
 */
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getPortfolio, upsertPortfolio } from '../../services/firestore'

const initial = {
  headline: '',
  about: '',
  skills: '',
  tags: '',
  theme: 'light',
}

const PortfolioEditor = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      const data = await getPortfolio(user.uid)
      if (data) {
        setForm({
          headline: data.headline || '',
          about: data.about || '',
          skills: data.skills?.join(', ') || '',
          tags: data.tags?.join(', ') || '',
          theme: data.theme || 'light',
        })
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
    try {
      await upsertPortfolio(user.uid, {
        headline: form.headline,
        about: form.about,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        theme: form.theme,
      })
      setMessage('Portafolio guardado.')
    } catch (err) {
      setError('No se pudo guardar. Revisa conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-4 pt-20 mx-auto">
      <h1 className="text-2xl font-bold">Mi portafolio</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md">
        <div className="card-body space-y-3">
          {message && <div className="alert alert-success text-sm">{message}</div>}
          {error && <div className="alert alert-error text-sm">{error}</div>}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Headline *</span>
            </label>
            <input
              name="headline"
              value={form.headline}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Sobre mí</span>
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              className="textarea textarea-bordered"
              rows={3}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Skills (coma)</span>
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="React, Firebase, Tailwind"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tags (coma)</span>
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Frontend, Fullstack"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tema DaisyUI</span>
            </label>
            <select
              name="theme"
              value={form.theme}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="emerald">Emerald</option>
            </select>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar portafolio'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PortfolioEditor
