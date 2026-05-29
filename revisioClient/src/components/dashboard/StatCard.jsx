import { cn } from "@/lib/utils"

export function StatCard({ label, value, numberColor, className }) {
  return (
    <div className={cn("w-44 bg-white/80 rounded-2xl px-5 py-4 flex flex-col gap-1.5 shadow-sm shrink-0", className)}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={cn("text-4xl font-bold", numberColor)}>{value}</p>
    </div>
  )
}
