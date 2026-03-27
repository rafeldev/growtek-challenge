import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CreateListDrawer } from '../components/contacts/CreateListDrawer'
import { AlertDialog } from '../components/ui/AlertDialog'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CrmPageHeader } from '../components/ui/CrmPageHeader'
import { TableEmptyState } from '../components/ui/TableEmptyState'
import { TableRowActionsMenu } from '../components/ui/TableRowActionsMenu'
import { useRemoveList } from '../hooks/useLists'
import { formatDateIso } from '../lib/format'
import { useListsStore } from '../stores/listsStore'
import type { ContactList } from '../types/contactList'

export function ContactsListsPage() {
  const lists = useListsStore((s) => s.lists)
  const removeList = useRemoveList()
  const [createOpen, setCreateOpen] = useState(false)
  const [drawerNonce, setDrawerNonce] = useState(0)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [blockedList, setBlockedList] = useState<ContactList | null>(null)

  const sorted = useMemo(
    () => [...lists].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [lists],
  )

  function handleDeleteChoice(list: ContactList) {
    if (list.contactIds.length > 0) {
      setBlockedList(list)
      return
    }
    setConfirmDeleteId(list.id)
  }

  function confirmDelete() {
    if (!confirmDeleteId) return
    const ok = removeList(confirmDeleteId)
    setConfirmDeleteId(null)
    if (ok) toast.success('Lista eliminada')
    else toast.error('No se pudo eliminar la lista')
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <CrmPageHeader
        title="Lists"
        actions={
          <button
            type="button"
            onClick={() => {
              setDrawerNonce((n) => n + 1)
              setCreateOpen(true)
            }}
            className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Create a list
          </button>
        }
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">List name</th>
                <th className="px-6 py-3">Contacts</th>
                <th className="px-6 py-3">Creation date</th>
                <th className="w-px px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((list) => (
                <tr key={list.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{list.name}</td>
                  <td className="px-6 py-3 text-slate-700">{list.contactIds.length}</td>
                  <td className="px-6 py-3 text-slate-600">{formatDateIso(list.createdAt)}</td>
                  <td className="relative px-6 py-3 text-right">
                    <TableRowActionsMenu onDelete={() => handleDeleteChoice(list)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <TableEmptyState message="No lists yet. Create a list and add contacts from your directory." />
          )}
        </div>
      </div>

      <CreateListDrawer
        key={drawerNonce}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete list?"
        titleId="confirm-delete-list-title"
        description="This action cannot be undone. The list will be permanently removed."
        confirmLabel="Delete list"
        onConfirm={confirmDelete}
      />

      <AlertDialog
        open={blockedList !== null}
        onClose={() => setBlockedList(null)}
        title="Cannot delete this list"
        titleId="blocked-delete-title"
        description={
          <>
            <p>
              For security reasons, lists that still have contacts assigned cannot be deleted.
              Remove all contacts from this list first, then try again.
            </p>
            {blockedList ? (
              <p className="mt-3 text-sm font-medium text-slate-800">
                “{blockedList.name}” has {blockedList.contactIds.length} contact
                {blockedList.contactIds.length === 1 ? '' : 's'}.
              </p>
            ) : null}
          </>
        }
      />
    </div>
  )
}
