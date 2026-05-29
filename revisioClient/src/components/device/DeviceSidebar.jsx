import { useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useRevisions } from "@/hooks/useRevisions"
import { getRevisionStatus } from "@/lib/status"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const expiryConfig = {
  valid:        { bg: "bg-emerald-50", text: "text-emerald-700", label: "Platná" },
  expiringSoon: { bg: "bg-amber-50",   text: "text-amber-700",   label: "Čoskoro expiruje" },
  expired:      { bg: "bg-rose-50",    text: "text-rose-700",    label: "Vypršaná" },
}

export function DeviceSidebar({ device, revisionKey }) {
  const { data, refetch } = useRevisions({ deviceId: device.id })

  useEffect(() => {
    if (revisionKey > 0) refetch()
  }, [revisionKey])
  const revisions = data?.revisionList || []

  const latest = revisions.length > 0
    ? revisions.reduce((a, b) => new Date(a.revisionDate) > new Date(b.revisionDate) ? a : b)
    : null

  const expiryStatus = latest ? (latest.status || getRevisionStatus(latest.nextRevisionDate)) : null
  const expiry = expiryStatus ? expiryConfig[expiryStatus] : null
  const passed = latest?.revisionResult

  return (
    <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto pb-6">
      {/* QR kód */}
      <div className="bg-white/80 rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider self-start">QR kód</p>
        <QRCodeSVG value={device.id} size={160} />
        <p className="text-xs text-slate-400 text-center break-all">{device.id}</p>
      </div>

      {/* Stav */}
      {latest ? (
        <div className={cn(
          "rounded-2xl shadow-sm p-5 border",
          passed ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
        )}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Stav</p>

          {/* Hlavný posudok */}
          <p className={cn("text-2xl font-bold mb-3", passed ? "text-emerald-600" : "text-rose-600")}>
            {passed ? "Vyhovuje" : "Nevyhovuje"}
          </p>

          {/* Platnosť */}
          {expiry && (
            <span className={cn("inline-flex items-center px-2.5 py-1 rounded-[6px] text-xs font-semibold mb-4", expiry.bg, expiry.text)}>
              {expiry.label}
            </span>
          )}

          {/* Dátumy */}
          <div className="space-y-1.5 text-xs text-slate-500 border-t border-black/5 pt-3">
            <p>Posl. revízia: <span className="font-semibold text-slate-700">{formatDate(latest.revisionDate)}</span></p>
            <p>Nasl. revízia: <span className="font-semibold text-slate-700">{formatDate(latest.nextRevisionDate)}</span></p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl shadow-sm p-5 border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stav</p>
          <p className="text-sm text-slate-400">Žiadna revízia</p>
        </div>
      )}
    </div>
  )
}
