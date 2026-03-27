import { IconSearch } from '../deals/icons'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TableToolbarSearch({
  value,
  onChange,
  placeholder = 'Search',
  className = 'w-56',
}: Props) {
  return (
    <div className="relative">
      <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500`}
      />
    </div>
  )
}
