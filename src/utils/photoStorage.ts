//utilidades para manejar fotos guardadas en localStorage

//obtener URL de foto (desde localStorage o URL directa)
export const getPhotoURL = (photoURL: string | undefined | null): string => {
  if (!photoURL) return '/default-avatar.svg'
  //si la foto está en localStorage (prefijo 'local:')
  if (photoURL.startsWith('local:')) {
    const key = `photo_${photoURL.replace('local:', '')}`
    return localStorage.getItem(key) || '/default-avatar.svg'
  }
  //retornar URL directa
  return photoURL
}

//comprimir imagen y convertir a base64
export const compressImage = (
  file: File,
  maxSize: number = 200, //tamaño máximo en píxeles
  quality: number = 0.7 //calidad de compresión (0-1)
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        //redimensionar manteniendo la proporción de aspecto
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

        //dibujar imagen redimensionada en el canvas
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        //convertir canvas a base64 con compresión JPEG
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

//guardar foto comprimida en localStorage
export const savePhotoToLocal = async (
  uid: string, //ID del usuario
  file: File //archivo de imagen
): Promise<string> => {
  //comprimir imagen antes de guardar
  const compressedBase64 = await compressImage(file, 200, 0.7)
  localStorage.setItem(`photo_${uid}`, compressedBase64)
  //retornar referencia local
  return `local:${uid}`
}

//eliminar foto de localStorage
export const deletePhotoFromLocal = (uid: string): void => {
  localStorage.removeItem(`photo_${uid}`)
}
