import { StatCard } from "./StatCard"

export function StatsGrid({ revisions }) {
  const total = revisions.length
  const valid = revisions.filter(r => r.status === "valid").length
  const expiringSoon = revisions.filter(r => r.status === "expiringSoon").length
  const expired = revisions.filter(r => r.status === "expired").length

  return (
    <div className="flex gap-4 mb-6">
      <StatCard label="Celkovo:" value={total} numberColor="text-blue-600" />
      <StatCard label="Platné:" value={valid} numberColor="text-emerald-600" />
      <StatCard label="Čoskoro:" value={expiringSoon} numberColor="text-amber-500" />
      <StatCard label="Vypršané:" value={expired} numberColor="text-rose-600" />
    </div>
  )
}
