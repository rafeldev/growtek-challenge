import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useDeals } from '../../hooks/useDeals'
import type { DealStageId } from '../../types/deal'
import { DealColumn } from './DealColumn'
import { DealCardPreview } from './DealCardPreview'

interface DealsKanbanBoardProps {
  filteredDeals: import('../../types/deal').Deal[]
}

const collisionDetection: CollisionDetection = (args) => {
  const pointer = pointerWithin(args)
  if (pointer.length > 0) return pointer
  return closestCorners(args)
}

export function DealsKanbanBoard({ filteredDeals }: DealsKanbanBoardProps) {
  const { stages, moveDealToStage, deals } = useDeals()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const activeDeal = useMemo(
    () => (activeId ? deals.find((d) => d.id === activeId) : undefined),
    [activeId, deals],
  )

  const byStage = useMemo(() => {
    const map = new Map<DealStageId, typeof filteredDeals>()
    for (const s of stages) {
      map.set(s.id, [])
    }
    for (const d of filteredDeals) {
      map.get(d.stageId)?.push(d)
    }
    return map
  }, [filteredDeals, stages])

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const dealId = String(active.id)
    const overId = String(over.id)
    let targetStage: DealStageId | undefined

    if (overId.startsWith('stage:')) {
      targetStage = overId.replace('stage:', '') as DealStageId
    } else {
      const hoverDeal = deals.find((d) => d.id === overId)
      if (hoverDeal) targetStage = hoverDeal.stageId
    }

    if (!targetStage) return
    const current = deals.find((d) => d.id === dealId)
    if (!current || current.stageId === targetStage) return
    moveDealToStage(dealId, targetStage)
    toast.success('Etapa del deal actualizada')
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto px-6 pb-6 pt-2">
        {stages.map((stage) => (
          <DealColumn
            key={stage.id}
            stageId={stage.id}
            label={stage.label}
            deals={byStage.get(stage.id) ?? []}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDeal ? <DealCardPreview deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
