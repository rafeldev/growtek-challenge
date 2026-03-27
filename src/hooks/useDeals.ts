import { useShallow } from 'zustand/react/shallow'
import { PIPELINE_STAGES } from '../data/mockDeals'
import type { DealsContextValue } from '../context/deals-context'
import { useDealsStore } from '../stores/dealsStore'

export function useDeals(): DealsContextValue {
  return useDealsStore(
    useShallow((s) => ({
      stages: PIPELINE_STAGES,
      deals: s.deals,
      addDeal: s.addDeal,
      moveDealToStage: s.moveDealToStage,
      updateDeal: s.updateDeal,
      removeDeal: s.removeDeal,
      getDeal: s.getDeal,
    })),
  )
}

/** Solo crear deal: no re-renderiza al mover tarjetas u otras actualizaciones. */
export function useAddDeal() {
  return useDealsStore((s) => s.addDeal)
}
