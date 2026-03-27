import type { ReactNode } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children?: ReactNode
  okLabel?: string
  titleId?: string
}

/** Modal informativo con una sola acción (OK). */
export function AlertDialog({
  open,
  onClose,
  title,
  description,
  children,
  okLabel = 'OK',
  titleId = 'alert-dialog-title',
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {description ? (
          <div className="mt-2 text-sm text-slate-600">{description}</div>
        ) : null}
        {children}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
