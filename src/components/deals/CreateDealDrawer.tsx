import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PIPELINE_STAGES } from '../../data/mockDeals'
import { useAddDeal } from '../../hooks/useDeals'
import { contactDisplayName } from '../../lib/contactDisplay'
import { useCompaniesStore } from '../../stores/companiesStore'
import { useContactsStore } from '../../stores/contactsStore'
import type { CreateDealInput, DealStageId } from '../../types/deal'
import { subtleTween } from '../../lib/motionConfig'
import { IconCalendar } from './icons'

interface CreateDealDrawerProps {
  open: boolean
  onClose: () => void
}

const defaultStage: DealStageId = 'new'

export function CreateDealDrawer({ open, onClose }: CreateDealDrawerProps) {
  const navigate = useNavigate()
  const addDeal = useAddDeal()
  const stages = PIPELINE_STAGES
  const contacts = useContactsStore((s) => s.contacts)
  const companies = useCompaniesStore((s) => s.companies)
  const titleId = useId()
  const [contactId, setContactId] = useState<string>('')
  const [companyId, setCompanyId] = useState<string>('')
  const [name, setName] = useState('')
  const [stageId, setStageId] = useState<DealStageId>(defaultStage)
  const [amount, setAmount] = useState('')
  const [closeDate, setCloseDate] = useState('')
  const [createTask, setCreateTask] = useState(false)
  const [taskStatus, setTaskStatus] = useState('To do')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('2026-03-30')
  const [taskTime, setTaskTime] = useState('6:00 PM')

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
  }, [open])

  const amountNum = amount.trim() === '' ? null : Number.parseFloat(amount)
  const amountCents =
    amountNum != null && !Number.isNaN(amountNum)
      ? Math.round(amountNum * 100)
      : null

  const canSubmit = name.trim().length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    const input: CreateDealInput = {
      name: name.trim(),
      stageId,
      amountCents,
      closeDate: closeDate || null,
      contactId: contactId || null,
      companyId: companyId || null,
      createTask,
      taskTitle: taskTitle.trim() || 'To do',
      taskDueDate: createTask ? taskDueDate : null,
      taskTime: createTask ? taskTime : null,
    }

    const id = addDeal(input)
    toast.success('Deal creado correctamente')
    onClose()
    navigate(`/deals/${id}`)
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ''
      }}
    >
      {open ? (
        <motion.div
          key="create-deal-drawer"
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={subtleTween}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.div
            className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: 18 }}
            animate={{ x: 0 }}
            exit={{ x: 18 }}
            transition={subtleTween}
          >
        <div className="flex shrink-0 items-center justify-between bg-sky-200/90 px-5 py-4">
          <h2 id={titleId} className="text-lg font-bold text-slate-900">
            Create a deal
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-800 hover:bg-black/10"
            aria-label="Close"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900">
                Associate deal to contacts
              </label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Select a contact</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {contactDisplayName(c)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900">
                Associate deal to companies
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Select a company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900">
                Deal name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900">
                Deal stage <span className="text-red-600">*</span>
              </label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value as DealStageId)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                required
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900">Amount</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-3 pr-14 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  USD
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900">Close date</label>
              <div className="relative">
                <input
                  type="text"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-3 pr-10 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <IconCalendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2">
              <p className="mb-3 text-sm font-bold text-slate-900">Create a task</p>
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={createTask}
                  onChange={(e) => setCreateTask(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 accent-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-800">
                  Create a task to follow-up on this deal
                </span>
              </label>

              {createTask && (
                <div className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="w-28 shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"
                    >
                      <option>To do</option>
                      <option>In progress</option>
                    </select>
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="To do"
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-900">
                        Due date <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 py-2 pl-2 pr-8 text-sm"
                        />
                        <IconCalendar className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-900">Time</label>
                      <select
                        value={taskTime}
                        onChange={(e) => setTaskTime(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"
                      >
                        <option>6:00 PM</option>
                        <option>9:00 AM</option>
                        <option>12:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-sky-700 hover:text-sky-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
