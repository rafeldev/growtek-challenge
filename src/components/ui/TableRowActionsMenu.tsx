import { useEffect, useRef, useState } from 'react'
import { IconMore } from '../deals/icons'

type Props = {
  /** Se ejecuta al elegir Delete (el menú ya se cerró). */
  onDelete: () => void
  deleteLabel?: string
  /** Clases del contenedor interno (por si la celda usa px-4 vs px-6). */
  className?: string
}

/**
 * Botón ⋮ + menú flotante con acciones de fila (mismo patrón que Lists).
 */
export function TableRowActionsMenu({
  onDelete,
  deleteLabel = 'Delete',
  className = '',
}: Props) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (wrapRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function handleDeleteClick() {
    setOpen(false)
    onDelete()
  }

  return (
    <div
      ref={wrapRef}
      className={`relative inline-flex items-center justify-end ${className}`.trim()}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex cursor-pointer rounded p-1.5 text-slate-600 hover:bg-slate-200/80"
        aria-label="Open actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <IconMore className="h-5 w-5" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
            onClick={handleDeleteClick}
          >
            {deleteLabel}
          </button>
        </div>
      ) : null}
    </div>
  )
}
