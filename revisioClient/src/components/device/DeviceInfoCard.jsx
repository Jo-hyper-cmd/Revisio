import { formatDate } from "@/lib/format"

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value ?? "—"}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white/80 rounded-2xl shadow-sm p-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
        {title}
      </h3>
      {children}
    </div>
  )
}

function ParamCard({ label, value, unit }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 text-center">
      <p className="text-xs text-slate-400 mb-3">{label}</p>
      <p className="text-3xl font-bold text-slate-800">
        {value ?? "—"}
        {value != null && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
      </p>
    </div>
  )
}

export function DeviceInfoCard({ device }) {
  return (
    <div className="space-y-4">
      <Section title="Identifikácia zariadenia">
        <div className="grid grid-cols-3 gap-x-6 gap-y-5">
          <Field label="Druh zariadenia" value={device.kind} />
          <Field label="Názov, výrobca" value={device.name && device.manufacturer ? `${device.name}, ${device.manufacturer}` : device.name} />
          <Field label="Inventárne číslo" value={device.inventoryID} />
          <Field label="Typ / model" value={device.type} />
          <Field label="Výrobné číslo" value={device.serialNumber} />
          <Field label="Rok výroby" value={device.yearOfManufacture ? formatDate(device.yearOfManufacture) : null} />
          {device.note && <div className="col-span-3"><Field label="Poznámka" value={device.note} /></div>}
        </div>
      </Section>

      <Section title="Parametre zariadenia">
        <div className="grid grid-cols-3 gap-3">
          <ParamCard label="Menovité napätie Uₙ" value={device.nominalVoltage} unit="V" />
          <ParamCard label="Menovitý prúd Iₙ" value={device.nominalCurrent} unit="A" />
          <ParamCard label="Menovitý výkon Pₙ" value={device.nominalPower} unit="VA" />
        </div>
      </Section>

      <Section title="Sieťový prívod">
        <div className="grid grid-cols-5 gap-x-6">
          <Field label="Typ" value={device.cableType} />
          <Field label="Materiál" value={device.cableMaterial} />
          <Field label="Dĺžka" value={device.cableLength != null ? `${device.cableLength} m` : null} />
          <Field label="Prierez" value={device.cableSection} />
          <Field label="Prepäťová ochr." value={device.surgeProtection ? "Áno" : "Nie"} />
        </div>
      </Section>

      <Section title="Zaradenie zariadenia">
        <div className="grid grid-cols-3 gap-x-6">
          <Field label="Kategória použitia" value={device.usageCategory} />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Skupina</p>
            <p className="text-3xl font-bold text-blue-600">{device.usageGroup ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Trieda ochrany</p>
            <p className="text-3xl font-bold text-blue-600">{device.protectionClass ?? "—"}</p>
          </div>
        </div>
      </Section>
    </div>
  )
}
