import { useDroppable } from '@dnd-kit/core'
import type { Deal, DealStageId } from '../../types/deal'
import { formatUsd } from '../../lib/format'
import { stageTitleClassName } from '../../lib/stageTitleClass'
import { DealCard } from './DealCard'

interface DealColumnProps {
  stageId: DealStageId
  label: string
  deals: Deal[]
}

export function DealColumn({ stageId, label, deals }: DealColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage:${stageId}`,
  })

  const totalCents = deals.reduce((sum, d) => sum + d.amountCents, 0)

  return (
    <div className="flex min-h-0 min-w-[272px] max-w-[300px] shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50/80">
      <div className="shrink-0 border-b border-slate-200 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-sm font-semibold ${stageTitleClassName(stageId)}`}
          >
            {label}
          </h3>
          <span className="text-xs font-medium text-slate-500">{deals.length}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Total amount</p>
        <p className="text-sm font-medium text-slate-800">{formatUsd(totalCents)}</p>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-1 flex-col gap-2 overflow-y-auto p-2 ${
          isOver ? 'bg-sky-50/50 ring-2 ring-inset ring-sky-200' : ''
        }`}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
