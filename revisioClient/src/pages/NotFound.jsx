import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <p className="text-6xl font-bold text-slate-300">404</p>
      <p className="text-xl font-semibold text-slate-700">Stránka sa nenašla</p>
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        Späť na prehľad
      </Link>
    </div>
  )
}