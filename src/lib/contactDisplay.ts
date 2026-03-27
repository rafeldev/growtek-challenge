import type { Contact } from '../types/contact'

export function contactDisplayName(c: Contact): string {
  return [c.firstName, c.lastName].filter(Boolean).join(' ').trim() || c.email
}
