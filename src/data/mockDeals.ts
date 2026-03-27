import type { Deal, PipelineStage } from '../types/deal'

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'new', label: 'New', order: 0 },
  { id: 'qualifying', label: 'Qualifying', order: 1 },
  { id: 'demo_scheduled', label: 'Demo scheduled', order: 2 },
  { id: 'pending_commitment', label: 'Pending commitment', order: 3 },
  { id: 'in_negotiation', label: 'In negotiation', order: 4 },
  { id: 'won', label: 'Won', order: 5 },
  { id: 'lost', label: 'Lost', order: 6 },
]

const today = new Date().toISOString().slice(0, 10)

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: "I'm a Deal example, this is my name.",
    amountCents: 100_000,
    currency: 'USD',
    stageId: 'new',
    closeDate: null,
    lastActivityLabel: 'Today',
    createdAt: today,
    updatedAt: today,
    contactId: null,
    companyId: null,
    stageHistory: [
      {
        stageId: 'new',
        label: 'New',
        movedAt: `${today}T12:00:00.000Z`,
      },
    ],
  },
]
