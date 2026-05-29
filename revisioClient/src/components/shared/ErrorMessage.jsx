export function ErrorMessage({ error }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-red-600">Chyba pri načítaní: {error?.message || "Nastala neočakávaná chyba."}</p>
    </div>
  )
}
