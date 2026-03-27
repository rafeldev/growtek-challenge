interface StandaloneCreatePlaceholderPageProps {
  title: string
  description: string
}

export function StandaloneCreatePlaceholderPage({
  title,
  description,
}: StandaloneCreatePlaceholderPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
      <h1 className="text-center text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-md text-center text-sm text-slate-600">{description}</p>
      <p className="mt-8 text-xs text-slate-400">You can close this tab when you are done.</p>
    </div>
  )
}
