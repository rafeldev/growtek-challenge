import { Navigate } from 'react-router-dom'

/** Abre el flujo de creación en la vista principal (drawer). */
export function ContactCreatePage() {
  return <Navigate to="/contacts?create=1" replace />
}
