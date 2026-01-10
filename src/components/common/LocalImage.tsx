/**
 * Componente para mostrar imágenes almacenadas en localStorage (Base64).
 * 
 * Solución alternativa para evitar limitaciones de Firebase Storage en plan gratuito.
 * Carga imágenes desde localStorage con fallback a URL externa o imagen por defecto.
 * 
 * @component
 * @param {LocalImageProps} props - uid: ID único, type: 'photo'|'project', fallback: URL opcional
 * @example
 * <LocalImage uid="user123" type="photo" fallback="/default.jpg" alt="Perfil" />
 */
import { useEffect, useState } from 'react'

interface LocalImageProps {
  uid: string
  type: 'photo' | 'project'
  fallback?: string
  alt?: string
  className?: string
}

const LocalImage = ({ uid, type, fallback, alt = '', className = '' }: LocalImageProps) => {
  const [src, setSrc] = useState(fallback || '')

  useEffect(() => {
    const key = type === 'photo' ? `photo_${uid}` : `project_img_${uid}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setSrc(saved)
    } else if (fallback) {
      setSrc(fallback)
    }
  }, [uid, type, fallback])

  return <img src={src || '/default-avatar.png'} alt={alt} className={className} />
}

export default LocalImage
