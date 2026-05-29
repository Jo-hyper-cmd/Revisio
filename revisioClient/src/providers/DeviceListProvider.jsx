import { createContext, useContext } from "react"
import { useDevices } from "@/hooks/useDevices"
import { devicesApi } from "@/api/devices"

const DeviceListContext = createContext(null)

export function DeviceListProvider({ children, filter }) {
  const { data, isLoading, error, refetch } = useDevices(filter)

  const handleCreate = async (deviceData) => {
    //create device and refresh list
    await devicesApi.create(deviceData)
    refetch()
  }

  const handleUpdate = async (deviceData) => {
    //update device and refresh list
    await devicesApi.update(deviceData)
    refetch()
  }

  const handleDelete = async (id) => {
    //delete device and refresh list
    await devicesApi.delete(id)
    refetch()
  }

  const state = isLoading ? "pending" : error ? "error" : "ready"

  const value = {
    state,
    data: data?.deviceList || [],
    error,
    handlerMap: { handleCreate, handleUpdate, handleDelete },
  }

  return (
    <DeviceListContext.Provider value={value}>
      {children}
    </DeviceListContext.Provider>
  )
}

export function useDeviceList() {
  const ctx = useContext(DeviceListContext)
  if (!ctx) throw new Error("useDeviceList must be used within DeviceListProvider")
  return ctx
}
