import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import {
  MOCK_CONTACT_OWNERS,
  MOCK_TIMEZONES,
} from '../../data/mockContacts'
import { useAddContact } from '../../hooks/useContacts'
import { useCompaniesStore } from '../../stores/companiesStore'
import { useListsStore } from '../../stores/listsStore'
import type { CreateContactInput } from '../../types/contact'
import { subtleTween } from '../../lib/motionConfig'
import { IconChevronDown } from '../deals/icons'

interface CreateContactDrawerProps {
  open: boolean
  onClose: () => void
}

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-900'
const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
const selectClass = inputClass

export function CreateContactDrawer({ open, onClose }: CreateContactDrawerProps) {
  const addContact = useAddContact()
  const companies = useCompaniesStore((s) => s.companies)
  const lists = useListsStore((s) => s.lists)
  const titleId = useId()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [sms, setSms] = useState('')
  const [landlineNumber, setLandlineNumber] = useState('')
  const [extId, setExtId] = useState('')
  const [contactOwnerId, setContactOwnerId] = useState('')
  const [contactTimezone, setContactTimezone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [listIds, setListIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
  }, [open])

  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0

  function toggleList(id: string) {
    setListIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    const input: CreateContactInput = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      sms: sms.trim(),
      landlineNumber: landlineNumber.trim(),
      extId: extId.slice(0, 254),
      contactOwnerId: contactOwnerId || null,
      contactTimezone: contactTimezone || null,
      jobTitle: jobTitle.trim() || null,
      listIds,
      companyId: companyId || null,
      linkedin: linkedin.trim() || null,
    }

    addContact(input)
    toast.success('Contacto creado correctamente')
    onClose()
    setFirstName('')
    setLastName('')
    setEmail('')
    setSms('')
    setLandlineNumber('')
    setExtId('')
    setContactOwnerId('')
    setContactTimezone('')
    setJobTitle('')
    setCompanyId('')
    setLinkedin('')
    setListIds([])
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ''
      }}
    >
      {open ? (
        <motion.div
          key="create-contact-drawer"
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
                Create a contact
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
                  <label className={labelClass} htmlFor="cc-firstname">
                    Firstname
                  </label>
                  <input
                    id="cc-firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter the FIRSTNAME"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-lastname">
                    Lastname
                  </label>
                  <input
                    id="cc-lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter the LASTNAME"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-email">
                    Email
                  </label>
                  <input
                    id="cc-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email address"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-sms">
                    SMS
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2 py-2.5 text-sm text-slate-700">
                      🇨🇴 +57
                    </span>
                    <input
                      id="cc-sms"
                      value={sms}
                      onChange={(e) => setSms(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-landline">
                    Landline number
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2 py-2.5 text-sm text-slate-700">
                      🇨🇴 +57
                    </span>
                    <input
                      id="cc-landline"
                      value={landlineNumber}
                      onChange={(e) => setLandlineNumber(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Landline"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-extid">
                    Ext_id
                  </label>
                  <div className="relative">
                    <textarea
                      id="cc-extid"
                      value={extId}
                      onChange={(e) => setExtId(e.target.value.slice(0, 254))}
                      placeholder="Some text here"
                      rows={3}
                      className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <span className="pointer-events-none absolute bottom-2 right-2 text-xs text-slate-400">
                      {extId.length}/254
                    </span>
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-owner">
                    Contact owner
                  </label>
                  <div className="relative">
                    <select
                      id="cc-owner"
                      value={contactOwnerId}
                      onChange={(e) => setContactOwnerId(e.target.value)}
                      className={`${selectClass} appearance-none pr-10`}
                    >
                      <option value="">Select owner</option>
                      {MOCK_CONTACT_OWNERS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-tz">
                    Contact timezone
                  </label>
                  <div className="relative">
                    <select
                      id="cc-tz"
                      value={contactTimezone}
                      onChange={(e) => setContactTimezone(e.target.value)}
                      className={`${selectClass} appearance-none pr-10`}
                    >
                      <option value="">Select an option</option>
                      {MOCK_TIMEZONES.map((tz) => (
                        <option key={tz.id} value={tz.id}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-job">
                    Job title
                  </label>
                  <input
                    id="cc-job"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Some text here"
                    className={inputClass}
                  />
                </div>
                <div>
                  <p className={labelClass}>Lists</p>
                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                    {lists.length === 0 ? (
                      <p className="text-sm text-slate-500">No lists yet. Create one in Lists.</p>
                    ) : (
                      lists.map((list) => (
                        <label
                          key={list.id}
                          className="flex cursor-pointer items-center gap-2 text-sm text-slate-800"
                        >
                          <input
                            type="checkbox"
                            checked={listIds.includes(list.id)}
                            onChange={() => toggleList(list.id)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 accent-sky-600 focus:ring-sky-500"
                          />
                          {list.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-company">
                    Associated to companies
                  </label>
                  <div className="relative">
                    <select
                      id="cc-company"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className={`${selectClass} appearance-none pr-10`}
                    >
                      <option value="">Select a company</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  <a
                    href="/companies?create=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-sky-700 hover:text-sky-900"
                  >
                    Add company in new tab
                  </a>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cc-li">
                    Linkedin
                  </label>
                  <input
                    id="cc-li"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="Some text here"
                    className={inputClass}
                  />
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
