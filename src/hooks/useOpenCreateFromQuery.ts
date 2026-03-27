import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Si la URL tiene `?create=1`, ejecuta `onOpenCreate` una vez y quita el query param.
 */
export function useOpenCreateFromQuery(onOpenCreate: () => void) {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('create') !== '1') return
    const t = window.setTimeout(() => {
      onOpenCreate()
      const next = new URLSearchParams(searchParams)
      next.delete('create')
      setSearchParams(next, { replace: true })
    }, 0)
    return () => window.clearTimeout(t)
  }, [searchParams, setSearchParams, onOpenCreate])
}
