/**
 * Home FOREING - Página principal refinada
 * Estilo: Luxury Minimalist, Rose Gold & Gold
 * Rediseño Premium: Hero Asimétrico, Glassmorphism, Blobs Animados
 */

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ChevronRight,
  Code2,
  Crown,
  Flower2,
  Gem,
  Heart,
  MessageCircle,
  Palette,
  Smartphone,
  Sparkles,
  Star,
  Wand2
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import TechMarquee from '../../components/common/TechMarquee'

// Imágenes del equipo
import fotoClaudia from '../../assets/images/team/claudia.jpg'
import fotoValeria from '../../assets/images/team/valeria.jpg'

const Home = () => {
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  const canRequestAdvisory = !isAuthenticated || (role !== 'admin' && role !== 'programmer')

  const [currentWord, setCurrentWord] = useState(0)
  const words = ['Creativas', 'Innovadoras', 'Elegantes', 'Únicas', 'Inspiradoras']
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Parallax para blobs
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0, -200])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const services = [
    {
      icon: Code2,
      title: 'Desarrollo Web',
      description: 'Creamos sitios web elegantes y funcionales que reflejan la esencia de tu marca.',
      gradient: 'from-primary to-primary-focus',
      bgGradient: 'from-base-200 to-base-100'
    },
    {
      icon: Palette,
      title: 'Diseño UI/UX',
      description: 'Interfaces intuitivas y estéticamente hermosas que enamoran a tus usuarios.',
      gradient: 'from-secondary to-accent',
      bgGradient: 'from-base-200 to-base-100'
    },
    {
      icon: Smartphone,
      title: 'Apps Móviles',
      description: 'Aplicaciones nativas e híbridas con diseños que destacan en cualquier pantalla.',
      gradient: 'from-accent to-secondary',
      bgGradient: 'from-base-200 to-base-100'
    },
    {
      icon: MessageCircle,
      title: 'Consultoría',
      description: 'Te guiamos en cada paso de tu transformación digital con calidez y experiencia.',
      gradient: 'from-primary to-secondary',
      bgGradient: 'from-base-200 to-base-100'
    }
  ]

  const team = [
    {
      name: 'Claudia',
      role: 'Full Stack Developer',
      image: fotoClaudia,
      description: 'Apasionada por crear soluciones tecnológicas elegantes y eficientes.',
      skills: ['React', 'Node.js', 'Firebase', 'TypeScript'],
    },
    {
      name: 'Valeria',
      role: 'UI/UX Designer',
      image: fotoValeria,
      description: 'Diseñadora creativa que transforma ideas en experiencias visuales únicas.',
      skills: ['Figma', 'Illustrator', 'Motion', 'Branding'],
    }
  ]

  const stats = [
    { number: '50+', label: 'Proyectos', icon: Gem },
    { number: '30+', label: 'Clientes Felices', icon: Heart },
    { number: '100%', label: 'Dedicación', icon: Star },
    { number: '∞', label: 'Creatividad', icon: Sparkles }
  ]

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-base-100 selection:bg-primary/20 selection:text-primary">

      {/* Background Blobs Animados - Optimizado */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          style={{ y: yBlob1 }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply will-change-transform"
        />
        <motion.div
          style={{ y: yBlob2 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] mix-blend-multiply will-change-transform"
        />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] mix-blend-multiply" />

        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Hero Section Moderno Asimétrico */}
      <section className="relative min-h-[95vh] flex items-center pt-24 pb-12 px-4 z-10">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">

          {/* Columna Izquierda: Texto */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/50 backdrop-blur-md border border-primary/20 shadow-sm"
            >
              <Sparkles className="text-primary" size={14} />
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                Creative Tech Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-8 leading-[1.05] tracking-tight text-base-content"
            >
              Creamos <br />
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Experiencias
                </span>
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                  className="absolute -bottom-2 left-0 w-full h-[0.4em] text-primary/20 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                </motion.svg>
              </span>
              <br />
              <div className="flex flex-col sm:flex-row items-center lg:items-end gap-4 mt-2">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-base-content/60 font-medium">Digitales</span>
                <div className="h-[1px] flex-grow bg-base-content/10 w-24 hidden sm:block mb-4" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-secondary will-change-transform"
                  >
                    {words[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light"
            >
              Transformamos la visión de tu marca en una realidad digital impactante.
              Diseño, desarrollo y estrategia unidos por la elegancia y la innovación.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/proyectos"
                className="btn btn-primary btn-lg rounded-full px-8 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 border-none bg-gradient-to-r from-primary to-secondary text-white group"
              >
                <Gem size={18} />
                <span>Ver Portafolio</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {canRequestAdvisory && (
                <Link
                  to="/agendar-asesoria"
                  className="btn btn-ghost btn-lg rounded-full px-8 hover:bg-base-200/50 group"
                >
                  <span className="text-base-content/80 group-hover:text-primary transition-colors">Agendar Cita</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                  </div>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Columna Derecha: Composición Artística */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full aspect-square max-w-[500px] mx-auto will-change-transform"
            >
              {/* Círculo Principal Abstracto */}
              <div className="absolute inset-4 rounded-full border border-primary/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-secondary/20 animate-[spin_40s_linear_infinite_reverse]" />

              {/* Fotos Flotantes en Composición Asimétrica */}
              <motion.div
                className="absolute top-0 right-10 w-48 h-64 rounded-t-[100px] rounded-b-[40px] overflow-hidden border-4 border-white shadow-2xl z-20 will-change-transform"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={fotoClaudia} alt="Claudia" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                  <span className="text-white text-sm font-medium">Full Stack Dev</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 left-0 w-40 h-56 rounded-t-[40px] rounded-b-[100px] overflow-hidden border-4 border-white shadow-2xl z-10 will-change-transform"
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={fotoValeria} alt="Valeria" className="w-full h-full object-cover" />
                <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent flex items-start justify-center pt-4">
                  <span className="text-white text-sm font-medium">UI/UX Designer</span>
                </div>
              </motion.div>

              {/* Elementos Decorativos Flotantes */}
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full opacity-20 blur-2xl -z-10 will-change-transform"
              />

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 left-10 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/40 will-change-transform"
              >
                <Code2 className="text-[#D4AF37]" size={24} />
              </motion.div>

              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/40 will-change-transform"
              >
                <Palette className="text-[#D4AF37]" size={24} />
              </motion.div>

            </motion.div>
          </div>

        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 will-change-transform"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60">Scroll</span>
        </motion.div>
      </section>

      {/* Tech Marquee Component */}
      <TechMarquee />

      {/* Servicios Premium con Glassmorphism */}
      <section className="py-32 px-4 relative z-10" id="servicios">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-primary/30 bg-primary/5"
            >
              <Wand2 className="text-primary" size={14} />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Nuestros Servicios</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-base-content"
            >
              Excelencia en cada <br />
              <span className="italic text-primary font-serif">Pixel & Código</span>
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-black/5 group-hover:ring-primary/20 transition-all duration-500" />

                {/* Glow Effect */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100 will-change-transform" />

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} mb-8 shadow-lg shadow-primary/20 text-white transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 will-change-transform`}>
                    <service.icon size={28} />
                  </div>

                  <h3 className="text-2xl font-display font-bold mb-4 text-base-content group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-base-content/70 leading-relaxed mb-8 font-light">
                    {service.description}
                  </p>

                  <div className="w-8 h-[2px] bg-primary/20 group-hover:w-full group-hover:bg-primary transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Moderno */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 p-12 rounded-[3rem] bg-base-100/50 backdrop-blur-sm border border-white/20 shadow-2xl">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative group"
              >
                <div className="mb-4 inline-flex p-3 rounded-2xl bg-base-200/50 text-base-content/40 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <stat.icon size={24} />
                </div>
                <p className="text-4xl lg:text-5xl font-display font-bold text-base-content mb-2 bg-gradient-to-br from-base-content to-base-content/70 bg-clip-text">
                  {stat.number}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-base-content/50 font-bold group-hover:text-primary transition-colors">{stat.label}</p>

                {/* Separator for desktop except last */}
                {index !== stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-base-content/10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview Minimalista */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-base-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-primary/30 bg-white/50">
                <Crown className="text-primary" size={14} />
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Talento Excepcional</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-base-content">
                Mentes Detrás del <br />
                <span className="text-primary italic font-serif">Arte Digital</span>
              </h2>
            </div>

            <Link
              to="/programadores"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 group"
            >
              <span>Conocer a todo el equipo</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative h-[400px] rounded-[3rem] overflow-hidden cursor-pointer"
              >
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <p className="text-primary font-medium mb-1 flex items-center gap-2">
                    <Flower2 size={16} /> {member.role}
                  </p>
                  <h3 className="text-4xl font-display font-bold text-white mb-4">{member.name}</h3>
                  <p className="text-white/80 line-clamp-2 mb-6 font-light">{member.description}</p>

                  <div className="flex gap-2">
                    {member.skills.map(s => (
                      <span key={s} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white border border-white/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Premium */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-10 rounded-[3rem] blur-3xl opacity-50 will-change-transform" />

          <div className="relative bg-white/30 backdrop-blur-xl border border-white/40 p-12 sm:p-20 rounded-[3rem] text-center shadow-2xl overflow-hidden">

            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <Crown size={40} className="mx-auto text-primary mb-6" />

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-base-content">
              ¿Listo para elevar <br className="hidden sm:block" /> tu marca?
            </h2>

            <p className="text-xl text-base-content/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Agenda una sesión estratégica con nosotras. Sin compromisos, solo visión y posibilidades infinitas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/proyectos"
                className="btn btn-primary btn-lg rounded-full px-10 shadow-xl shadow-primary/30 border-none bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 transition-transform"
              >
                <Sparkles size={20} />
                Ver Portafolio
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
