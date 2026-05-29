import { cn } from "@/lib/utils"

const variants = {
  valid:        { cls: "bg-emerald-50 text-emerald-700", label: "Platná" },
  expiringSoon: { cls: "bg-amber-50 text-amber-700",    label: "Čoskoro" },
  expired:      { cls: "bg-rose-50 text-rose-700",      label: "Vypršané" },
  inactive:     { cls: "bg-slate-100 text-slate-400",                              label: "Neaktívna" },
}

export function StatusBadge({ status }) {
  const v = variants[status] || variants.expired
  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold", v.cls)}>
      {v.label}
    </span>
  )
}
