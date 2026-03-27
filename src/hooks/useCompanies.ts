import { useShallow } from 'zustand/react/shallow'
import { useCompaniesStore } from '../stores/companiesStore'

export function useCompanies() {
  return useCompaniesStore(
    useShallow((s) => ({
      companies: s.companies,
      addCompany: s.addCompany,
      updateCompany: s.updateCompany,
      getCompany: s.getCompany,
    })),
  )
}

/** Solo la acción: no re-renderiza cuando cambia el listado de empresas. */
export function useAddCompany() {
  return useCompaniesStore((s) => s.addCompany)
}
