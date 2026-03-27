import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CreateCompanyDrawer } from '../components/companies/CreateCompanyDrawer'
import {
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
import { useOpenCreateFromQuery } from '../hooks/useOpenCreateFromQuery'
import { contactDisplayName } from '../lib/contactDisplay'
import { contactMapById, dealMapById } from '../lib/entityMaps'
import { removeCompanyCascade } from '../lib/crmMutations'
import { formatDateIso } from '../lib/format'
import { useCompaniesStore } from '../stores/companiesStore'
import { useContactsStore } from '../stores/contactsStore'
import { useDealsStore } from '../stores/dealsStore'
import type { Company } from '../types/company'

function contactCell(
  c: Company,
  contactsById: ReturnType<typeof contactMapById>,
) {
  if (!c.contactId) return '—'
  const row = contactsById.get(c.contactId)
  return row ? contactDisplayName(row) : '—'
}

function dealCell(c: Company, dealsById: ReturnType<typeof dealMapById>) {
  if (!c.dealId) return '—'
  return dealsById.get(c.dealId)?.name ?? '—'
}

export function CompaniesPage() {
  const companies = useCompaniesStore((s) => s.companies)
  const contacts = useContactsStore((s) => s.contacts)
  const deals = useDealsStore((s) => s.deals)
  const contactsById = useMemo(() => contactMapById(contacts), [contacts])
  const dealsById = useMemo(() => dealMapById(deals), [deals])
  const [searchQuery, setSearchQuery] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [page, setPage] = useState(1)
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
    if (!q) return companies
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q),
    )
  }, [companies, searchQuery])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * rowsPerPage
  const pageRows = filtered.slice(start, start + rowsPerPage)
  const rangeEnd = Math.min(start + rowsPerPage, total)

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <CrmPageHeader
        title="Companies"
        actions={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Create a company
          </button>
        }
      >
        <div className="mt-4 flex items-center gap-2 border-b border-transparent">
          <button
            type="button"
            className="border-b-2 border-sky-600 pb-2 text-sm font-semibold text-slate-900"
          >
            All companies
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
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <IconFilter className="h-4 w-4 text-slate-500" />
            Add filter
          </button>
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
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Company name</th>
                <th className="px-6 py-3">Domain</th>
                <th className="px-6 py-3">Industry</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Deal</th>
                <th className="px-6 py-3">Created</th>
                <th className="w-px px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-6 py-3 text-slate-700">{c.domain || '—'}</td>
                  <td className="px-6 py-3 text-slate-700">{c.industry || '—'}</td>
                  <td className="px-6 py-3 text-slate-600">{c.phone || '—'}</td>
                  <td className="px-6 py-3 text-slate-700">{contactCell(c, contactsById)}</td>
                  <td className="px-6 py-3 text-slate-700">{dealCell(c, dealsById)}</td>
                  <td className="px-6 py-3 text-slate-500">{formatDateIso(c.createdAt)}</td>
                  <td className="relative px-6 py-3 text-right">
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
                  ? 'No companies match your search.'
                  : 'No companies yet. Create a company to get started.'
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

      <CreateCompanyDrawer
        key={drawerNonce}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete company?"
        titleId="confirm-delete-company-title"
        description="This will remove the company and clear it from related contacts and deals."
        onConfirm={() => {
          if (confirmDeleteId) {
            removeCompanyCascade(confirmDeleteId)
            toast.success('Empresa eliminada')
          }
          setConfirmDeleteId(null)
        }}
      />
    </div>
  )
}
