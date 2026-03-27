import { Outlet } from 'react-router-dom'
import { DealsHeader } from './DealsHeader'
import { DealsSidebar } from './DealsSidebar'

export function DealsShell() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <DealsSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-50">
        <DealsHeader />
        <main className="flex min-h-0 flex-1 flex-col overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
