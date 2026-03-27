type Props = {
  message: string
  className?: string
}

export function TableEmptyState({ message, className = 'px-6 py-12' }: Props) {
  return <p className={`text-center text-sm text-slate-500 ${className}`}>{message}</p>
}
