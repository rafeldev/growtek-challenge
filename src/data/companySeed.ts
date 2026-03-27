import type { Company } from '../types/company'

const today = new Date().toISOString().slice(0, 10)

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'company-1',
    name: 'Acme Corp',
    domain: 'acme.com',
    industry: 'Software',
    phone: '+57 601 555 0100',
    contactId: null,
    dealId: null,
    createdAt: today,
    updatedAt: today,
  },
]
