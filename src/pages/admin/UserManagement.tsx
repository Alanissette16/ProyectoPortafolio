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
import { deleteProgrammer, listAllUsers, updateUserRole } from '../../services/data.service'

interface UserData {
    id: number | string
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
    const [updatingId, setUpdatingId] = useState<string | number | null>(null)

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

    const handleRoleChange = async (userId: string | number, newRole: UserRole) => {
        setUpdatingId(userId)
        try {
            await updateUserRole(String(userId), newRole)
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
            case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200'
            case 'PROGRAMMER': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'EXTERNAL': return 'bg-blue-100 text-blue-700 border-blue-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'ADMIN': return <ShieldAlert size={14} />
            case 'PROGRAMMER': return <UserCog size={14} />
            default: return <User size={14} />
        }
    }

    return (
        <div className="p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-8"
            >
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
                                Gestión de Usuarios
                            </h1>
                            <p className="text-[#8B7355] text-sm mt-1">
                                Administra roles y accesos del sistema
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all duration-300 shadow-inner"
                        />
                    </div>
                </div>

                {/* Tabla de Usuarios */}
                <div className="bg-white rounded-3xl shadow-xl border border-[#D4AF37]/10 overflow-hidden backdrop-blur-sm">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-20 space-y-4">
                            <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
                            <p className="text-gray-500 font-medium animate-pulse">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#FFF8E7] to-[#fff5d6] border-b border-[#D4AF37]/20">
                                        <th className="px-8 py-5 text-left text-xs font-bold text-[#8B7355] uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-[#8B7355] uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-5 text-center text-xs font-bold text-[#8B7355] uppercase tracking-wider">Rol</th>
                                        <th className="px-6 py-5 text-right text-xs font-bold text-[#8B7355] uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="bg-gray-50 p-4 rounded-full">
                                                        <Search size={32} className="text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">No se encontraron usuarios coincidentes.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key={user.id}
                                                className="hover:bg-[#FFFDF7] transition-colors group"
                                            >
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-sm flex items-center justify-center text-gray-400 group-hover:shadow-md transition-shadow">
                                                                {user.photoURL ? (
                                                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User size={24} strokeWidth={1.5} />
                                                                )}
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.role === 'ADMIN' ? 'bg-red-500' : user.role === 'PROGRAMMER' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-800 tracking-tight">
                                                                {user.displayName || 'Usuario sin nombre'}
                                                            </div>
                                                            <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {String(user.id).slice(0, 8)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded-lg inline-block border border-gray-100">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getRoleBadgeColor(user.role)}`}>
                                                        {getRoleIcon(user.role)}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <select
                                                            disabled={updatingId === user.id}
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                                            className="text-sm border-gray-200 bg-white rounded-xl shadow-sm focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37]/20 disabled:opacity-50 py-2 pl-3 pr-8 transition-all hover:border-[#D4AF37]/50 cursor-pointer"
                                                        >
                                                            <option value="EXTERNAL">External</option>
                                                            <option value="PROGRAMMER">Programmer</option>
                                                            <option value="ADMIN">Admin</option>
                                                        </select>
                                                        {updatingId === user.id && (
                                                            <div className="w-8 h-8 flex items-center justify-center">
                                                                <Loader2 className="animate-spin text-[#D4AF37]" size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default UserManagement
