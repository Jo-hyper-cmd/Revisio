import { useState } from "react"
import { RevisionListProvider } from "@/providers/RevisionListProvider"
import { DeviceListProvider, useDeviceList } from "@/providers/DeviceListProvider"
import { DashboardContent } from "@/components/dashboard/DashboardContent"
import { DeviceItemForm } from "@/components/device/DeviceItemForm"

function DashboardWithCreate() {
  const [createOpen, setCreateOpen] = useState(false)
  const { handlerMap } = useDeviceList()

  return (
    <>
      <DashboardContent onAddDevice={() => setCreateOpen(true)} />
      <DeviceItemForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={handlerMap.handleCreate}
      />
    </>
  )
}

export default function Dashboard() {
  return (
    <DeviceListProvider>
      <RevisionListProvider>
        <DashboardWithCreate />
      </RevisionListProvider>
    </DeviceListProvider>
  )
}
