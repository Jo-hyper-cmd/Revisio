import { useState, useEffect } from "react"
import { devicesApi } from "@/api/devices"

export function useDevices(filter = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filter)

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      //load devices from server
      const result = await devicesApi.list(filter)
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

export function useDevice(id) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      //load device by id
      const result = await devicesApi.get(id)
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  return { data, isLoading, error, refetch: load }
}
