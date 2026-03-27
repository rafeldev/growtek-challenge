import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_CONTACTS } from '../data/mockContacts'
import type { Contact, CreateContactInput } from '../types/contact'

export const useContactsStore = create<{
  contacts: Contact[]
  addContact: (input: CreateContactInput) => string
  updateContact: (id: string, patch: Partial<Contact>) => void
  removeContact: (id: string) => void
  getContact: (id: string) => Contact | undefined
}>()(
  persist(
    (set, get) => ({
      contacts: INITIAL_CONTACTS,
      addContact: (input) => {
        const id = `contact-${crypto.randomUUID()}`
        const now = new Date().toISOString().slice(0, 10)
        const ext = input.extId.slice(0, 254)
        const newContact: Contact = {
          id,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.trim(),
          sms: input.sms.trim(),
          landlineNumber: input.landlineNumber.trim(),
          extId: ext,
          contactOwnerId: input.contactOwnerId,
          contactTimezone: input.contactTimezone,
          jobTitle: input.jobTitle?.trim() || null,
          listIds: input.listIds,
          companyId: input.companyId,
          linkedin: input.linkedin?.trim() || null,
          subscribed: input.email.trim() ? ['email'] : [],
          blocklisted: false,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ contacts: [...state.contacts, newContact] }))
        return id
      },
      updateContact: (id, patch) => {
        const now = new Date().toISOString().slice(0, 10)
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: now } : c,
          ),
        }))
      },
      removeContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }))
      },
      getContact: (id) => get().contacts.find((c) => c.id === id),
    }),
    {
      name: 'growtek-contacts',
      partialize: (state) => ({ contacts: state.contacts }),
      version: 1,
      migrate: (persisted) => {
        if (
          persisted &&
          typeof persisted === 'object' &&
          'contacts' in persisted
        ) {
          const raw = (persisted as { contacts: unknown }).contacts
          if (Array.isArray(raw)) return { contacts: raw as Contact[] }
        }
        return { contacts: INITIAL_CONTACTS }
      },
    },
  ),
)
