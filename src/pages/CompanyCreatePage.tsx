import { Navigate } from 'react-router-dom'

/** Abre el flujo de creación en la vista principal (drawer). */
export function CompanyCreatePage() {
  return <Navigate to="/companies?create=1" replace />
}
