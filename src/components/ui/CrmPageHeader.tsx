import type { ReactNode } from 'react'

type Props = {
  title: string
  /** Botones u otras acciones a la derecha del título. */
  actions?: ReactNode
  /** Segunda fila (pestañas “All contacts”, etc.). */
  children?: ReactNode
}

export function CrmPageHeader({ title, actions, children }: Props) {
  return (
    <div className="shrink-0 border-b border-slate-200 px-6 pb-4 pt-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}
