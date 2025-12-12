/**
 * Contexto de tema FOREING - Temas femeninos y elegantes
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

type Theme = 'rosegold' | 'lavender' | 'rosepink'

const validThemes: Theme[] = ['rosegold', 'lavender', 'rosepink']

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  changeTheme: (newTheme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const DEFAULT_THEME: Theme = 'rosegold'

// Función para obtener un tema válido del localStorage
const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem('theme')
  if (stored && validThemes.includes(stored as Theme)) {
    return stored as Theme
  }
  // Si el tema guardado no es válido, limpiar y usar default
  localStorage.removeItem('theme')
  return DEFAULT_THEME
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'rosegold' ? 'lavender' : prev === 'lavender' ? 'rosepink' : 'rosegold'))

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return ctx
}
