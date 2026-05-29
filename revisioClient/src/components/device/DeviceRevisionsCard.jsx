import { useState, useEffect } from "react"
import { ChevronRight, CalendarDays } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RevisionDetailModal } from "@/components/revision/RevisionDetailModal"
import { useRevisions } from "@/hooks/useRevisions"
import { formatDate } from "@/lib/format"
import { getRevisionStatus } from "@/lib/status"

function DateCell({ value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <CalendarDays className="w-3.5 h-3.5 text-blue-400 shrink-0" />
      {formatDate(value)}
    </div>
  )
}

export function DeviceRevisionsCard({ deviceId, revisionKey, onMutated }) {
  const [selected, setSelected] = useState(null)
  const { data, isLoading, refetch } = useRevisions({ deviceId })

  useEffect(() => {
    if (revisionKey > 0) refetch()
  }, [revisionKey])

  //sort by date descending, latest revision is active, rest are inactive
  const sorted = [...(data?.revisionList || [])].sort(
    (a, b) => new Date(b.revisionDate) - new Date(a.revisionDate)
  )
  const revisions = sorted.map((r, i) => ({
    ...r,
    status: i === 0 ? (r.status || getRevisionStatus(r.nextRevisionDate)) : "inactive",
  }))

  return (
    <>
      <div className="bg-white/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">História revízií</h3>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Načítava sa...</div>
        ) : revisions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">Zatiaľ žiadne revízie.</div>
        ) : (
          <>
            <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] bg-blue-600 px-6 py-3 text-white text-sm font-semibold sticky top-0 z-10">
              <span>Vykonaná dňa</span>
              <span>Platnosť do</span>
              <span>Posudok</span>
              <span>Status</span>
              <span />
            </div>
            {revisions.map(r => (
              <div
                key={r.id}
                className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] items-center px-6 py-3.5 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors last:border-0"
                onClick={() => setSelected(r)}
              >
                <DateCell value={r.revisionDate} />
                <DateCell value={r.nextRevisionDate} />
                <span className={r.revisionResult ? "text-sm font-semibold text-emerald-600" : "text-sm font-semibold text-rose-600"}>
                  {r.revisionResult ? "Vyhovuje" : "Nevyhovuje"}
                </span>
                <div><StatusBadge status={r.status} /></div>
                <ChevronRight className="w-4 h-4 text-blue-500 ml-4" />
              </div>
            ))}
          </>
        )}
      </div>

      <RevisionDetailModal
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null) }}
        revision={selected}
        onMutated={() => { refetch(); onMutated?.() }}
      />
    </>
  )
}
