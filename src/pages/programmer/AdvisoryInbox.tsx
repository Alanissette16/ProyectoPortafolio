/**
 * Bandeja de asesorías del programador.
 * Prácticas: Consumo Firestore, manejo de estados, feedback profesional.
 */
import { collection, getDocs, query, where } from 'firebase/firestore'
import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Inbox,
  Mail,
  MessageSquare,
  RefreshCw,
  User,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../services/firebase'
import { updateAdvisoryStatus } from '../../services/firestore'

interface Advisory {
  id: string
  requesterName?: string
  requesterEmail?: string
  programmerName?: string
  programmerId?: string
  slot?: { date: string; time: string }
  note?: string
  status: string
  createdAt?: any
}

const AdvisoryInbox = () => {
  const { user } = useAuth()
  const [items, setItems] = useState<Advisory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas')
  const [updating, setUpdating] = useState<string | null>(null)
  const [responseModal, setResponseModal] = useState<{
    open: boolean
    advisoryId: string
    action: 'aprobada' | 'rechazada'
    message: string
  }>({
    open: false,
    advisoryId: '',
    action: 'aprobada',
    message: ''
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const advisoriesRef = collection(db, 'advisories')
      const q = query(advisoriesRef, where('programmerId', '==', user?.uid))
      const snap = await getDocs(q)
      
      if (snap.empty) {
        setItems([])
        setLoading(false)
        return
      }
      
      const data: Advisory[] = snap.docs.map((d) => {
        return { 
          id: d.id, 
          ...d.data() 
        } as Advisory
      })
      
      // Ordenar por fecha de creación (más recientes primero)
      const sorted = data.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0)
        const dateB = b.createdAt?.toDate?.() || new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
      
      setItems(sorted)
    } catch (err: any) {
      setError(`Error: ${err?.message || 'No se pudieron cargar las asesorías.'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: 'pendiente' | 'aprobada' | 'rechazada', responseMessage?: string) => {
    setUpdating(id)
    try {
      await updateAdvisoryStatus(id, status, responseMessage)
      await load()
    } catch (err) {
      setError('No se pudo actualizar el estado.')
    } finally {
      setUpdating(null)
    }
  }

  const openResponseModal = (advisoryId: string, action: 'aprobada' | 'rechazada') => {
    setResponseModal({
      open: true,
      advisoryId,
      action,
      message: action === 'aprobada' ? '¡Tu solicitud de asesoría ha sido aprobada! Me pondré en contacto contigo pronto.' : 'Lamentablemente no puedo atender tu solicitud de asesoría en este momento.'
    })
  }

  const closeResponseModal = () => {
    setResponseModal({
      open: false,
      advisoryId: '',
      action: 'aprobada',
      message: ''
    })
  }

  const handleResponseSubmit = async () => {
    if (!responseModal.message.trim()) {
      alert('Por favor ingresa un mensaje de respuesta')
      return
    }
    
    await updateStatus(responseModal.advisoryId, responseModal.action, responseModal.message)
    closeResponseModal()
  }

  const filteredItems = filter === 'todas' 
    ? items 
    : items.filter(item => item.status === filter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">⏳ Pendiente</span>
      case 'aprobada':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">✓ Aprobada</span>
      case 'rechazada':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">✗ Rechazada</span>
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>
    }
  }

  const pendingCount = items.filter(i => i.status === 'pendiente').length

  return (
    <div className="relative min-h-screen p-20 mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-[#5D4E37] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">
                <MessageSquare className="text-white" size={24} />
              </div>
              Asesorías
              {pendingCount > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
                  {pendingCount} nueva{pendingCount > 1 ? 's' : ''}
                </span>
              )}
            </h1>
            <p className="text-[#8B7355] mt-2 font-body">
              Revisa y gestiona las solicitudes de asesoría que has recibido
            </p>
          </div>
          
          <button 
            onClick={load} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#D4AF37]/30 text-[#5D4E37] font-semibold hover:bg-[#FFF8E7] transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 mb-6"
      >
        <Filter size={18} className="text-[#8B7355]" />
        <span className="text-sm text-[#8B7355] font-body mr-2">Filtrar:</span>
        {[
          { key: 'todas', label: 'Todas', color: 'bg-gray-100 text-gray-700' },
          { key: 'pendiente', label: 'Pendientes', color: 'bg-amber-100 text-amber-700' },
          { key: 'aprobada', label: 'Aprobadas', color: 'bg-green-100 text-green-700' },
          { key: 'rechazada', label: 'Rechazadas', color: 'bg-red-100 text-red-700' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f.key 
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-md' 
                : `${f.color} hover:opacity-80`
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2"
        >
          <XCircle size={18} />
          {error}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#D4AF37]/10 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de asesorías */}
      {!loading && (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6 rounded-2xl bg-white border border-[#D4AF37]/10"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#FFF8E7] to-[#FFF0D4] mb-4">
                <Inbox className="text-[#D4AF37]" size={36} />
              </div>
              <h3 className="text-xl font-display font-bold text-[#5D4E37] mb-2">
                No hay solicitudes {filter !== 'todas' ? filter + 's' : ''}
              </h3>
              <p className="text-[#8B7355] font-body">
                Cuando recibas solicitudes de asesoría aparecerán aquí ✨
              </p>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-white border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Info del solicitante */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 flex items-center justify-center">
                        <User className="text-[#D4AF37]" size={24} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-[#5D4E37] text-lg">
                          {item.requesterName || 'Usuario'}
                        </h3>
                        <p className="text-sm text-[#8B7355] flex items-center gap-1">
                          <Mail size={14} />
                          {item.requesterEmail || 'Sin email'}
                        </p>
                      </div>
                    </div>

                    {/* Fecha y hora */}
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <span className="flex items-center gap-2 text-sm text-[#5D4E37] bg-[#FFF8E7] px-3 py-1.5 rounded-lg">
                        <Calendar size={16} className="text-[#D4AF37]" />
                        {item.slot?.date || 'Sin fecha'}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-[#5D4E37] bg-[#FFF8E7] px-3 py-1.5 rounded-lg">
                        <Clock size={16} className="text-[#D4AF37]" />
                        {item.slot?.time || 'Sin hora'}
                      </span>
                    </div>

                    {/* Nota/mensaje */}
                    {item.note && (
                      <div className="p-4 rounded-xl bg-[#FFFAF5] border border-[#D4AF37]/10">
                        <p className="text-sm text-[#5D4E37] font-body whitespace-pre-wrap">
                          {item.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Estado y acciones */}
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(item.status)}
                    
                    {item.status === 'pendiente' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => openResponseModal(item.id, 'aprobada')}
                          disabled={updating === item.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                        >
                          <CheckCircle size={18} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => openResponseModal(item.id, 'rechazada')}
                          disabled={updating === item.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                          <XCircle size={18} />
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Modal de respuesta */}
      {responseModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
          >
            <div className={`p-6 ${responseModal.action === 'aprobada' ? 'bg-green-500' : 'bg-red-500'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-white">
                  {responseModal.action === 'aprobada' ? 'Aprobar Asesoría' : 'Rechazar Asesoría'}
                </h3>
                <button
                  onClick={closeResponseModal}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-base-content/70 mb-4">
                {responseModal.action === 'aprobada' 
                  ? 'Ingresa un mensaje de confirmación para el solicitante:'
                  : 'Ingresa una justificación para el rechazo:'
                }
              </p>
              
              <textarea
                value={responseModal.message}
                onChange={(e) => setResponseModal(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-base-300 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                placeholder="Escribe tu mensaje aquí..."
              />
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeResponseModal}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-base-300 text-base-content/70 hover:bg-base-100 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResponseSubmit}
                  disabled={updating === responseModal.advisoryId}
                  className={`flex-1 px-4 py-3 rounded-xl text-white font-semibold transition-all ${
                    responseModal.action === 'aprobada'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  } disabled:opacity-50`}
                >
                  {updating === responseModal.advisoryId ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdvisoryInbox
