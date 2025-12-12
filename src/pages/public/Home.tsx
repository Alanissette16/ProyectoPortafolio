/**
 * Home FOREING - Página principal refinada
 * Estilo: Luxury Minimalist, Rose Gold & Gold
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
import { Link } from 'react-router-dom'

// Imágenes del equipo
import fotoClaudia from '../../img/FOTOclau.jpg'
import fotoValeria from '../../img/fotovale.jpg'
// import logoPremium from '../../img/logopremiun.png' // Reservado para uso en Header/Footer

const Home = () => {
  const [currentWord, setCurrentWord] = useState(0)
  const words = ['Creativas', 'Innovadoras', 'Elegantes', 'Únicas', 'Inspiradoras']
  const containerRef = useRef(null)

  // Parallax suave para elementos flotantes
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const yImage1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const yImage2 = useTransform(scrollYProgress, [0, 1], [0, -50])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000) // Aumentado a 3s para mejor lectura
    return () => clearInterval(interval)
  }, [])

  const services = [
    {
      icon: Code2,
      title: 'Desarrollo Web',
      description: 'Creamos sitios web elegantes y funcionales que reflejan la esencia de tu marca.',
      gradient: 'from-[#D4AF37] to-[#B8860B]',
      bgGradient: 'from-[#FFF8E7] to-[#FFF0D4]'
    },
    {
      icon: Palette,
      title: 'Diseño UI/UX',
      description: 'Interfaces intuitivas y estéticamente hermosas que enamoran a tus usuarios.',
      gradient: 'from-[#D4A574] to-[#D4AF37]',
      bgGradient: 'from-[#FFFAF0] to-[#FFF5E6]'
    },
    {
      icon: Smartphone,
      title: 'Apps Móviles',
      description: 'Aplicaciones nativas e híbridas con diseños que destacan en cualquier pantalla.',
      gradient: 'from-[#B8860B] to-[#D4AF37]',
      bgGradient: 'from-[#FFF8E7] to-[#FFFAF5]'
    },
    {
      icon: MessageCircle,
      title: 'Consultoría',
      description: 'Te guiamos en cada paso de tu transformación digital con calidez y experiencia.',
      gradient: 'from-[#D4AF37] to-[#D4A574]',
      bgGradient: 'from-[#FFF5E6] to-[#FFFAF0]'
    }
  ]

  const team = [
    {
      name: 'Claudia',
      role: 'Full Stack Developer',
      image: fotoClaudia,
      description: 'Apasionada por crear soluciones tecnológicas elegantes y eficientes.',
      skills: ['React', 'Node.js', 'Firebase', 'TypeScript'],
      social: { instagram: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Valeria',
      role: 'UI/UX Designer',
      image: fotoValeria,
      description: 'Diseñadora creativa que transforma ideas en experiencias visuales únicas.',
      skills: ['Figma', 'Illustrator', 'Motion', 'Branding'],
      social: { instagram: '#', linkedin: '#', behance: '#' }
    }
  ]

  const stats = [
    { number: '50+', label: 'Proyectos', icon: Gem },
    { number: '30+', label: 'Clientes Felices', icon: Heart },
    { number: '100%', label: 'Dedicación', icon: Star },
    { number: '∞', label: 'Creatividad', icon: Sparkles }
  ]

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">

      
      {/* Texture Overlay - Da un efecto de papel editorial premium */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFE4D6]/30 via-transparent to-[#FFDEE2]/20" />
    

          {/* Golden Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"
              style={{
                left: `${20 + i * 15}%`,
                top: `${15 + (i % 3) * 30}%`,
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-8 bg-white/50 backdrop-blur-md border border-[#D4AF37]/20 shadow-sm"
          >
            <Sparkles className="text-[#D4AF37]" size={14} />
            <span className="text-sm font-medium tracking-wide text-[#8B7355] uppercase">
              Bienvenid@ a FOREING
            </span>
          </motion.div>

          {/* Título principal con Animación de Texto Mejorada */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tight"
          >
            <span className="text-[#3D3D3D]">Soluciones </span>
            <span className="relative inline-block min-w-[300px] sm:min-w-[400px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute left-0 right-0 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#B8860B] bg-clip-text text-transparent pb-2"
                >
                  {words[currentWord]}
                </motion.span>
              </AnimatePresence>
              {/* Espacio invisible para mantener la altura */}
              <span className="invisible">{words[0]}</span>
              
              {/* Línea decorativa */}
              <motion.span
                className="absolute bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                key={`line-${currentWord}`}
                transition={{ duration: 0.8 }}
              />
            </span>
            <br className="hidden md:block" />
            <span className="text-[#3D3D3D]"> para tu </span>
            <span className="font-serif italic text-[#8B7355]">Marca</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 text-[#6D5E47] leading-relaxed font-light"
          >
            Somos un estudio creativo especializado en diseño y desarrollo digital. 
            Transformamos tus ideas en <span className="font-semibold text-[#B8860B]">experiencias memorables</span> con elegancia y pasión.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/proyectos"
              className="group flex items-center gap-3 px-8 py-4 rounded-full text-white font-medium shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
            >
              <Gem size={18} />
              <span>Ver Proyectos</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/agendar-asesoria"
              className="group flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-1 bg-white border border-[#D4AF37]/30 text-[#8B7355] hover:bg-[#FFFBF0]"
            >
              <MessageCircle size={18} />
              <span>Agenda una Cita</span>
            </Link>
          </motion.div>

          {/* Imágenes Flotantes (Solo Desktop) - Con Parallax */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <motion.div 
              style={{ y: yImage1 }}
              className="absolute left-4 top-20"
            >
              <motion.div
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-2xl rotate-6">
                  <img src={fotoClaudia} alt="Claudia" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-lg">
                  <Code2 size={20} className="text-[#D4AF37]" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              style={{ y: yImage2 }}
              className="absolute right-4 bottom-32"
            >
              <motion.div
                animate={{ rotate: [3, -3, 3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="relative"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-2xl -rotate-6">
                  <img src={fotoValeria} alt="Valeria" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg">
                  <Palette size={20} className="text-[#D4AF37]" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
          <span className="text-xs uppercase tracking-widest text-[#8B7355]">Scroll</span>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm border-y border-[#D4AF37]/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#FFF8E7] text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
                  <stat.icon size={28} strokeWidth={1.5} />
                </div>
                <p className="text-4xl md:text-5xl font-display font-bold text-[#3D3D3D] mb-2">
                  {stat.number}
                </p>
                <p className="text-sm uppercase tracking-widest text-[#8B7355]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 relative" id="servicios">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-[#D4AF37]/30 bg-[#FFFBF0]"
            >
              <Wand2 className="text-[#D4AF37]" size={14} />
              <span className="text-xs font-bold tracking-widest text-[#B8860B] uppercase">Nuestros Servicios</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-display font-bold mb-6 text-[#3D3D3D]"
            >
              Lo que <span className="italic text-[#D4AF37] font-serif">Hacemos</span>
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative p-8 rounded-[2rem] bg-white border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 shadow-lg text-white transform group-hover:rotate-6 transition-transform duration-500`}>
                    <service.icon size={24} />
                  </div>
                  
                  <h3 className="text-xl font-display font-bold mb-3 text-[#3D3D3D]">
                    {service.title}
                  </h3>
                  
                  <p className="text-[#6D5E47] text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <Link 
                    to="/agendar-asesoria" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8860B] group/link"
                  >
                    Saber más
                    <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#FFFBF8] to-[#FFF5F0]" id="sobre-nosotras">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-[#D4AF37]/30 bg-white"
            >
              <Crown className="text-[#D4AF37]" size={14} />
              <span className="text-xs font-bold tracking-widest text-[#B8860B] uppercase">Nuestro Equipo</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-[#3D3D3D]">
              Las <span className="text-[#D4AF37] font-serif italic">Creadoras</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden p-3 shadow-xl shadow-[#D4AF37]/5 hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-500 border border-white">
                  <div className="relative h-96 rounded-[2rem] overflow-hidden bg-[#F5F5F5]">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <Flower2 size={14} />
                        {member.role}
                      </div>
                      <h3 className="text-3xl font-display font-bold">{member.name}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[#6D5E47] mb-6 leading-relaxed">
                      {member.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="px-3 py-1 text-xs font-medium text-[#8B7355] bg-[#FFF8E7] rounded-full border border-[#D4AF37]/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <Link 
              to="/programadores"
              className="inline-flex items-center gap-2 text-[#B8860B] font-medium hover:text-[#D4AF37] transition-colors border-b border-[#B8860B]/30 hover:border-[#D4AF37] pb-1"
            >
              Conocer al equipo completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 pb-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C49B30] via-[#B8860B] to-[#8B7355]" />
            
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />

            <div className="relative p-12 sm:p-20 text-center text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-8 p-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
              >
                <Crown size={32} className="text-white" />
              </motion.div>
              
              <h2 className="text-4xl sm:text-6xl font-display font-bold mb-6">
                ¿Lista para comenzar?
              </h2>
              
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12 font-light">
                Agenda una consulta gratuita y descubre cómo podemos hacer realidad tu visión digital con elegancia.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                
                
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home