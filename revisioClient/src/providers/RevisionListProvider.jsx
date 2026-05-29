import { createContext, useContext } from "react"
import { useRevisions } from "@/hooks/useRevisions"

const RevisionListContext = createContext(null)

export function RevisionListProvider({ children, filter }) {
  const { data, isLoading, error, refetch } = useRevisions(filter)

  const state = isLoading ? "pending" : error ? "error" : "ready"

  const value = {
    state,
    data: data?.revisionList || [],
    error,
    refetch,
  }

  return (
    <RevisionListContext.Provider value={value}>
      {children}
    </RevisionListContext.Provider>
  )
}

export function useRevisionList() {
  const ctx = useContext(RevisionListContext)
  if (!ctx) throw new Error("useRevisionList must be used within RevisionListProvider")
  return ctx
}
