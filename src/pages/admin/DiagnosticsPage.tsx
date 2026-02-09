import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import {
    Download, Filter, Calendar, Users, Briefcase,
    CheckCircle, Clock, AlertCircle, FileText, ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { listAllAdvisories, listAllProjects, listProgrammers } from '../../services/data.service'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extend jsPDF for autotable
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

const COLORS = ['#D4AF37', '#8B7355', '#5D4E37', '#B8860B', '#F5DEB3', '#DAA520']

const DiagnosticsPage = () => {
    const [advisories, setAdvisories] = useState<any[]>([])
    const [projects, setProjects] = useState<any[]>([])
    const [programmers, setProgrammers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const [advData, projData, progData] = await Promise.all([
                    listAllAdvisories(),
                    listAllProjects(),
                    listProgrammers()
                ])
                setAdvisories(advData)
                setProjects(projData)
                setProgrammers(progData)
            } catch (error) {
                console.error('Error loading diagnostic data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    // Process data for charts
    const advisoriesPerProgrammer = programmers.map(p => ({
        name: p.displayName,
        cantidad: advisories.filter(a => a.programadorId === p.id || a.programador?.id === p.id).length
    })).filter(item => item.cantidad > 0)

    const advisoriesByStatus = [
        { name: 'Pendientes', value: advisories.filter(a => a.estado === 'PENDIENTE').length },
        { name: 'Confirmadas', value: advisories.filter(a => a.estado === 'CONFIRMADA').length },
        { name: 'Completadas', value: advisories.filter(a => a.estado === 'COMPLETADA').length },
        { name: 'Canceladas', value: advisories.filter(a => a.estado === 'CANCELADA').length },
        { name: 'Rechazadas', value: advisories.filter(a => a.estado === 'RECHAZADA').length },
    ].filter(item => item.value > 0)

    const projectsPerUser = Array.from(new Set(projects.map(p => p.programadorNombre || 'Desconocido'))).map(name => ({
        name,
        proyectos: projects.filter(p => (p.programadorNombre || 'Desconocido') === name).length
    }))

    const generatePDF = () => {
        const doc = new jsPDF() as jsPDFWithAutoTable

        // Header
        doc.setFontSize(22)
        doc.setTextColor(212, 175, 55) // Gold
        doc.text('Reporte de Diagnóstico y Gestión', 20, 20)

        doc.setFontSize(12)
        doc.setTextColor(100)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30)

        // Stats Summary
        doc.setFontSize(14)
        doc.setTextColor(93, 78, 55)
        doc.text('Resumen General:', 20, 45)
        doc.setFontSize(10)
        doc.text(`Total Asesorías: ${advisories.length}`, 25, 55)
        doc.text(`Total Proyectos: ${projects.length}`, 25, 62)
        doc.text(`Total Programadores: ${programmers.length}`, 25, 69)

        // Table: Advisories
        doc.setFontSize(14)
        doc.text('Detalle de Asesorías:', 20, 85)

        const advisoryRows = advisories.map(a => [
            a.id,
            a.programador?.displayName || a.programadorNombre || 'N/A',
            a.usuarioExterno?.displayName || a.usuarioNombre || 'N/A',
            new Date(a.fecha).toLocaleDateString(),
            a.estado
        ])

        autoTable(doc, {
            startY: 90,
            head: [['ID', 'Programador', 'Usuario', 'Fecha', 'Estado']],
            body: advisoryRows,
            headStyles: { fillColor: [212, 175, 55] },
            alternateRowStyles: { fillColor: [250, 248, 240] }
        })

        // Table: Projects
        const finalY = (doc as any).lastAutoTable.finalY || 150
        doc.setFontSize(14)
        doc.text('Detalle de Proyectos:', 20, finalY + 15)

        const projectRows = projects.map(p => [
            p.id,
            p.title,
            p.programadorNombre || 'N/A',
            p.category,
            p.technologies?.join(', ') || ''
        ])

        autoTable(doc, {
            startY: finalY + 20,
            head: [['ID', 'Título', 'Dueño', 'Categoría', 'Tecnologías']],
            body: projectRows,
            headStyles: { fillColor: [139, 115, 85] },
            alternateRowStyles: { fillColor: [250, 248, 240] }
        })

        doc.save('reporte-diagnostico.pdf')
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
                                Panel de Diagnóstico
                            </h1>
                            <p className="text-[#8B7355] text-sm mt-1">
                                Análisis de desempeño y reportes del sistema
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={generatePDF}
                        className="px-5 py-2.5 bg-[#D4AF37] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#B5952F] shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:-translate-y-0.5"
                    >
                        <Download size={18} /> Exportar Reporte PDF
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Asesorías"
                        value={advisories.length}
                        icon={<Clock className="text-white" />}
                        color="linear-gradient(135deg, #D4AF37, #B8860B)"
                    />
                    <StatCard
                        title="Proyectos Activos"
                        value={projects.length}
                        icon={<Briefcase className="text-white" />}
                        color="linear-gradient(135deg, #B8860B, #8B7355)"
                    />
                    <StatCard
                        title="Programadores"
                        value={programmers.length}
                        icon={<Users className="text-white" />}
                        color="linear-gradient(135deg, #8B7355, #5D4E37)"
                    />
                    <StatCard
                        title="Tasa de Éxito"
                        value="94%"
                        icon={<CheckCircle className="text-white" />}
                        color="linear-gradient(135deg, #5D4E37, #2D2417)"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Chart 1: Asesorías por Programador */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-3xl shadow-xl border border-[#D4AF37]/10"
                    >
                        <h3 className="text-lg font-bold text-[#5D4E37] mb-6 flex items-center gap-2">
                            <Users size={20} className="text-[#D4AF37]" /> Asesorías por Programador
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={advisoriesPerProgrammer}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" fontSize={12} tick={{ fill: '#8B7355' }} axisLine={false} tickLine={false} />
                                    <YAxis fontSize={12} tick={{ fill: '#8B7355' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="cantidad" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Chart 2: Estados de Asesoría */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 20 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-xl border border-[#D4AF37]/10"
                    >
                        <h3 className="text-lg font-bold text-[#5D4E37] mb-6 flex items-center gap-2">
                            <AlertCircle size={20} className="text-[#D4AF37]" /> Estados de Asesoría
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={advisoriesByStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {advisoriesByStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Chart 3: Proyectos por Usuario */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-3xl shadow-xl border border-[#D4AF37]/10 lg:col-span-2"
                    >
                        <h3 className="text-lg font-bold text-[#5D4E37] mb-6 flex items-center gap-2">
                            <Briefcase size={20} className="text-[#D4AF37]" /> Proyectos por Usuario
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectsPerUser} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                    <XAxis type="number" fontSize={12} tick={{ fill: '#8B7355' }} axisLine={false} tickLine={false} />
                                    <YAxis dataKey="name" type="category" width={100} fontSize={12} tick={{ fill: '#8B7355' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="proyectos" fill="#8B7355" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Detailed History Table */}
                <div className="bg-white rounded-3xl shadow-xl border border-[#D4AF37]/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-gradient-to-r from-white to-[#FFF8E7] flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#5D4E37] flex items-center gap-2">
                            <FileText size={20} className="text-[#D4AF37]" /> Historial Detallado
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-[#8B7355] uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#8B7355] uppercase tracking-wider">Programador</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#8B7355] uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#8B7355] uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#8B7355] uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {advisories.map((adv) => (
                                    <tr key={adv.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-400">#{adv.id}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#5D4E37]">{adv.programadorNombre || adv.programador?.displayName || '---'}</td>
                                        <td className="px-6 py-4 text-sm text-[#8B7355]">{adv.usuarioNombre || adv.usuarioExterno?.displayName || '---'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(adv.fecha).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${adv.estado === 'COMPLETADA' ? 'bg-emerald-50 text-emerald-600' :
                                                adv.estado === 'CONFIRMADA' ? 'bg-blue-50 text-blue-600' :
                                                    adv.estado === 'RECHAZADA' ? 'bg-red-50 text-red-600' :
                                                        'bg-amber-50 text-amber-600'
                                                }`}>
                                                {adv.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

const StatCard = ({ title, value, icon, color }: { title: string, value: any, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4AF37]/10 flex items-center gap-4">
        <div className="p-3 rounded-2xl shadow-lg" style={{ background: color }}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider">{title}</p>
            <h4 className="text-2xl font-bold text-[#5D4E37]">{value}</h4>
        </div>
    </div>
)

export default DiagnosticsPage
