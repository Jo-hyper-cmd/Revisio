import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Pencil, Trash2, ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeviceDetailProvider, useDeviceDetail } from "@/providers/DeviceDetailProvider"
import { DeviceInfoCard } from "@/components/device/DeviceInfoCard"
import { DeviceRevisionsCard } from "@/components/device/DeviceRevisionsCard"
import { DeviceSidebar } from "@/components/device/DeviceSidebar"
import { DeviceItemForm } from "@/components/device/DeviceItemForm"
import { DeviceItemDeleteDialog } from "@/components/device/DeviceItemDeleteDialog"
import { RevisionItemForm } from "@/components/revision/RevisionItemForm"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { BrandLogo } from "@/components/shared/BrandLogo"
import { revisionsApi } from "@/api/revisions"

function DeviceDetailContent() {
  const navigate = useNavigate()
  const { state, data: device, error, handlerMap, pending, revisionKey, refreshRevisions } = useDeviceDetail()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [newRevisionOpen, setNewRevisionOpen] = useState(false)

  if (state === "pending") return <LoadingSpinner />
  if (state === "error") return <ErrorMessage error={error} />

  const handleDelete = async () => {
    await handlerMap.handleDelete(device.id)
    navigate("/devices")
  }

  const handleCreateRevision = async (data) => {
    await revisionsApi.create(data)
    refreshRevisions()
  }

  return (
    <div className="h-full flex flex-col overflow-hidden px-6 pt-6">
      <div className="flex-shrink-0 mb-5">
        <BrandLogo />
        <button
          onClick={() => navigate("/devices")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zariadenia
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Karta zariadenia</h1>
            <p className="text-sm text-slate-400 mt-0.5">{device.manufacturer}{device.name ? ` — ${device.name}` : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-1.5" />
              Upraviť
            </Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="w-4 h-4 mr-1.5" />
              Vymazať
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5" onClick={() => setNewRevisionOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Nová revízia
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-5">
        <div className="flex-1 overflow-y-auto pb-6 space-y-4">
          <DeviceInfoCard device={device} />
          <DeviceRevisionsCard deviceId={device.id} revisionKey={revisionKey} onMutated={refreshRevisions} />
        </div>
        <DeviceSidebar device={device} revisionKey={revisionKey} />
      </div>

      <DeviceItemForm
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        initialValues={device}
        onSubmit={handlerMap.handleUpdate}
      />

      <DeviceItemDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        device={device}
        onConfirm={handleDelete}
        isPending={pending.delete}
      />

      <RevisionItemForm
        open={newRevisionOpen}
        onOpenChange={setNewRevisionOpen}
        mode="create"
        deviceId={device.id}
        onSubmit={handleCreateRevision}
      />
    </div>
  )
}

export default function DeviceDetail() {
  const { id } = useParams()
  return (
    <DeviceDetailProvider id={id}>
      <DeviceDetailContent />
    </DeviceDetailProvider>
  )
}
