import { createContext, useContext, useState } from "react"
import { useDevice } from "@/hooks/useDevices"
import { devicesApi } from "@/api/devices"

const DeviceDetailContext = createContext(null)

export function DeviceDetailProvider({ id, children }) {
  const { data, isLoading, error, refetch } = useDevice(id)
  const [isDeleting, setIsDeleting] = useState(false)
  const [revisionKey, setRevisionKey] = useState(0)

  const handleUpdate = async (deviceData) => {
    //update device and reload
    await devicesApi.update(deviceData)
    refetch()
  }

  const handleDelete = async (deviceId) => {
    //delete device
    setIsDeleting(true)
    try {
      await devicesApi.delete(deviceId)
    } finally {
      setIsDeleting(false)
    }
  }

  const refreshRevisions = () => setRevisionKey(k => k + 1)

  const state = isLoading ? "pending" : error ? "error" : "ready"

  const value = {
    state,
    data: data || null,
    error,
    handlerMap: { handleUpdate, handleDelete },
    pending: { delete: isDeleting },
    revisionKey,
    refreshRevisions,
  }

  return (
    <DeviceDetailContext.Provider value={value}>
      {children}
    </DeviceDetailContext.Provider>
  )
}

export function useDeviceDetail() {
  const ctx = useContext(DeviceDetailContext)
  if (!ctx) throw new Error("useDeviceDetail must be used within DeviceDetailProvider")
  return ctx
}
