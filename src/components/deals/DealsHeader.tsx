import { CrmDataBackupMenu } from './CrmDataBackupMenu'

export function DealsHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-xl font-semibold text-slate-900">example</h1>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <CrmDataBackupMenu />
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-50"
        >
          <span className="h-7 w-7 rounded-full bg-sky-100 text-center text-xs font-medium leading-7 text-sky-800">
            e
          </span>
          example
        </button>
      </div>
    </header>
  )
}
