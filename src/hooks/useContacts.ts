import { useShallow } from 'zustand/react/shallow'
import { useContactsStore } from '../stores/contactsStore'

export function useContacts() {
  return useContactsStore(
    useShallow((s) => ({
      contacts: s.contacts,
      addContact: s.addContact,
      updateContact: s.updateContact,
      removeContact: s.removeContact,
      getContact: s.getContact,
    })),
  )
}

/** Solo la acción: no re-renderiza cuando cambia la lista de contactos. */
export function useAddContact() {
  return useContactsStore((s) => s.addContact)
}
