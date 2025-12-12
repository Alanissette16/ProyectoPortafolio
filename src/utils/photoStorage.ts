/**
 * Utilidad para manejar fotos guardadas en localStorage
 */

// Función helper para obtener foto (de localStorage o URL directa)
export const getPhotoURL = (photoURL: string | undefined | null): string => {
  if (!photoURL) return '/default-avatar.svg'
  if (photoURL.startsWith('local:')) {
    const key = `photo_${photoURL.replace('local:', '')}`
    return localStorage.getItem(key) || '/default-avatar.svg'
  }
  return photoURL
}

// Función para comprimir imagen y convertir a base64
export const compressImage = (
  file: File, 
  maxSize: number = 200, 
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Redimensionar manteniendo proporción
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convertir a base64 con compresión
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Guardar foto en localStorage
export const savePhotoToLocal = async (
  uid: string, 
  file: File
): Promise<string> => {
  const compressedBase64 = await compressImage(file, 200, 0.7)
  localStorage.setItem(`photo_${uid}`, compressedBase64)
  return `local:${uid}`
}

// Eliminar foto de localStorage
export const deletePhotoFromLocal = (uid: string): void => {
  localStorage.removeItem(`photo_${uid}`)
}
