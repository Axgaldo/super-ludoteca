import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

/**
 * useState persistido en localStorage (claves con prefijo `sl:`).
 * Si localStorage no está disponible o el JSON está corrupto, cae al valor inicial.
 */
export function useLocalStorage<T>(key: string, initial: T): readonly [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* almacenamiento lleno o no disponible: se ignora */
    }
  }, [key, value])

  return [value, setValue] as const
}
