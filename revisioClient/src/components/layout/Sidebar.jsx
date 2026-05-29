import { NavLink } from "react-router-dom"
import { LayoutGrid, Tv2, ScanLine } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", icon: LayoutGrid, label: "Prehľad", end: true },
  { to: "/devices", icon: Tv2, label: "Zariadenia" },
  { to: "/scan", icon: ScanLine, label: "Scan" },
]

export function Sidebar() {
  return (
    <aside className="fixed left-3 top-3 bottom-3 w-20 bg-white rounded-2xl shadow-lg flex flex-col items-center py-5 gap-1 z-10">
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 w-14 py-2 rounded-lg text-xs font-medium transition-colors",
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </aside>
  )
}
