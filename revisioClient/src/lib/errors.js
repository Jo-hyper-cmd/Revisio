export const errorMessages = {
  inputDataIsNotValid: "Vstupné údaje sú neplatné.",
  yearOfManufactureInFuture: "Rok výroby nemôže byť v budúcnosti.",
  serialNumberAlreadyExists: "Zariadenie s týmto sériovým číslom už existuje.",
  inventoryIDAlreadyExists: "Zariadenie s týmto inventárnym číslom už existuje.",
  deviceNotFound: "Zariadenie sa nenašlo.",
  revisionDateInFuture: "Dátum revízie nemôže byť v budúcnosti.",
  nextRevisionDateNotInFuture: "Dátum ďalšej revízie musí byť v budúcnosti.",
  nextRevisionDateBeforeRevisionDate: "Dátum ďalšej revízie musí byť po dátume revízie.",
  inconsistentRevisionResult: "Celkový výsledok nemôže byť kladný, ak niektorá skúška neprešla.",
  deviceDoesNotExist: "Zariadenie s týmto ID neexistuje.",
  revisionNotFound: "Revízny záznam sa nenašiel.",
}

export function translateError(code) {
  return errorMessages[code] || "Nastala neočakávaná chyba."
}