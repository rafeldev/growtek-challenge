import { formatDateTimeShort } from '../../lib/format'
import { stageTitleClassName } from '../../lib/stageTitleClass'
import type { DealStageHistoryEntry } from '../../types/deal'

export function DealStageHistoryTimeline({
  entries,
}: {
  entries: DealStageHistoryEntry[]
}) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.movedAt).getTime() - new Date(a.movedAt).getTime(),
  )
  if (sorted.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No hay movimientos de etapa registrados todavía.
      </p>
    )
  }
  return (
    <ul className="divide-y divide-slate-100">
      {sorted.map((entry, idx) => (
        <li
          key={`${entry.movedAt}-${entry.stageId}-${idx}`}
          className="py-3 first:pt-0 last:pb-0"
        >
          <p className="text-sm font-medium text-slate-900">
            Etapa:{' '}
            <span className={stageTitleClassName(entry.stageId)}>{entry.label}</span>
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{formatDateTimeShort(entry.movedAt)}</p>
        </li>
      ))}
    </ul>
  )
}
