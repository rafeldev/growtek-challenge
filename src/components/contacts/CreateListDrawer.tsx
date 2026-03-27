import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { useContacts } from '../../hooks/useContacts'
import { useAddList } from '../../hooks/useLists'
import { contactDisplayName } from '../../lib/contactDisplay'
import { subtleTween } from '../../lib/motionConfig'

interface CreateListDrawerProps {
  open: boolean
  onClose: () => void
}

export function CreateListDrawer({ open, onClose }: CreateListDrawerProps) {
  const addList = useAddList()
  const { contacts: allContacts } = useContacts()
  const titleId = useId()
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
  }, [open])

  const canSubmit = name.trim().length > 0

  function toggleContact(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    addList({
      name: name.trim(),
      contactIds: [...selectedIds],
    })
    toast.success('Lista creada correctamente')
    onClose()
    setName('')
    setSelectedIds(new Set())
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ''
      }}
    >
      {open ? (
        <motion.div
          key="create-list-drawer"
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
            <div className="flex shrink-0 items-center justify-between bg-emerald-200/90 px-5 py-4">
              <h2 id={titleId} className="text-lg font-bold text-slate-900">
                Create a list
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
                  <label
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-900"
                    htmlFor="list-name"
                  >
                    Name
                  </label>
                  <input
                    id="list-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="List name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-900">
                    Contacts
                  </p>
                  <p className="mb-3 text-sm text-slate-600">
                    Select existing contacts to include in this list.
                  </p>
                  {allContacts.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
                      No contacts yet. Create contacts from the Contacts page first.
                    </p>
                  ) : (
                    <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                      {allContacts.map((c) => (
                        <label
                          key={c.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-800 hover:bg-white"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(c.id)}
                            onChange={() => toggleContact(c.id)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 accent-sky-600 focus:ring-sky-500"
                          />
                          <span className="min-w-0 truncate">{contactDisplayName(c)}</span>
                          <span className="shrink-0 text-xs text-slate-500">{c.email}</span>
                        </label>
                      ))}
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
                  className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
