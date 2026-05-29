import { z } from "zod"

export const revisionSchema = z.object({
  deviceId: z.string().min(1, "ID zariadenia je povinné."),
  revisionDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Použite formát YYYY-MM-DD.")
    .refine(val => new Date(val) <= new Date(), "Dátum revízie nemôže byť v budúcnosti."),
  nextRevisionDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Použite formát YYYY-MM-DD.")
    .refine(val => new Date(val) > new Date(), "Dátum ďalšej revízie musí byť v budúcnosti."),
  insulationResistance: z.coerce.number().min(0, "Hodnota nemôže byť záporná."),
  groundingResistance: z.coerce.number().min(0, "Hodnota nemôže byť záporná."),
  leakingCurrent: z.coerce.number().min(0, "Hodnota nemôže byť záporná."),
  runningTest: z.boolean(),
  visualTest: z.boolean(),
  revisionResult: z.boolean(),
  technicianName: z.string().min(1, "Meno technika je povinné.").max(150),
  technicianCertificate: z.string().min(1, "Číslo osvedčenia je povinné.").max(150),
})
.refine(data => new Date(data.nextRevisionDate) > new Date(data.revisionDate), {
  message: "Dátum ďalšej revízie musí byť po dátume revízie.",
  path: ["nextRevisionDate"],
})
.refine(data => !data.revisionResult || (data.runningTest && data.visualTest), {
  message: "Celkový výsledok nemôže byť kladný, ak skúška chodu alebo vizuálna skúška neprešla.",
  path: ["revisionResult"],
})

export const REVISION_DEFAULTS = {
  deviceId: "",
  revisionDate: new Date().toISOString().split("T")[0],
  nextRevisionDate: "",
  insulationResistance: 0,
  groundingResistance: 0,
  leakingCurrent: 0,
  runningTest: true,
  visualTest: true,
  revisionResult: true,
  technicianName: "",
  technicianCertificate: "",
}

export const REVISION_LABELS = {
  revisionDate: "Dátum revízie",
  nextRevisionDate: "Dátum ďalšej revízie",
  insulationResistance: "Izolačný odpor (MΩ)",
  groundingResistance: "Odpor PE vodiča (Ω)",
  leakingCurrent: "Unikajúci prúd (mA)",
  runningTest: "Skúška chodu",
  visualTest: "Vizuálna skúška",
  revisionResult: "Celkový výsledok",
  technicianName: "Meno technika",
  technicianCertificate: "Číslo osvedčenia",
}
