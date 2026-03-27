import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_DEALS, PIPELINE_STAGES } from '../data/mockDeals'
import { useCompaniesStore } from './companiesStore'
import type { CreateDealInput, Deal, DealStageHistoryEntry, DealStageId } from '../types/deal'

function stageLabel(stageId: DealStageId): string {
  return PIPELINE_STAGES.find((s) => s.id === stageId)?.label ?? stageId
}

function migrateDealsToStageHistory(deals: Deal[]): Deal[] {
  return deals.map((d) => {
    const existing = (d as Deal & { stageHistory?: DealStageHistoryEntry[] }).stageHistory
    if (existing && existing.length > 0) return d as Deal
    return {
      ...d,
      stageHistory: [
        {
          stageId: d.stageId,
          label: stageLabel(d.stageId),
          movedAt: `${d.createdAt}T12:00:00.000Z`,
        },
      ],
    } as Deal
  })
}

export const useDealsStore = create<{
  deals: Deal[]
  addDeal: (input: CreateDealInput) => string
  moveDealToStage: (dealId: string, stageId: DealStageId) => void
  updateDeal: (id: string, patch: Partial<Deal>) => void
  removeDeal: (id: string) => void
  getDeal: (id: string) => Deal | undefined
}>()(
  persist(
    (set, get) => ({
      deals: INITIAL_DEALS,
      addDeal: (input) => {
        const id = `deal-${crypto.randomUUID()}`
        const now = new Date().toISOString().slice(0, 10)
        const movedAt = new Date().toISOString()
        const amountCents =
          input.amountCents != null ? Math.round(input.amountCents) : 0
        const newDeal: Deal = {
          id,
          name: input.name.trim(),
          amountCents,
          currency: 'USD',
          stageId: input.stageId,
          closeDate: input.closeDate,
          lastActivityLabel: 'Today',
          createdAt: now,
          updatedAt: now,
          contactId: input.contactId,
          companyId: input.companyId,
          stageHistory: [
            {
              stageId: input.stageId,
              label: stageLabel(input.stageId),
              movedAt,
            },
          ],
        }
        set((state) => ({ deals: [...state.deals, newDeal] }))
        return id
      },
      moveDealToStage: (dealId, stageId) => {
        const now = new Date().toISOString().slice(0, 10)
        const movedAt = new Date().toISOString()
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            if (d.stageId === stageId) return d
            const label = stageLabel(stageId)
            return {
              ...d,
              stageId,
              updatedAt: now,
              lastActivityLabel: 'Today',
              stageHistory: [
                ...(d.stageHistory ?? []),
                { stageId, label, movedAt },
              ],
            }
          }),
        }))
      },
      updateDeal: (id, patch) => {
        const now = new Date().toISOString().slice(0, 10)
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== id) return d
            const stageChanged =
              patch.stageId !== undefined && patch.stageId !== d.stageId
            let stageHistory = d.stageHistory ?? []
            if (stageChanged && patch.stageId) {
              const label = stageLabel(patch.stageId)
              stageHistory = [
                ...stageHistory,
                {
                  stageId: patch.stageId,
                  label,
                  movedAt: new Date().toISOString(),
                },
              ]
            }
            return {
              ...d,
              ...patch,
              updatedAt: now,
              ...(stageChanged ? { stageHistory } : {}),
            }
          }),
        }))
      },
      removeDeal: (id) => {
        const now = new Date().toISOString().slice(0, 10)
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
        }))
        useCompaniesStore.setState((s) => ({
          companies: s.companies.map((c) =>
            c.dealId === id ? { ...c, dealId: null, updatedAt: now } : c,
          ),
        }))
      },
      getDeal: (id) => get().deals.find((d) => d.id === id),
    }),
    {
      name: 'growtek-deals',
      partialize: (state) => ({ deals: state.deals }),
      version: 2,
      migrate: (persisted, fromVersion) => {
        if (
          fromVersion < 2 &&
          persisted &&
          typeof persisted === 'object' &&
          'deals' in persisted
        ) {
          const p = persisted as { deals: Deal[] }
          return { deals: migrateDealsToStageHistory(p.deals) }
        }
        return persisted as { deals: Deal[] }
      },
    },
  ),
)
