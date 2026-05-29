import { format } from "date-fns"
import { sk } from "date-fns/locale"

export function formatDate(dateString) {
  if (!dateString) return "—"
  return format(new Date(dateString), "dd.MM.yyyy", { locale: sk })
}
