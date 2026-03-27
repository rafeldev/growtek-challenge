import { Navigate, Route, Routes } from 'react-router-dom'
import { DealsShell } from './components/deals/DealsShell'
import { CompanyCreatePage } from './pages/CompanyCreatePage'
import { ContactCreatePage } from './pages/ContactCreatePage'
import { CompaniesPage } from './pages/CompaniesPage'
import { ContactsListsPage } from './pages/ContactsListsPage'
import { ContactsPage } from './pages/ContactsPage'
import { DealDetailPage } from './pages/DealDetailPage'
import { DealsBoardPage } from './pages/DealsBoardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/companies/new" element={<CompanyCreatePage />} />
      <Route path="/contacts/new" element={<ContactCreatePage />} />
      <Route element={<DealsShell />}>
        <Route path="/" element={<Navigate to="/deals" replace />} />
        <Route path="/deals" element={<DealsBoardPage />} />
        <Route path="/deals/:dealId" element={<DealDetailPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/contacts/lists" element={<ContactsListsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
      </Route>
    </Routes>
  )
}
