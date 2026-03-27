import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { useAddCompany } from '../../hooks/useCompanies'
import { useContactsStore } from '../../stores/contactsStore'
import { useDealsStore } from '../../stores/dealsStore'
import { contactDisplayName } from '../../lib/contactDisplay'
import { subtleTween } from '../../lib/motionConfig'
import type { CreateCompanyInput } from '../../types/company'
import { IconChevronDown } from '../deals/icons'

interface CreateCompanyDrawerProps {
  open: boolean
  onClose: () => void
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
const selectClass = `${inputClass} appearance-none pr-10`

export function CreateCompanyDrawer({ open, onClose }: CreateCompanyDrawerProps) {
  const addCompany = useAddCompany()
  const contacts = useContactsStore((s) => s.contacts)
  const deals = useDealsStore((s) => s.deals)
  const titleId = useId()
  const [contactId, setContactId] = useState('')
  const [dealId, setDealId] = useState('')
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [industry, setIndustry] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
  }, [open])

  const canSubmit = name.trim().length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const input: CreateCompanyInput = {
      name: name.trim(),
      domain: domain.trim(),
      industry: industry.trim(),
      phone: phone.trim(),
      contactId: contactId || null,
      dealId: dealId || null,
    }
    addCompany(input)
    toast.success('Empresa creada correctamente')
    onClose()
    setContactId('')
    setDealId('')
    setName('')
    setDomain('')
    setIndustry('')
    setPhone('')
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ''
      }}
    >
      {open ? (
        <motion.div
          key="create-company-drawer"
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
                Create a company
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
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-6">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-900" htmlFor="ccy-contact">
                    Associate company to contacts
                  </label>
                  <div className="relative">
                    <select
                      id="ccy-contact"
                      value={contactId}
                      onChange={(e) => setContactId(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select a contact</option>
                      {contacts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {contactDisplayName(c)}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-900" htmlFor="ccy-deal">
                    Associate company to deals
                  </label>
                  <div className="relative">
                    <select
                      id="ccy-deal"
                      value={dealId}
                      onChange={(e) => setDealId(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select a deal</option>
                      {deals.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-900" htmlFor="ccy-name">
                    Company name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="ccy-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-900" htmlFor="ccy-domain">
                    Domain
                  </label>
                  <input
                    id="ccy-domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className={inputClass}
                    placeholder="example.com"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-900" htmlFor="ccy-industry">
                    Industry
                  </label>
                  <input
                    id="ccy-industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-900" htmlFor="ccy-phone">
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2 py-2.5 text-sm text-slate-700">
                      🇨🇴 +57
                    </span>
                    <input
                      id="ccy-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Phone number"
                    />
                  </div>
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
