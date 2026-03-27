import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useContactsStore } from './contactsStore'
import type { ContactList, CreateContactListInput } from '../types/contactList'

export const useListsStore = create<{
  lists: ContactList[]
  addList: (input: CreateContactListInput) => string
  getList: (id: string) => ContactList | undefined
  /** Solo elimina si la lista no tiene contactos (contactIds.length === 0). */
  removeList: (id: string) => boolean
}>()(
  persist(
    (set, get) => ({
      lists: [],
      removeList: (id) => {
        const list = get().lists.find((l) => l.id === id)
        if (!list || list.contactIds.length > 0) return false
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== id),
        }))
        return true
      },
      addList: (input) => {
        const id = `list-${crypto.randomUUID()}`
        const now = new Date().toISOString().slice(0, 10)
        const contactIds = [...new Set(input.contactIds)]
        const name = input.name.trim()
        set((state) => ({
          lists: [
            ...state.lists,
            {
              id,
              name,
              contactIds,
              createdAt: now,
            },
          ],
        }))
        const updateContact = useContactsStore.getState().updateContact
        const getContact = useContactsStore.getState().getContact
        for (const cid of contactIds) {
          const c = getContact(cid)
          if (c && !c.listIds.includes(id)) {
            updateContact(cid, { listIds: [...c.listIds, id] })
          }
        }
        return id
      },
      getList: (listId) => get().lists.find((l) => l.id === listId),
    }),
    {
      name: 'growtek-contact-lists',
      partialize: (state) => ({ lists: state.lists }),
      version: 1,
      migrate: (persisted) => {
        if (persisted && typeof persisted === 'object' && 'lists' in persisted) {
          const raw = (persisted as { lists: unknown }).lists
          if (Array.isArray(raw)) return { lists: raw as ContactList[] }
        }
        return { lists: [] as ContactList[] }
      },
    },
  ),
)
