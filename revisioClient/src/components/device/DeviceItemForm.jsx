import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deviceSchema, DEVICE_DEFAULTS, DEVICE_LABELS, KIND_OPTIONS, CABLE_TYPE_OPTIONS, PROTECTION_CLASS_OPTIONS, USAGE_GROUP_OPTIONS, USAGE_CATEGORY_OPTIONS } from "@/schemas/deviceSchema"
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
            value === opt
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
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

export function DeviceItemForm({ open, onOpenChange, mode = "create", initialValues, onSubmit }) {
  const [formError, setFormError] = useState(null)

  const form = useForm({
    resolver: zodResolver(deviceSchema),
    defaultValues: initialValues || DEVICE_DEFAULTS,
  })

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = form

  const handleOpenChange = (val) => {
    if (!val) { reset(initialValues || DEVICE_DEFAULTS); setFormError(null) }
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
      <DialogContent showCloseButton={false} className="sm:max-w-4xl max-h-[92vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <h2 className="text-2xl font-bold text-blue-600 mx-auto">
            {mode === "edit" ? "Upraviť zariadenie" : "Nové zariadenie"}
          </h2>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="mx-8 mb-2 bg-red-50 border border-red-200 rounded-md px-4 py-2 text-sm text-red-700">{formError}</div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="flex divide-x divide-slate-200 px-8 pb-6 gap-0">

            {/* Left column — Identifikačné údaje */}
            <div className="flex-1 pr-8 space-y-4">
              <div className="flex flex-col items-center gap-1 mb-5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm font-semibold text-blue-600 text-center">Identifikačné údaje</span>
              </div>

              <FormField label={DEVICE_LABELS.kind} error={errors.kind?.message}>
                <ToggleGroup
                  options={KIND_OPTIONS}
                  value={watch("kind")}
                  onChange={v => setValue("kind", v)}
                />
              </FormField>

              <FormField label={DEVICE_LABELS.name} error={errors.name?.message}>
                <Input {...register("name")} />
              </FormField>

              <FormField label={DEVICE_LABELS.manufacturer} error={errors.manufacturer?.message}>
                <Input {...register("manufacturer")} />
              </FormField>

              <FormField label={DEVICE_LABELS.serialNumber} error={errors.serialNumber?.message}>
                <Input {...register("serialNumber")} />
              </FormField>

              <FormField label={DEVICE_LABELS.inventoryID} error={errors.inventoryID?.message}>
                <Input {...register("inventoryID")} />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label={DEVICE_LABELS.type} error={errors.type?.message}>
                  <Input {...register("type")} />
                </FormField>
                <FormField label={DEVICE_LABELS.yearOfManufacture} error={errors.yearOfManufacture?.message}>
                  <Input type="date" {...register("yearOfManufacture")} />
                </FormField>
              </div>

              <FormField label={DEVICE_LABELS.note} error={errors.note?.message}>
                <Input {...register("note")} />
              </FormField>
            </div>

            {/* Right column — Technické parametre */}
            <div className="flex-1 pl-8 space-y-4">
              <div className="flex flex-col items-center gap-1 mb-5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm font-semibold text-blue-600 text-center">Technické parametre</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="Un (V)" error={errors.nominalVoltage?.message}>
                  <Input type="number" step="any" className="font-bold" {...register("nominalVoltage")} />
                </FormField>
                <FormField label="In (A)" error={errors.nominalCurrent?.message}>
                  <Input type="number" step="any" className="font-bold" {...register("nominalCurrent")} />
                </FormField>
                <FormField label="Pn (VA)" error={errors.nominalPower?.message}>
                  <Input type="number" step="any" className="font-bold" {...register("nominalPower")} />
                </FormField>
              </div>

              <div className="border-t border-slate-100 pt-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 shrink-0">{DEVICE_LABELS.cableType}:</span>
                <ToggleGroup
                  className="w-56"
                  options={CABLE_TYPE_OPTIONS}
                  value={watch("cableType")}
                  onChange={v => setValue("cableType", v)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="Dĺžka (m)" error={errors.cableLength?.message}>
                  <Input type="number" step="any" className="font-bold" {...register("cableLength")} />
                </FormField>
                <FormField label="Materiál" error={errors.cableMaterial?.message}>
                  <Input className="font-bold" {...register("cableMaterial")} />
                </FormField>
                <FormField label="Prierez (mm²)" error={errors.cableSection?.message}>
                  <Input className="font-bold" {...register("cableSection")} />
                </FormField>
              </div>

              <div className="border-t border-slate-100 pt-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 shrink-0">{DEVICE_LABELS.protectionClass}:</span>
                <ToggleGroup className="w-56" options={PROTECTION_CLASS_OPTIONS} value={watch("protectionClass")} onChange={v => setValue("protectionClass", v)} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 shrink-0">{DEVICE_LABELS.surgeProtection}:</span>
                <ToggleGroup className="w-56" options={["true", "false"]} value={String(watch("surgeProtection"))} onChange={v => setValue("surgeProtection", v === "true")} labels={{ true: "Áno", false: "Nie" }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 shrink-0">{DEVICE_LABELS.usageGroup}:</span>
                <ToggleGroup className="w-56" options={USAGE_GROUP_OPTIONS} value={watch("usageGroup")} onChange={v => setValue("usageGroup", v)} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 shrink-0">{DEVICE_LABELS.usageCategory}:</span>
                <ToggleGroup className="w-56" options={USAGE_CATEGORY_OPTIONS} value={watch("usageCategory")} onChange={v => setValue("usageCategory", v)} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 shrink-0">{DEVICE_LABELS.mechanicalStrain}:</span>
                <ToggleGroup className="w-56" options={["true", "false"]} value={String(watch("mechanicalStrain"))} onChange={v => setValue("mechanicalStrain", v === "true")} labels={{ true: "Áno", false: "Nie" }} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 px-8 pb-7 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" className="w-40 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenChange(false)}>
              Zrušiť
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-40 bg-blue-600 hover:bg-blue-700 text-white">
              {mode === "edit" ? "Uložiť zmeny" : "Vytvoriť záznam"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
