import { cn } from "@/lib/utils"

const tabs = [
  { key: "all", label: "Celkovo" },
  { key: "valid", label: "Platné" },
  { key: "expiringSoon", label: "Čoskoro" },
  { key: "expired", label: "Vypršané" },
]

export function FilterTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-slate-200 rounded-[8px] px-1.5 py-1.5">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "px-4 py-1 rounded-[6px] text-sm font-medium transition-colors",
            active === key
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
