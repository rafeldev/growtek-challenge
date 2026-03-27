import { motion } from 'motion/react'
import type { Deal } from '../../types/deal'
import { formatUsd } from '../../lib/format'
import { subtleTween } from '../../lib/motionConfig'

export function DealCardPreview({ deal }: { deal: Deal }) {
  return (
    <motion.div
      className="w-[280px] cursor-grabbing rounded-lg border border-slate-200 bg-white shadow-lg"
      initial={{ scale: 0.98, opacity: 0.92 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={subtleTween}
    >
      <div className="p-4 font-semibold text-slate-900">{deal.name}</div>
      <div className="px-4 pb-1 text-sm text-slate-800">
        {formatUsd(deal.amountCents)}
      </div>
      <p className="px-4 pb-3 text-xs text-slate-500">
        Last activity: {deal.lastActivityLabel}
      </p>
      <div className="border-t border-slate-100 px-4 py-2 text-center text-sm font-medium text-sky-600">
        Choose action
      </div>
    </motion.div>
  )
}
