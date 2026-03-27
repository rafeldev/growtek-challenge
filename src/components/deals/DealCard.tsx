import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Deal } from '../../types/deal'
import { formatUsd } from '../../lib/format'
import { subtleTween } from '../../lib/motionConfig'

interface DealCardProps {
  deal: Deal
}

export function DealCard({ deal }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
      data: { type: 'deal', deal },
    })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: isDragging ? 0 : 1, y: 0 }}
      transition={subtleTween}
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${
        isDragging ? 'pointer-events-none' : ''
      }`}
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab touch-none active:cursor-grabbing"
      >
        <Link
          to={`/deals/${deal.id}`}
          className="block p-4 font-semibold text-slate-900 hover:text-sky-700"
        >
          {deal.name}
        </Link>
        <div className="px-4 pb-1 text-sm text-slate-800">
          {formatUsd(deal.amountCents)}
        </div>
        <p className="px-4 pb-3 text-xs text-slate-500">
          Last activity: {deal.lastActivityLabel}
        </p>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 text-center">
        <button
          type="button"
          className="text-sm font-medium text-sky-600 hover:text-sky-800"
        >
          Choose action
        </button>
      </div>
    </motion.div>
  )
}
