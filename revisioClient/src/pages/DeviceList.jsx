import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeviceListProvider, useDeviceList } from "@/providers/DeviceListProvider"
import { DeviceTable } from "@/components/device/DeviceTable"
import { DeviceItemForm } from "@/components/device/DeviceItemForm"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { BrandLogo } from "@/components/shared/BrandLogo"
import { StatCard } from "@/components/dashboard/StatCard"
import { cn } from "@/lib/utils"

const KIND_TABS = [
  { key: "all", label: "Všetky" },
  { key: "Spotrebič", label: "Spotrebiče" },
  { key: "Predlžovací prívod", label: "Predlžovacie prívody" },
]

function DeviceListContent() {
  const { state, data, error, handlerMap } = useDeviceList()
  const [createOpen, setCreateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  if (state === "pending") return <LoadingSpinner />
  if (state === "error") return <ErrorMessage error={error} />

  const spotrebice = data.filter(d => d.kind === "Spotrebič").length
  const predlzovacie = data.filter(d => d.kind === "Predlžovací prívod").length
  const filtered = activeTab === "all" ? data : data.filter(d => d.kind === activeTab)

  return (
    <div className="h-full flex flex-col overflow-hidden px-6 pt-6">
      {/* Fixed header */}
      <div className="flex-shrink-0">
        <BrandLogo />
        <h1 className="text-2xl font-bold text-blue-600 mb-5">Zariadenia</h1>

        <div className="flex gap-4 mb-5">
          <StatCard label="Celkovo:" value={data.length} numberColor="text-blue-600" className="w-52" />
          <StatCard label="Spotrebiče:" value={spotrebice} numberColor="text-emerald-600" className="w-52" />
          <StatCard label="Predlžovacie prívody:" value={predlzovacie} numberColor="text-amber-500" className="w-52" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-slate-200 rounded-[8px] px-1.5 py-1.5">
            {KIND_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "px-4 py-1 rounded-[6px] text-sm font-medium transition-colors",
                  activeTab === key ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Pridať zariadenie
          </Button>
        </div>

        <div className="border-t border-slate-200 mb-4" />
      </div>

      {/* Scrollable table */}
      <div className="flex-1 overflow-y-auto pb-6">
        <DeviceTable devices={filtered} />
      </div>

      <DeviceItemForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={handlerMap.handleCreate}
      />
    </div>
  )
}

export default function DeviceList() {
  return (
    <DeviceListProvider>
      <DeviceListContent />
    </DeviceListProvider>
  )
}
