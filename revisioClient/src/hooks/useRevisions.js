import { useState, useEffect } from "react"
import { revisionsApi } from "@/api/revisions"

export function useRevisions(filter = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filter)

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      //load revisions from server
      const result = await revisionsApi.list(filter)
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [filterKey])

  return { data, isLoading, error, refetch: load }
}
