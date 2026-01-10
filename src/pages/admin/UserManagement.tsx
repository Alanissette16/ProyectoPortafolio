/**
 * Página de Gestión de Usuarios y Roles (Admin)
 * Permite listar todos los usuarios registrados y cambiar sus roles (admin, programmer, external).
 */
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    CheckCircle,
    Loader2,
    Lock,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    User,
    UserCog
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserRole } from '../../models/User'
import { listAllUsers, updateUserRole } from '../../services/firestore.service'

interface UserData {
    id: string
    displayName?: string
    email: string
    role: UserRole
    photoURL?: string
    createdAt?: any
}

const UserManagement = () => {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const allUsers = await listAllUsers() as UserData[]
            // Ordenar por fecha de creación o nombre (opcional)
            setUsers(allUsers)
        } catch (error) {
            console.error('Error cargando usuarios:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        setUpdatingId(userId)
        try {
            await updateUserRole(userId, newRole)
            // Actualizar estado local
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
        } catch (error) {
            console.error('Error actualizando rol:', error)
            alert('Error al actualizar el rol. Intenta de nuevo.')
        } finally {
            setUpdatingId(null)
        }
    }

    // Filtrado de búsqueda
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-700 border-red-200'
            case 'programmer': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'external': return 'bg-blue-100 text-blue-700 border-blue-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'admin': return <ShieldAlert size={14} />
            case 'programmer': return <UserCog size={14} />
            default: return <User size={14} />
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 pt-20 max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link
                        to="/admin"
                        className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#D4AF37] mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Volver al Panel
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-[#5D4E37]">
                        Gestión de Usuarios y Roles
                    </h1>
                    <p className="text-[#8B7355] font-body mt-1">
                        Administra los permisos y accesos de todos los usuarios registrados.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#D4AF37]/10 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#FFF8E7] border-b border-[#D4AF37]/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8B7355] uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8B7355] uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8B7355] uppercase tracking-wider">Rol Actual</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8B7355] uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                                                        {user.photoURL ? (
                                                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User size={20} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#3D3D3D]">
                                                            {user.displayName || 'Usuario sin nombre'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        disabled={updatingId === user.id}
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                                        className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37]/20 disabled:opacity-50"
                                                    >
                                                        <option value="external">External</option>
                                                        <option value="programmer">Programmer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    {updatingId === user.id && (
                                                        <Loader2 className="animate-spin text-[#D4AF37]" size={16} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default UserManagement
