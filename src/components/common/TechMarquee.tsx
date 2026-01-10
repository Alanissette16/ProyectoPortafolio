import { motion } from 'framer-motion'
import {
    Code2,
    Cpu,
    Database,
    Globe,
    Layout,
    Smartphone,
    Server,
    Cloud,
    Terminal,
    Wifi
} from 'lucide-react'

const technologies = [
    { name: 'React', icon: Code2 },
    { name: 'TypeScript', icon: Terminal },
    { name: 'Node.js', icon: Server },
    { name: 'Tailwind CSS', icon: Layout },
    { name: 'Firebase', icon: Database },
    { name: 'Next.js', icon: Globe },
    { name: 'React Native', icon: Smartphone },
    { name: 'Framer Motion', icon: Wifi },
    { name: 'AWS', icon: Cloud },
    { name: 'Python', icon: Cpu },
]

/**
 * Componente TechMarquee
 * ----------------------
 * Muestra un carrusel infinito de tecnologías que se desplaza horizontalmente.
 * Utiliza Framer Motion para una animación fluida y eficiente.
 */
const TechMarquee = () => {
    return (
        <div className="relative flex overflow-hidden py-10 bg-base-100/50 backdrop-blur-sm border-y border-primary/5">
            {/* 
              Efecto de desvanecimiento en los bordes (Fade in/out)
              Crea una transición suave para que los elementos no aparezcan/desaparezcan bruscamente.
            */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-base-100 via-transparent to-base-100" />

            {/* 
              Contenedor Animado
              - Animate: Mueve el contenido desde x:0 hasta x:-1035px (ajustar según el ancho del contenido)
              - Transition: Repite infinitamente (loop), duración 30s, movimiento lineal (sin aceleración)
              - will-change-transform: Optimización para forzar aceleración por GPU y lograr 60fps
            */}
            <motion.div
                className="flex gap-12 sm:gap-20 items-center whitespace-nowrap will-change-transform"
                animate={{ x: [0, -1035] }}
                transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear",
                }}
            >
                {/* 
                  Renderizado Triple
                  Renderizamos la lista 3 veces para asegurar que el contenido cubra toda la pantalla
                  y el loop sea imperceptible (sin espacios vacíos).
                */}
                {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                    <div
                        key={`${tech.name}-${index}`}
                        className="flex items-center gap-3 text-base-content/40 hover:text-primary transition-colors duration-300 group cursor-default"
                    >
                        <tech.icon size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-lg sm:text-xl font-display font-semibold tracking-wide">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export default TechMarquee
