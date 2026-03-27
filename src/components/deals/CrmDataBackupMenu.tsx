import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  applyCrmImport,
  exportCrmJsonString,
  parseCrmImport,
  resetCrmToDemoSeeds,
} from '../../lib/crmDataBackup'

export function CrmDataBackupMenu() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  function handleExport() {
    const json = exportCrmJsonString()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `growtek-crm-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Copia exportada')
    setOpen(false)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      const parsed = parseCrmImport(text)
      if (!parsed.ok) {
        toast.error(parsed.error)
        return
      }
      applyCrmImport(parsed.data)
      toast.success('Datos importados')
      setOpen(false)
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (!window.confirm('¿Restaurar datos de demostración? Se perderán los cambios locales.')) {
      return
    }
    resetCrmToDemoSeeds()
    toast.success('Datos de demo restaurados')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Datos
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
              onClick={handleExport}
            >
              Exportar JSON
            </button>
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
              onClick={handleImportClick}
            >
              Importar JSON
            </button>
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-amber-800 hover:bg-amber-50"
              onClick={handleReset}
            >
              Restaurar demo
            </button>
          </div>
        </>
      ) : null}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
