type Props = {
  rowsPerPage: number
  onRowsPerPageChange: (n: number) => void
  total: number
  rangeStart: number
  rangeEnd: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TablePaginationFooter({
  rowsPerPage,
  onRowsPerPageChange,
  total,
  rangeStart,
  rangeEnd,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const rangeLabel =
    total === 0 ? '0-0' : `${rangeStart}-${rangeEnd}`

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-4 border-t border-slate-200 bg-white px-6 py-3 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <span className="text-slate-500">Rows per page</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="rounded-md border border-slate-200 px-2 py-1 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <span>
        {rangeLabel} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          aria-label="Previous page"
        >
          ‹
        </button>
        <span className="min-w-[5rem] text-center text-xs">
          {page} of {totalPages} pages
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  )
}
