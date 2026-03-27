import { useCompaniesStore } from '../stores/companiesStore'
import { useContactsStore } from '../stores/contactsStore'
import { useDealsStore } from '../stores/dealsStore'
import { useListsStore } from '../stores/listsStore'

/** Limpia referencias y elimina el contacto. */
export function removeContactCascade(contactId: string) {
  const now = new Date().toISOString().slice(0, 10)
  useDealsStore.setState((s) => ({
    deals: s.deals.map((d) =>
      d.contactId === contactId ? { ...d, contactId: null, updatedAt: now } : d,
    ),
  }))
  useCompaniesStore.setState((s) => ({
    companies: s.companies.map((c) =>
      c.contactId === contactId ? { ...c, contactId: null, updatedAt: now } : c,
    ),
  }))
  useListsStore.setState((s) => ({
    lists: s.lists.map((list) => ({
      ...list,
      contactIds: list.contactIds.filter((cid) => cid !== contactId),
    })),
  }))
  useContactsStore.getState().removeContact(contactId)
}

/** Limpia referencias y elimina la empresa. */
export function removeCompanyCascade(companyId: string) {
  const now = new Date().toISOString().slice(0, 10)
  useDealsStore.setState((s) => ({
    deals: s.deals.map((d) =>
      d.companyId === companyId ? { ...d, companyId: null, updatedAt: now } : d,
    ),
  }))
  useContactsStore.setState((s) => ({
    contacts: s.contacts.map((c) =>
      c.companyId === companyId ? { ...c, companyId: null, updatedAt: now } : c,
    ),
  }))
  useCompaniesStore.getState().removeCompany(companyId)
}
