/**
 * Logo FOREING - Premium, elegante y sofisticado
 * Diseño dorado que no se ve afectado por los temas
 * Nota: El login secreto ahora está en el Footer (corazón)
 */
import { memo } from 'react'
import logoPremium from '../img/logopremiun.png'

interface LogoProps {
  className?: string
  size?: number
}

const Logo = ({ className = '', size = 40 }: LogoProps) => {
  return (
    <div 
      className={`relative group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow effect premium dorado */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-70 blur-md transition-all duration-500"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4BA, #D4AF37)' }}
      />
      
      {/* Anillo exterior premium */}
      <div 
        className="absolute inset-0 rounded-full p-[2px]"
        style={{ background: 'linear-gradient(135deg, #B8860B, #D4AF37, #F4E4BA, #D4AF37, #B8860B)' }}
      >
        <div className="w-full h-full rounded-full" style={{ background: '#1a1a1a' }} />
      </div>
      
      {/* Anillo interior dorado */}
      <div 
        className="absolute inset-[3px] rounded-full p-[1px]"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4BA, #D4AF37)' }}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          {/* Image */}
          <img
            src={logoPremium}
            alt="FOREING Logo"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>
      
      {/* Corona premium */}
      <div 
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4BA)' }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#8B4513" stroke="#8B4513" strokeWidth="1"/>
        </svg>
      </div>
      
      {/* Brillo sutil */}
      <div 
        className="absolute top-1 left-1/4 w-1/3 h-1/4 rounded-full opacity-30"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)' }}
      />
    </div>
  )
}

export default memo(Logo)
