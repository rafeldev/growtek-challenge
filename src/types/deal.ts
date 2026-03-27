export type DealStageId =
  | 'new'
  | 'qualifying'
  | 'demo_scheduled'
  | 'pending_commitment'
  | 'in_negotiation'
  | 'won'
  | 'lost'
export interface PipelineStage {
  id: DealStageId
  label: string
  order: number
}

/** Entrada en el historial cuando el deal pasa a una etapa del pipeline. */
export interface DealStageHistoryEntry {
  stageId: DealStageId
  /** Etiqueta mostrada (snapshot del nombre de la etapa en ese momento). */
  label: string
  /** ISO 8601 (fecha y hora del cambio). */
  movedAt: string
}

export interface Deal {
  id: string
  name: string
  amountCents: number
  currency: 'USD'
  stageId: DealStageId
  closeDate: string | null
  lastActivityLabel: string
  createdAt: string
  updatedAt: string
  contactId: string | null
  companyId: string | null
  /** Orden cronológico: cada cambio de etapa añade una entrada. */
  stageHistory: DealStageHistoryEntry[]
}

export interface CreateDealInput {
  name: string
  stageId: DealStageId
  amountCents: number | null
  closeDate: string | null
  contactId: string | null
  companyId: string | null
  createTask: boolean
  taskTitle: string
  taskDueDate: string | null
  taskTime: string | null
}
