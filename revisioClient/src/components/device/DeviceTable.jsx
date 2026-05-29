import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

const HEADERS = ["Zariadenie", "Inventárne č.", "Sériové č.", "Trieda", "Skupina", "Druh", ""]
const COLS = "grid-cols-[2fr_1.2fr_1.5fr_0.8fr_0.8fr_1fr_auto]"

export function DeviceTable({ devices }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white/80 rounded-2xl shadow-sm">
      <div className={`grid ${COLS} bg-blue-600 px-6 py-3 text-white text-sm font-semibold sticky top-0 z-10 rounded-t-2xl`}>
        {HEADERS.map((h, i) => <span key={i}>{h}</span>)}
      </div>

      {devices.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Žiadne zariadenia zodpovedajúce filtru.
        </div>
      ) : (
        devices.map((device) => (
          <div
            key={device.id}
            className={`grid ${COLS} items-center px-6 py-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors last:border-0`}
            onClick={() => navigate(`/devices/${device.id}`)}
          >
            <div>
              <p className="text-sm font-medium text-slate-800">{device.name}</p>
              <p className="text-xs text-slate-400">{device.manufacturer}</p>
            </div>
            <span className="text-sm text-slate-600">{device.inventoryID || "—"}</span>
            <span className="text-sm text-slate-600">{device.serialNumber}</span>
            <span className="text-sm text-slate-600">{device.protectionClass}</span>
            <span className="text-sm text-slate-600">{device.usageGroup}</span>
            <span className="text-sm text-slate-600">{device.kind}</span>
            <ChevronRight className="w-4 h-4 text-blue-500 ml-4" />
          </div>
        ))
      )}
    </div>
  )
}
