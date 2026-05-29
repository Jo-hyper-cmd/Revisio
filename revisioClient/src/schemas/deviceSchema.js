import { z } from "zod"

export const KIND_OPTIONS = ["Spotrebič", "Predlžovací prívod"]
export const CABLE_TYPE_OPTIONS = ["Oddeliteľný", "Neoddeliteľný"]
export const PROTECTION_CLASS_OPTIONS = ["I", "II", "III"]
export const USAGE_GROUP_OPTIONS = ["A", "B", "C", "D", "E"]
export const USAGE_CATEGORY_OPTIONS = ["V ruke", "Ostatné"]

export const deviceSchema = z.object({
  kind: z.enum(KIND_OPTIONS, { errorMap: () => ({ message: "Vyberte druh zariadenia." }) }),
  inventoryID: z.string().max(30, "Inventárne číslo môže mať najviac 30 znakov.").optional().or(z.literal("")),
  name: z.string().min(1, "Názov je povinný.").max(150, "Názov môže mať najviac 150 znakov."),
  manufacturer: z.string().min(1, "Výrobca je povinný.").max(100, "Názov výrobcu môže mať najviac 100 znakov."),
  type: z.string().max(100, "Typ môže mať najviac 100 znakov.").optional().or(z.literal("")),
  yearOfManufacture: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Použite formát YYYY-MM-DD.").refine(val => new Date(val) <= new Date(), "Rok výroby nemôže byť v budúcnosti.").optional().or(z.literal("")),
  serialNumber: z.string().min(1, "Sériové číslo je povinné.").max(30, "Sériové číslo môže mať najviac 30 znakov."),
  note: z.string().max(200, "Poznámka môže mať najviac 200 znakov.").optional().or(z.literal("")),
  nominalVoltage: z.coerce.number({ invalid_type_error: "Menovité napätie musí byť číslo." }).min(0, "Menovité napätie nemôže byť záporné."),
  nominalCurrent: z.coerce.number({ invalid_type_error: "Menovitý prúd musí byť číslo." }).min(0, "Menovitý prúd nemôže byť záporný."),
  nominalPower: z.coerce.number({ invalid_type_error: "Menovitý výkon musí byť číslo." }).min(0, "Menovitý výkon nemôže byť záporný."),
  cableType: z.enum(CABLE_TYPE_OPTIONS).optional(),
  cableMaterial: z.string().max(20, "Materiál môže mať najviac 20 znakov.").optional().or(z.literal("")),
  cableLength: z.coerce.number().min(0, "Dĺžka kábla nemôže byť záporná.").optional(),
  cableSection: z.string().max(20, "Prierez môže mať najviac 20 znakov.").optional().or(z.literal("")),
  surgeProtection: z.boolean().default(false),
  protectionClass: z.enum(PROTECTION_CLASS_OPTIONS, { errorMap: () => ({ message: "Vyberte triedu ochrany." }) }),
  usageGroup: z.enum(USAGE_GROUP_OPTIONS, { errorMap: () => ({ message: "Vyberte skupinu používania." }) }),
  usageCategory: z.enum(USAGE_CATEGORY_OPTIONS, { errorMap: () => ({ message: "Vyberte kategóriu používania." }) }),
  mechanicalStrain: z.boolean().default(false),
})

export const DEVICE_DEFAULTS = {
  kind: "Spotrebič",
  inventoryID: "",
  name: "",
  manufacturer: "",
  type: "",
  yearOfManufacture: "",
  serialNumber: "",
  note: "",
  nominalVoltage: 0,
  nominalCurrent: 0,
  nominalPower: 0,
  cableType: "Neoddeliteľný",
  cableMaterial: "",
  cableLength: 0,
  cableSection: "",
  surgeProtection: false,
  protectionClass: "I",
  usageGroup: "E",
  usageCategory: "Ostatné",
  mechanicalStrain: false,
}

export const DEVICE_LABELS = {
  kind: "Druh zariadenia",
  inventoryID: "Inventárne číslo",
  name: "Názov zariadenia",
  manufacturer: "Výrobca",
  type: "Typ / model",
  yearOfManufacture: "Rok výroby",
  serialNumber: "Sériové číslo",
  note: "Poznámka",
  nominalVoltage: "Menovité napätie (V)",
  nominalCurrent: "Menovitý prúd (A)",
  nominalPower: "Menovitý výkon (W)",
  cableType: "Typ prívodu",
  cableMaterial: "Materiál kábla",
  cableLength: "Dĺžka kábla (m)",
  cableSection: "Prierez kábla",
  surgeProtection: "Prepäťová ochrana",
  protectionClass: "Trieda ochrany",
  usageGroup: "Skupina používania",
  usageCategory: "Kategória používania",
  mechanicalStrain: "Mechanické namáhanie",
}
