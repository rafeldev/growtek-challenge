import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CreateContactDrawer } from '../components/contacts/CreateContactDrawer'
import {
  IconChevronDown,
  IconColumns,
  IconFilter,
  IconSettings,
} from '../components/deals/icons'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CrmPageHeader } from '../components/ui/CrmPageHeader'
import { TableEmptyState } from '../components/ui/TableEmptyState'
import { TablePaginationFooter } from '../components/ui/TablePaginationFooter'
import { TableRowActionsMenu } from '../components/ui/TableRowActionsMenu'
import { TableToolbarRow } from '../components/ui/TableToolbarRow'
import { TableToolbarSearch } from '../components/ui/TableToolbarSearch'
import { MOCK_CONTACT_OWNERS } from '../data/mockContacts'
import { useOpenCreateFromQuery } from '../hooks/useOpenCreateFromQuery'
import { useContacts } from '../hooks/useContacts'
import { removeContactCascade } from '../lib/crmMutations'
import { contactDisplayName } from '../lib/contactDisplay'
import { formatDateIso } from '../lib/format'

function ownerLabel(ownerId: string | null): string {
  if (!ownerId) return '—'
  return MOCK_CONTACT_OWNERS.find((o) => o.id === ownerId)?.label ?? ownerId
}

export function ContactsPage() {
  const { contacts } = useContacts()
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentId, setSegmentId] = useState('all')
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [createOpen, setCreateOpen] = useState(false)
  const [drawerNonce, setDrawerNonce] = useState(0)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const openCreateDrawer = useCallback(() => {
    setDrawerNonce((n) => n + 1)
    setCreateOpen(true)
  }, [])
  useOpenCreateFromQuery(openCreateDrawer)

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (segmentId === 'all' && !q) return contacts
    let list = contacts
    if (segmentId === 'seg-1') {
      list = list.filter((c) => c.subscribed.length > 0)
    }
    if (!q) return list
    return list.filter(
      (c) =>
        contactDisplayName(c).toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    )
  }, [contacts, searchQuery, segmentId])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * rowsPerPage
  const pageRows = filtered.slice(start, start + rowsPerPage)
  const rangeEnd = Math.min(start + rowsPerPage, total)

  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((c) => selected.has(c.id))

  function toggleSelectAllOnPage() {
    if (allOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        for (const c of pageRows) next.delete(c.id)
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        for (const c of pageRows) next.add(c.id)
        return next
      })
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <CrmPageHeader
        title="Contacts"
        actions={
          <>
            <button
              type="button"
              onClick={openCreateDrawer}
              className="inline-flex items-center cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Create a contact
            </button>
            <button
              type="button"
              disabled={true}
              className="inline-flex items-center cursor-not-allowed disabled:opacity-50 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Import contacts
            </button>
          </>
        }
      >
        <div className="mt-4 flex items-center gap-2 border-b border-transparent">
          <button
            type="button"
            className="border-b-2 border-sky-600 pb-2 text-sm font-semibold text-slate-900"
          >
            All contacts
          </button>
          <button
            type="button"
            className="pb-2 text-sm font-medium text-slate-500 hover:text-slate-800"
            aria-label="Add view"
          >
            +
          </button>
        </div>
      </CrmPageHeader>

      <TableToolbarRow
        left={
          <>
            <div className="relative">
              <select
                value={segmentId}
                onChange={(e) => {
                  setSegmentId(e.target.value)
                  setPage(1)
                }}
                className="appearance-none rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-800 hover:bg-slate-50"
              >
                <option value="all">Load a list or a segment</option>
                <option value="seg-1">Engaged last 30 days</option>
              </select>
              <IconChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <IconFilter className="h-4 w-4 text-slate-500" />
              Add filter
            </button>
          </>
        }
        right={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <IconColumns className="h-4 w-4 text-slate-500" />
              Customize columns
            </button>
            <TableToolbarSearch
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v)
                setPage(1)
              }}
            />
            <button
              type="button"
              className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Table settings"
            >
              <IconSettings className="h-5 w-5" />
            </button>
          </>
        }
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAllOnPage}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 accent-sky-600"
                    aria-label="Select all on page"
                  />
                </th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Subscribed</th>
                <th className="px-4 py-3">Blocklisted</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Contact owner</th>
                <th className="px-4 py-3">Landline number</th>
                <th className="px-4 py-3">Last changed</th>
                <th className="px-4 py-3">Creation date</th>
                <th className="w-px px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleRow(c.id)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 accent-sky-600"
                      aria-label={`Select ${contactDisplayName(c)}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-sky-700">
                    {contactDisplayName(c)}
                  </td>
                  <td className="px-4 py-3">
                    {c.subscribed.includes('email') ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        Email
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {c.blocklisted ? 'Yes' : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.email}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {ownerLabel(c.contactOwnerId)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.landlineNumber || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDateIso(c.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDateIso(c.createdAt)}
                  </td>
                  <td className="relative px-4 py-3 text-right">
                    <TableRowActionsMenu onDelete={() => setConfirmDeleteId(c.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total === 0 && (
            <TableEmptyState
              message={
                searchQuery.trim()
                  ? 'No contacts match your search.'
                  : 'No contacts yet. Create a contact to get started.'
              }
            />
          )}
        </div>
      </div>

      <TablePaginationFooter
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n)
          setPage(1)
        }}
        total={total}
        rangeStart={total === 0 ? 0 : start + 1}
        rangeEnd={rangeEnd}
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CreateContactDrawer
        key={drawerNonce}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete contact?"
        titleId="confirm-delete-contact-title"
        description="This will remove the contact and clear associations from deals, companies, and lists."
        onConfirm={() => {
          if (confirmDeleteId) {
            removeContactCascade(confirmDeleteId)
            toast.success('Contacto eliminado')
          }
          setConfirmDeleteId(null)
        }}
      />
    </div>
  )
}
