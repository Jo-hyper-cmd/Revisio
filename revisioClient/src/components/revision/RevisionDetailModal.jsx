import { useState } from "react"
import { Pencil, Trash2, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RevisionItemForm } from "./RevisionItemForm"
import { RevisionItemDeleteDialog } from "./RevisionItemDeleteDialog"
import { revisionsApi } from "@/api/revisions"
import { formatDate } from "@/lib/format"
import { getRevisionStatus } from "@/lib/status"

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value ?? "—"}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function RevisionDetailModal({ open, onOpenChange, revision, onMutated }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!revision) return null

  const status = revision.status || getRevisionStatus(revision.nextRevisionDate)

  const handleUpdate = async (values) => {
    //update revision and close form
    await revisionsApi.update(values)
    setEditOpen(false)
    onMutated?.()
  }

  const handleDelete = async () => {
    //delete revision and close modal
    setIsDeleting(true)
    try {
      await revisionsApi.delete(revision.id)
      setDeleteOpen(false)
      onOpenChange(false)
      onMutated?.()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Revízia</p>
              <h2 className="text-xl font-bold text-slate-800">{formatDate(revision.revisionDate)}</h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setEditOpen(true)}>
                <Pencil className="w-4 h-4 mr-1.5" />
                Upraviť
              </Button>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="w-4 h-4 mr-1.5" />
                Vymazať
              </Button>
              <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-700 transition-colors ml-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            <Section title="Dátumy revízie">
              <div className="grid grid-cols-2 gap-6">
                <Field label="Dátum revízie" value={formatDate(revision.revisionDate)} />
                <Field label="Dátum ďalšej revízie" value={formatDate(revision.nextRevisionDate)} />
              </div>
            </Section>

            <Section title="Namerané hodnoty">
              <div className="grid grid-cols-3 gap-6">
                <Field label="Izolačný odpor (MΩ)" value={revision.insulationResistance} />
                <Field label="Odpor PE vodiča (Ω)" value={revision.groundingResistance} />
                <Field label="Unikajúci prúd (mA)" value={revision.leakingCurrent} />
              </div>
            </Section>

            <Section title="Skúšky">
              <div className="grid grid-cols-3 gap-6">
                <Field label="Skúška chodu" value={revision.runningTest ? "Vyhovuje" : "Nevyhovuje"} />
                <Field label="Vizuálna skúška" value={revision.visualTest ? "Vyhovuje" : "Nevyhovuje"} />
                <Field label="Celkový výsledok" value={revision.revisionResult ? "Vyhovuje" : "Nevyhovuje"} />
              </div>
            </Section>

            <Section title="Údaje technika">
              <div className="grid grid-cols-2 gap-6">
                <Field label="Meno technika" value={revision.technicianName} />
                <Field label="Číslo osvedčenia" value={revision.technicianCertificate} />
              </div>
            </Section>
          </div>
        </DialogContent>
      </Dialog>

      <RevisionItemForm
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        initialValues={revision}
        onSubmit={handleUpdate}
      />

      <RevisionItemDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </>
  )
}
