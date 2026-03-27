import type {
  CreateDealInput,
  Deal,
  DealStageId,
  PipelineStage,
} from '../types/deal'

/** Forma del valor expuesto por `useDeals()` (antes vía React Context). */
export interface DealsContextValue {
  stages: PipelineStage[]
  deals: Deal[]
  addDeal: (input: CreateDealInput) => string
  moveDealToStage: (dealId: string, stageId: DealStageId) => void
  updateDeal: (id: string, patch: Partial<Deal>) => void
  removeDeal: (id: string) => void
  getDeal: (id: string) => Deal | undefined
}
