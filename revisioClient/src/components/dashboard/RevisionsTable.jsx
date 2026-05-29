import { useState } from "react"
import { ChevronRight, CalendarDays } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RevisionDetailModal } from "@/components/revision/RevisionDetailModal"
import { formatDate } from "@/lib/format"

function DateCell({ value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <CalendarDays className="w-3.5 h-3.5 text-blue-400 shrink-0" />
      {formatDate(value)}
    </div>
  )
}

export function RevisionsTable({ revisions, onMutated }) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className="bg-white/80 rounded-2xl shadow-sm">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] bg-blue-600 px-6 py-3 text-white text-sm font-semibold sticky top-0 z-10 rounded-t-2xl">
          <span>Zariadenie</span>
          <span>Vykonaná dňa</span>
          <span>Platnosť do</span>
          <span>Status</span>
          <span />
        </div>

        {revisions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Žiadne revízie zodpovedajúce filtru.
          </div>
        ) : (
          revisions.map((revision) => (
            <div
              key={revision.id}
              className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] items-center px-6 py-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors last:border-0"
              onClick={() => setSelected(revision)}
            >
              <span className="text-sm font-medium text-slate-800">{revision.deviceName}</span>
              <DateCell value={revision.revisionDate} />
              <DateCell value={revision.nextRevisionDate} />
              <div><StatusBadge status={revision.status} /></div>
              <ChevronRight className="w-4 h-4 text-blue-500 ml-4" />
            </div>
          ))
        )}
      </div>

      <RevisionDetailModal
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null) }}
        revision={selected}
        onMutated={() => { setSelected(null); onMutated?.() }}
      />
    </>
  )
}
