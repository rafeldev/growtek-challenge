import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  IconArrowLeft,
  IconChevronDown,
  IconDollar,
  IconMail,
  IconMore,
  IconNote,
  IconPlant,
  IconSettings,
  IconTask,
} from '../components/deals/icons'
import { DealStageHistoryTimeline } from '../components/deals/DealStageHistoryTimeline'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useDeals } from '../hooks/useDeals'
import { contactDisplayName } from '../lib/contactDisplay'
import { formatDateIso, formatUsd } from '../lib/format'
import { stageTitleClassName } from '../lib/stageTitleClass'
import { useCompaniesStore } from '../stores/companiesStore'
import { useContactsStore } from '../stores/contactsStore'
import type { DealStageId } from '../types/deal'

export function DealDetailPage() {
  const { dealId } = useParams<{ dealId: string }>()
  const navigate = useNavigate()
  const { getDeal, stages, updateDeal, removeDeal } = useDeals()
  const deal = dealId ? getDeal(dealId) : undefined
  const [tab, setTab] = useState<'overview' | 'history'>('overview')
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const confirmCancelRef = useRef<HTMLButtonElement>(null)
  const contacts = useContactsStore((s) => s.contacts)
  const companies = useCompaniesStore((s) => s.companies)

  useEffect(() => {
    if (!moreMenuOpen) return
    function handlePointerDown(e: PointerEvent) {
      const t = e.target as Node
      if (moreMenuRef.current?.contains(t)) return
      setMoreMenuOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [moreMenuOpen])

  useEffect(() => {
    if (!confirmDeleteOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setConfirmDeleteOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [confirmDeleteOpen])

  useEffect(() => {
    if (!confirmDeleteOpen) return
    confirmCancelRef.current?.focus()
  }, [confirmDeleteOpen])

  const stageIndex = useMemo(() => {
    if (!deal) return 0
    return stages.findIndex((s) => s.id === deal.stageId)
  }, [deal, stages])

  const stageLabel = deal
    ? stages.find((s) => s.id === deal.stageId)?.label ?? deal.stageId
    : ''

  const progressTotal = stages.length

  if (!deal) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-slate-600">Deal not found.</p>
        <Link to="/deals" className="text-sky-700 hover:underline">
          Back to deals
        </Link>
      </div>
    )
  }

  const currentDeal = deal

  function handleStageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateDeal(currentDeal.id, { stageId: e.target.value as DealStageId })
  }

  function handleCompanyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateDeal(currentDeal.id, {
      companyId: e.target.value ? e.target.value : null,
    })
  }

  function handleContactChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateDeal(currentDeal.id, {
      contactId: e.target.value ? e.target.value : null,
    })
  }

  function handleConfirmDeleteDeal() {
    removeDeal(currentDeal.id)
    setConfirmDeleteOpen(false)
    toast.success('Deal eliminado')
    navigate('/deals')
  }

  const selectClass =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-0.5 rounded p-1 text-slate-600 hover:bg-slate-100"
              aria-label="Back"
            >
              <IconArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 items-start gap-2">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700">
                <IconDollar className="h-5 w-5" />
              </span>
              <h1 className="text-xl font-semibold leading-snug text-slate-900">
                {deal.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <IconNote className="h-4 w-4" />
              Note
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <IconMail className="h-4 w-4" />
              Email
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <IconTask className="h-4 w-4" />
              Task
            </button>
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen((o) => !o)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-slate-700 hover:bg-slate-50"
                aria-label="More actions"
                aria-haspopup="menu"
                aria-expanded={moreMenuOpen}
                aria-controls="deal-more-menu"
              >
                <IconMore className="h-5 w-5" />
              </button>
              {moreMenuOpen ? (
                <div
                  id="deal-more-menu"
                  role="menu"
                  className="absolute right-0 top-full z-50  mt-1 min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full cursor-pointer px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setMoreMenuOpen(false)
                      setConfirmDeleteOpen(true)
                    }}
                  >
                    Delete deal
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-6 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setTab('overview')}
            className={`border-b-2 pb-2 text-sm font-semibold ${
              tab === 'overview'
                ? 'border-sky-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`border-b-2 pb-2 text-sm font-semibold ${
              tab === 'history'
                ? 'border-sky-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {tab === 'overview' ? (
        <div className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-12">
          <section className="rounded-lg border border-slate-200 bg-white lg:col-span-3">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Information</h2>
              <div className="flex items-center gap-1">
                <button type="button" className="rounded p-1 text-slate-400 hover:bg-slate-50" aria-label="Collapse">
                  <span className="text-slate-500">&#709;</span>
                </button>
                <button type="button" className="rounded p-1 text-slate-400 hover:bg-slate-50" aria-label="Settings">
                  <IconSettings className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
                <input
                  type="text"
                  value={deal.name}
                  onChange={(e) => updateDeal(deal.id, { name: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Amount</label>
                <input
                  key={`${deal.id}-${deal.amountCents}`}
                  type="text"
                  defaultValue={formatUsd(deal.amountCents)}
                  onBlur={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, '')
                    const n = Number.parseFloat(raw)
                    if (!Number.isNaN(n)) {
                      updateDeal(deal.id, { amountCents: Math.round(n * 100) })
                    }
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Close date</label>
                <input
                  type="date"
                  value={deal.closeDate ?? ''}
                  onChange={(e) =>
                    updateDeal(deal.id, {
                      closeDate: e.target.value || null,
                    })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Last updated date
                </label>
                <p className="text-sm text-slate-800">{formatDateIso(deal.updatedAt)}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Created at</label>
                <p className="text-sm text-slate-800">{formatDateIso(deal.createdAt)}</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6 lg:col-span-6">
            <div className="rounded-lg border border-slate-200 bg-white">
              <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                Current stage
              </h2>
              <div className="p-4">
                <p className="text-sm font-medium text-slate-900">
                  {stageIndex + 1}/{progressTotal} —{' '}
                  <span className={stageTitleClassName(deal.stageId)}>
                    {stageLabel}
                  </span>
                </p>
                <div className="mt-3 flex gap-1">
                  {stages.map((s, i) => (
                    <div
                      key={s.id}
                      className={`h-2 flex-1 rounded-full ${
                        i <= stageIndex ? 'bg-sky-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  in the current stage for less than a day and opened today.
                </p>
                <div className="mt-4">
                  <label className="sr-only" htmlFor="stage-select">
                    Change stages
                  </label>
                  <div className="relative inline-block">
                    <select
                      id="stage-select"
                      value={deal.stageId}
                      onChange={handleStageChange}
                      className="appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white">
              <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                Recent history
              </h2>
              <div className="p-4">
                <DealStageHistoryTimeline entries={deal.stageHistory ?? []} />
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6 lg:col-span-3">
            <div className="rounded-lg border border-slate-200 bg-white">
              <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                Companies
              </h2>
              <div className="px-4 py-3">
                {!deal.companyId && (
                  <div className="mb-4 flex flex-col items-center text-center">
                    <IconPlant className="mb-3 h-16 w-16 text-sky-600/40" />
                    <p className="text-sm text-slate-500">
                      No companies associated with this record
                    </p>
                  </div>
                )}
                <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="deal-company">
                  Company
                </label>
                <select
                  id="deal-company"
                  value={deal.companyId ?? ''}
                  onChange={handleCompanyChange}
                  className={selectClass}
                >
                  <option value="">No company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <a
                  href="/companies?create=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  Add company
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white">
              <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                Contacts
              </h2>
              <div className="px-4 py-3">
                {!deal.contactId && (
                  <div className="mb-4 flex flex-col items-center text-center">
                    <IconPlant className="mb-3 h-16 w-16 text-sky-600/40" />
                    <p className="text-sm text-slate-500">
                      No contacts associated with this record
                    </p>
                  </div>
                )}
                <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="deal-contact">
                  Contact
                </label>
                <select
                  id="deal-contact"
                  value={deal.contactId ?? ''}
                  onChange={handleContactChange}
                  className={selectClass}
                >
                  <option value="">No contact</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {contactDisplayName(c)}
                    </option>
                  ))}
                </select>
                <a
                  href="/contacts?create=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  Add contact
                </a>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6 overflow-auto p-6">
          <section className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200 bg-white">
            <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
              Stage history
            </h2>
            <div className="p-4">
              <DealStageHistoryTimeline entries={deal.stageHistory ?? []} />
            </div>
          </section>
        </div>
      )}

      <p className="shrink-0 pb-6 text-center text-xs text-slate-400">
        Added by you on{' '}
        {new Date(deal.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete deal?"
        titleId="confirm-delete-deal-title"
        description="This action cannot be undone. The deal will be permanently removed."
        confirmLabel="Delete deal"
        onConfirm={handleConfirmDeleteDeal}
        cancelButtonRef={confirmCancelRef}
      />
    </div>
  )
}
