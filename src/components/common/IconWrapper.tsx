/**
 * IconWrapper - Componente reutilizable para iconos con animaciones consistentes
 * Proporciona efectos hover, tamaños estandarizados y estilos temáticos
 */

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { ReactElement } from 'react'

interface IconWrapperProps {
    icon: LucideIcon
    size?: number
    className?: string
    variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted'
    animate?: boolean
    hoverEffect?: 'scale' | 'rotate' | 'glow' | 'none'
    ariaLabel?: string
}

const IconWrapper = ({
    icon: Icon,
    size = 20,
    className = '',
    variant = 'default',
    animate = true,
    hoverEffect = 'scale',
    ariaLabel,
}: IconWrapperProps): ReactElement => {
    const variantClasses = {
        default: 'text-current',
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        muted: 'text-base-content/60',
    }

    const hoverClasses = {
        scale: 'icon-hover',
        rotate: 'icon-hover-rotate',
        glow: 'icon-glow',
        none: '',
    }

    const baseClasses = `inline-flex items-center justify-center ${variantClasses[variant]} ${hoverClasses[hoverEffect]} ${className}`

    if (animate) {
        return (
            <motion.span
                className={baseClasses}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                aria-label={ariaLabel}
            >
                <Icon size={size} />
            </motion.span>
        )
    }

    return (
        <span className={baseClasses} aria-label={ariaLabel}>
            <Icon size={size} />
        </span>
    )
}

export default IconWrapper
