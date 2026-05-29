import { differenceInDays } from "date-fns"

export function getRevisionStatus(nextRevisionDate) {
  const days = differenceInDays(new Date(nextRevisionDate), new Date())
  if (days < 0) return "expired"
  if (days <= 30) return "expiringSoon"
  return "valid"
}
