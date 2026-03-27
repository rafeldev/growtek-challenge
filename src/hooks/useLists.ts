import { useShallow } from 'zustand/react/shallow'
import { useListsStore } from '../stores/listsStore'

export function useLists() {
  return useListsStore(
    useShallow((s) => ({
      lists: s.lists,
      addList: s.addList,
      getList: s.getList,
      removeList: s.removeList,
    })),
  )
}

export function useAddList() {
  return useListsStore((s) => s.addList)
}

export function useRemoveList() {
  return useListsStore((s) => s.removeList)
}
