import {
  IconFilter,
  IconGrid,
  IconList,
  IconSearch,
  IconSettings,
  IconSort,
} from './icons'

export type BoardViewMode = 'cards' | 'list'

interface DealsToolbarProps {
  viewMode: BoardViewMode
  onViewModeChange: (mode: BoardViewMode) => void
  dealCount: number
  searchQuery: string
  onSearchQueryChange: (q: string) => void
}

export function DealsToolbar({
  viewMode,
  onViewModeChange,
  dealCount,
  searchQuery,
  onSearchQueryChange,
}: DealsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-md border border-slate-200 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('cards')}
            className={`inline-flex items-center cursor-pointer gap-1.5 rounded px-2.5 py-1.5 text-sm font-medium ${
              viewMode === 'cards'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <IconGrid className="h-4 w-4" />
            Cards
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`inline-flex items-center cursor-pointer gap-1.5 rounded px-2.5 py-1.5 text-sm font-medium ${
              viewMode === 'list'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <IconList className="h-4 w-4" />
            List
          </button>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {dealCount} deal{dealCount === 1 ? '' : 's'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <IconSort className="h-4 w-4 text-slate-500" />
          Sort
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <IconFilter className="h-4 w-4 text-slate-500" />
          Filter
        </button>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Deal name"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-64 rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <button
          type="button"
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
          aria-label="Board settings"
        >
          <IconSettings className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
