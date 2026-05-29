import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revisionSchema, REVISION_DEFAULTS, REVISION_LABELS } from "@/schemas/revisionSchema"
import { translateError } from "@/lib/errors"
import { cn } from "@/lib/utils"

function ToggleGroup({ options, value, onChange, labels, className }) {
  return (
    <div className={cn("flex items-center gap-1 bg-slate-100 rounded-xl p-1", className)}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            value === opt ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          {labels ? labels[opt] : opt}
        </button>
      ))}
    </div>
  )
}

function FieldError({ message }) {
  if (!message) return null
  return <p className="text-xs text-red-600 mt-1">{message}</p>
}

function FormField({ label, error, children }) {
  return (
    <div>
      <Label className="text-xs text-slate-500 mb-1 block">{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

export function RevisionItemForm({ open, onOpenChange, mode = "create", initialValues, deviceId, onSubmit }) {
  const [formError, setFormError] = useState(null)

  const defaults = {
    ...(initialValues || REVISION_DEFAULTS),
    deviceId: deviceId || initialValues?.deviceId || "",
  }

  const form = useForm({
    resolver: zodResolver(revisionSchema),
    defaultValues: defaults,
  })

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = form

  const handleOpenChange = (val) => {
    if (!val) { reset(defaults); setFormError(null) }
    onOpenChange(val)
  }

  const onFormSubmit = async (values) => {
    try {
      setFormError(null)
      await onSubmit(mode === "edit" ? { ...values, id: initialValues.id } : values)
      handleOpenChange(false)
    } catch (err) {
      setFormError(translateError(err?.response?.data?.code))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-0">
        <div className="flex items-center px-8 pt-7 pb-4">
          <h2 className="text-2xl font-bold text-blue-600 mx-auto">
            {mode === "edit" ? "Upraviť revíziu" : "Nová revízia"}
          </h2>
          <button type="button" onClick={() => handleOpenChange(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="mx-8 mb-2 bg-red-50 border border-red-200 rounded-md px-4 py-2 text-sm text-red-700">{formError}</div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-8 pb-6 space-y-4">
          <input type="hidden" {...register("deviceId")} />

          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-2">Dátumy revízie</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={REVISION_LABELS.revisionDate} error={errors.revisionDate?.message}>
              <Input type="date" {...register("revisionDate")} />
            </FormField>
            <FormField label={REVISION_LABELS.nextRevisionDate} error={errors.nextRevisionDate?.message}>
              <Input type="date" {...register("nextRevisionDate")} />
            </FormField>
          </div>

          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-2">Namerané hodnoty</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField label={REVISION_LABELS.insulationResistance} error={errors.insulationResistance?.message}>
              <Input type="number" step="any" {...register("insulationResistance")} />
            </FormField>
            <FormField label={REVISION_LABELS.groundingResistance} error={errors.groundingResistance?.message}>
              <Input type="number" step="any" {...register("groundingResistance")} />
            </FormField>
            <FormField label={REVISION_LABELS.leakingCurrent} error={errors.leakingCurrent?.message}>
              <Input type="number" step="any" {...register("leakingCurrent")} />
            </FormField>
          </div>

          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-2">Skúšky</h3>
          <div className="space-y-3">
            {[
              { field: "runningTest", label: REVISION_LABELS.runningTest },
              { field: "visualTest", label: REVISION_LABELS.visualTest },
              { field: "revisionResult", label: REVISION_LABELS.revisionResult },
            ].map(({ field, label }) => (
              <div key={field} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{label}:</span>
                <ToggleGroup
                  className="w-40"
                  options={["true", "false"]}
                  value={String(watch(field))}
                  onChange={v => setValue(field, v === "true")}
                  labels={{ true: "Áno", false: "Nie" }}
                />
                <FieldError message={errors[field]?.message} />
              </div>
            ))}
          </div>

          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-2">Údaje technika</h3>
          <FormField label={REVISION_LABELS.technicianName} error={errors.technicianName?.message}>
            <Input {...register("technicianName")} />
          </FormField>
          <FormField label={REVISION_LABELS.technicianCertificate} error={errors.technicianCertificate?.message}>
            <Input {...register("technicianCertificate")} />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenChange(false)}>Zrušiť</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {mode === "edit" ? "Uložiť zmeny" : "Vytvoriť záznam"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
