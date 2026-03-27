import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconChevronDown } from '../components/deals/icons'
import { CreateDealDrawer } from '../components/deals/CreateDealDrawer'
import { DealsKanbanBoard } from '../components/deals/DealsKanbanBoard'
import {
  DealsToolbar,
  type BoardViewMode,
} from '../components/deals/DealsToolbar'
import { useDeals } from '../hooks/useDeals'
import { subtleTween } from '../lib/motionConfig'
import { stageTitleClassName } from '../lib/stageTitleClass'
import type { DealStageId } from '../types/deal'

const OPEN_DEALS_CAP = 50

export function DealsBoardPage() {
  const { deals, stages } = useDeals()

  const stageLabel = (id: DealStageId) =>
    stages.find((s) => s.id === id)?.label ?? id
  const [createOpen, setCreateOpen] = useState(false)
  const [drawerNonce, setDrawerNonce] = useState(0)
  const [viewMode, setViewMode] = useState<BoardViewMode>('cards')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return deals
    return deals.filter((d) => d.name.toLowerCase().includes(q))
  }, [deals, searchQuery])

  const openCount = deals.length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 pb-4 pt-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 border-b border-transparent">
              <button
                type="button"
                className="border-b-2 border-sky-600 pb-2 text-sm font-semibold text-slate-900"
              >
                All deals
              </button>
              <button
                type="button"
                className="pb-2 text-sm font-medium text-slate-500 hover:text-slate-800"
                aria-label="Add view"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                <span className="font-medium text-slate-800">
                  {openCount}/{OPEN_DEALS_CAP} open deals
                </span>
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="block h-full rounded-full bg-sky-500"
                    style={{
                      width: `${Math.min(100, (openCount / OPEN_DEALS_CAP) * 100)}%`,
                    }}
                  />
                </span>
              </div>
              <div className="relative inline-flex">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerNonce((n) => n + 1)
                    setCreateOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-md cursor-pointer bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Create a deal
                  <IconChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DealsToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        dealCount={filteredDeals.length}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <AnimatePresence mode="wait" initial={false}>
        {viewMode === 'cards' ? (
          <motion.div
            key="cards"
            className="min-h-0 flex-1 overflow-auto bg-slate-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={subtleTween}
          >
            <DealsKanbanBoard filteredDeals={filteredDeals} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="min-h-0 flex-1 overflow-auto bg-white px-6 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={subtleTween}
          >
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Deal name</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Last activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeals.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link
                        to={`/deals/${d.id}`}
                        className="text-sky-700 hover:underline"
                      >
                        {d.name}
                      </Link>
                    </td>
                    <td
                      className={`px-4 py-3 font-medium ${stageTitleClassName(d.stageId)}`}
                    >
                      {stageLabel(d.stageId)}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {(d.amountCents / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{d.lastActivityLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDeals.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                No deals match your search.
              </p>
            )}
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateDealDrawer
        key={drawerNonce}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  )
}
