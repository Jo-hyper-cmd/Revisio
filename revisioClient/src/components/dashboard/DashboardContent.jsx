import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsGrid } from "./StatsGrid"
import { FilterTabs } from "./FilterTabs"
import { RevisionsTable } from "./RevisionsTable"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { BrandLogo } from "@/components/shared/BrandLogo"
import { useRevisionList } from "@/providers/RevisionListProvider"
import { useDevices } from "@/hooks/useDevices"
import { getRevisionStatus } from "@/lib/status"

export function DashboardContent({ onAddDevice }) {
  const [filter, setFilter] = useState("all")
  const { state, data: revisions, error, refetch } = useRevisionList()
  const { data: devicesData } = useDevices()

  if (state === "pending") return <LoadingSpinner />
  if (state === "error") return <ErrorMessage error={error} />

  const deviceMap = Object.fromEntries(
    (devicesData?.deviceList || []).map(d => [d.id, d])
  )

  const enriched = revisions.map(r => {
    const device = deviceMap[r.deviceId] || {}
    return {
      ...r,
      deviceName: device.name || r.deviceId,
      status: r.status || getRevisionStatus(r.nextRevisionDate),
    }
  })

  //keep only the latest revision per device
  const activeRevisions = Object.values(
    enriched.reduce((acc, r) => {
      if (!acc[r.deviceId] || r.revisionDate > acc[r.deviceId].revisionDate) {
        acc[r.deviceId] = r
      }
      return acc
    }, {})
  )

  const filtered = filter === "all" ? activeRevisions : activeRevisions.filter(r => r.status === filter)

  return (
    <div className="h-full flex flex-col overflow-hidden px-6 pt-6">
      {/* Fixed header */}
      <div className="flex-shrink-0">
        <BrandLogo />
        <h1 className="text-2xl font-bold text-blue-600 mb-5">Prehľad</h1>
        <StatsGrid revisions={activeRevisions} />
        <div className="flex items-center justify-between mb-4">
          <FilterTabs active={filter} onChange={setFilter} />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5" onClick={onAddDevice}>
            <Plus className="w-4 h-4 mr-1.5" />
            Pridať zariadenie
          </Button>
        </div>
        <div className="border-t border-slate-200 mb-4" />
      </div>

      {/* Scrollable table */}
      <div className="flex-1 overflow-y-auto pb-6">
        <RevisionsTable revisions={filtered} onMutated={refetch} />
      </div>
    </div>
  )
}
