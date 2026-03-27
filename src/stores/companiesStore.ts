import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_COMPANIES } from '../data/companySeed'
import type { Company, CreateCompanyInput } from '../types/company'

export const useCompaniesStore = create<{
  companies: Company[]
  addCompany: (input: CreateCompanyInput) => string
  updateCompany: (id: string, patch: Partial<Company>) => void
  removeCompany: (id: string) => void
  getCompany: (id: string) => Company | undefined
}>()(
  persist(
    (set, get) => ({
      companies: INITIAL_COMPANIES,
      addCompany: (input) => {
        const id = `company-${crypto.randomUUID()}`
        const now = new Date().toISOString().slice(0, 10)
        const row: Company = {
          id,
          name: input.name.trim(),
          domain: input.domain.trim(),
          industry: input.industry.trim(),
          phone: input.phone.trim(),
          contactId: input.contactId,
          dealId: input.dealId,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ companies: [...state.companies, row] }))
        return id
      },
      updateCompany: (id, patch) => {
        const now = new Date().toISOString().slice(0, 10)
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: now } : c,
          ),
        }))
      },
      removeCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
        }))
      },
      getCompany: (id) => get().companies.find((c) => c.id === id),
    }),
    {
      name: 'growtek-companies',
      partialize: (state) => ({ companies: state.companies }),
      version: 1,
      migrate: (persisted) => {
        if (
          persisted &&
          typeof persisted === 'object' &&
          'companies' in persisted
        ) {
          const raw = (persisted as { companies: unknown }).companies
          if (Array.isArray(raw)) return { companies: raw as Company[] }
        }
        return { companies: INITIAL_COMPANIES }
      },
    },
  ),
)
