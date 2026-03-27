import { INITIAL_DEALS } from '../data/mockDeals'
import { INITIAL_CONTACTS } from '../data/mockContacts'
import { INITIAL_COMPANIES } from '../data/companySeed'
import type { Contact } from '../types/contact'
import type { ContactList } from '../types/contactList'
import type { Company } from '../types/company'
import type { Deal } from '../types/deal'
import { useCompaniesStore } from '../stores/companiesStore'
import { useContactsStore } from '../stores/contactsStore'
import { useDealsStore } from '../stores/dealsStore'
import { useListsStore } from '../stores/listsStore'

export const CRM_EXPORT_VERSION = 1

export interface CrmExportPayload {
  version: number
  exportedAt: string
  deals: Deal[]
  contacts: Contact[]
  companies: Company[]
  lists: ContactList[]
}

export function buildCrmExportPayload(): CrmExportPayload {
  return {
    version: CRM_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    deals: useDealsStore.getState().deals,
    contacts: useContactsStore.getState().contacts,
    companies: useCompaniesStore.getState().companies,
    lists: useListsStore.getState().lists,
  }
}

export function exportCrmJsonString(): string {
  return JSON.stringify(buildCrmExportPayload(), null, 2)
}

export function parseCrmImport(json: string):
  | { ok: true; data: CrmExportPayload }
  | { ok: false; error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(json) as unknown
  } catch {
    return { ok: false, error: 'JSON inválido.' }
  }
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'Formato inválido.' }
  }
  const o = parsed as Record<string, unknown>
  if (typeof o.version !== 'number' || o.version < 1) {
    return { ok: false, error: 'Versión de exportación no soportada.' }
  }
  if (!Array.isArray(o.deals) || !Array.isArray(o.contacts) || !Array.isArray(o.companies) || !Array.isArray(o.lists)) {
    return { ok: false, error: 'Faltan arrays deals, contacts, companies o lists.' }
  }
  return {
    ok: true,
    data: {
      version: o.version,
      exportedAt: typeof o.exportedAt === 'string' ? o.exportedAt : '',
      deals: o.deals as Deal[],
      contacts: o.contacts as Contact[],
      companies: o.companies as Company[],
      lists: o.lists as ContactList[],
    },
  }
}

export function applyCrmImport(data: CrmExportPayload): void {
  useDealsStore.setState({ deals: data.deals })
  useContactsStore.setState({ contacts: data.contacts })
  useCompaniesStore.setState({ companies: data.companies })
  useListsStore.setState({ lists: data.lists })
}

export function resetCrmToDemoSeeds(): void {
  useDealsStore.setState({ deals: structuredClone(INITIAL_DEALS) })
  useContactsStore.setState({ contacts: structuredClone(INITIAL_CONTACTS) })
  useCompaniesStore.setState({ companies: structuredClone(INITIAL_COMPANIES) })
  useListsStore.setState({ lists: [] })
}
