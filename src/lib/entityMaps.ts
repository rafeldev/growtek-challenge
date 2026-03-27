import type { Contact } from '../types/contact'
import type { Deal } from '../types/deal'

/** Búsqueda O(1) por id en tablas con muchas filas. */
export function contactMapById(contacts: Contact[]): Map<string, Contact> {
  const m = new Map<string, Contact>()
  for (const c of contacts) m.set(c.id, c)
  return m
}

export function dealMapById(deals: Deal[]): Map<string, Deal> {
  const m = new Map<string, Deal>()
  for (const d of deals) m.set(d.id, d)
  return m
}
