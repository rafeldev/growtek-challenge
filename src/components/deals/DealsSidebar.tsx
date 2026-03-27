import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconChevronDown, IconHome } from './icons'

const crmOpen = true

const navClass =
  'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'

export function DealsSidebar() {
  const [contactsOpen, setContactsOpen] = useState(true)

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      <div className="flex h-14 items-center px-4">
        <span className="text-lg font-semibold text-sky-600">Growtek</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2 pb-4">
        <a href="#" className={navClass}>
          <IconHome className="h-5 w-5 shrink-0 text-slate-500" />
          Home
        </a>
        <div>
          <button
            type="button"
            className={`${navClass} w-full justify-between font-medium`}
          >
            <span className="flex items-center gap-3">
              <span className="h-5 w-5 rounded border border-slate-300" />
              CRM
            </span>
            <IconChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          {crmOpen && (
            <div className="ml-2 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setContactsOpen((o) => !o)}
                  className={`${navClass} w-full justify-between pl-2 font-medium`}
                  aria-expanded={contactsOpen}
                >
                  <span>Contacts</span>
                  <IconChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      contactsOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                    aria-hidden
                  />
                </button>
                {contactsOpen && (
                  <div className="ml-2 space-y-0.5 border-l border-slate-200 pl-3">
                    <NavLink
                      to="/contacts"
                      end
                      className={({ isActive }) =>
                        `relative flex items-center rounded-md py-2 pl-2 pr-3 text-sm ${
                          isActive
                            ? 'bg-sky-50 font-medium text-slate-900'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          All contacts
                          {isActive && (
                            <span
                              className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l bg-sky-600"
                              aria-hidden
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                    <NavLink
                      to="/contacts/lists"
                      className={({ isActive }) =>
                        `relative flex items-center rounded-md py-2 pl-2 pr-3 text-sm ${
                          isActive
                            ? 'bg-sky-50 font-medium text-slate-900'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          Lists
                          {isActive && (
                            <span
                              className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l bg-sky-600"
                              aria-hidden
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </div>
                )}
              </div>
              <NavLink
                to="/companies"
                className={({ isActive }) =>
                  `relative flex items-center rounded-md py-2 pl-2 pr-3 text-sm ${
                    isActive
                      ? 'bg-sky-50 font-medium text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Companies
                    {isActive && (
                      <span
                        className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l bg-sky-600"
                        aria-hidden
                      />
                    )}
                  </>
                )}
              </NavLink>
              <NavLink
                to="/deals"
                className={({ isActive }) =>
                  `relative flex items-center rounded-md py-2 pl-2 pr-3 text-sm ${
                    isActive
                      ? 'bg-sky-50 font-medium text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Deals
                    {isActive && (
                      <span
                        className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l bg-sky-600"
                        aria-hidden
                      />
                    )}
                  </>
                )}
              </NavLink>
              <a href="#" className={`${navClass} pl-2`}>
                Reports
              </a>
              <a href="#" className={`${navClass} pl-2`}>
                Tasks
              </a>
              <a href="#" className={`${navClass} pl-2`}>
                Custom objects
              </a>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
