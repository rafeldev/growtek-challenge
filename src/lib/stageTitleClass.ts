import type { DealStageId } from '../types/deal'

/** Clases para el título de etapa: Won verde, Lost rojo, resto neutro. */
export function stageTitleClassName(stageId: DealStageId): string {
  if (stageId === 'won') return 'text-emerald-600'
  if (stageId === 'lost') return 'text-red-600'
  return 'text-slate-900'
}
