import type { ReactNode } from 'react'

type Props = {
  left?: ReactNode
  right?: ReactNode
}

/** Barra sobre la tabla: filtros a la izquierda, búsqueda/columnas a la derecha. */
export function TableToolbarRow({ left, right }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex flex-wrap items-center gap-2">{left}</div>
      <div className="flex flex-wrap items-center gap-2">{right}</div>
    </div>
  )
}
