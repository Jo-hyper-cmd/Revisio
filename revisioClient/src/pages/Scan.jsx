import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Html5Qrcode } from "html5-qrcode"
import { QrCode, RefreshCw, StopCircle, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { devicesApi } from "@/api/devices"
import { BrandLogo } from "@/components/shared/BrandLogo"

const READER_ID = "qr-reader"

export default function Scan() {
  const navigate = useNavigate()
  const scannerRef = useRef(null)
  const mountedRef = useRef(true)
  const [status, setStatus] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const stopScanner = async () => {
    const scanner = scannerRef.current
    if (!scanner) return
    scannerRef.current = null
    try { await scanner.stop() } catch (_) {}
    try { scanner.clear() } catch (_) {}
  }

  const startScanner = async () => {
    setStatus("scanning")
    setErrorMsg("")
    await stopScanner()
    try {
      const scanner = new Html5Qrcode(READER_ID)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        async (decodedText) => {
          if (!mountedRef.current) return
          setStatus("loading")
          await stopScanner()
          try {
            await devicesApi.get(decodedText)
            if (mountedRef.current) navigate(`/devices/${decodedText}`)
          } catch {
            if (mountedRef.current) setStatus("notFound")
          }
        },
        () => {}
      )
    } catch {
      if (!mountedRef.current) return
      setStatus("error")
      setErrorMsg("Nepodarilo sa spustiť kameru. Skontrolujte povolenia prehliadača.")
    }
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      const scanner = scannerRef.current
      if (!scanner) return
      scannerRef.current = null
      scanner.stop().catch(() => {}).finally(() => { try { scanner.clear() } catch (_) {} })
    }
  }, [])

  const isScanning = status === "scanning"

  return (
    <div className="h-full flex flex-col overflow-hidden px-6 pt-6">
      {/* Fixný header */}
      <div className="flex-shrink-0 mb-6">
        <BrandLogo />
        <h1 className="text-2xl font-bold text-blue-600">Skenovanie QR kódu</h1>
        <p className="text-sm text-slate-500 mt-1">Nasmerujte kameru na QR kód zariadenia</p>
      </div>

      <div className="flex-1 flex items-start justify-center overflow-y-auto pb-6">
        <div className="bg-white/80 rounded-2xl shadow-sm p-10 w-[440px] flex flex-col items-center gap-6">

          <h2 className="text-xl font-bold text-blue-600 text-center">Identifikácia zariadenia</h2>

          <p className="text-sm text-slate-500 text-center -mt-1">
            {isScanning ? "Nasmerujte QR kód do rámčeka" : "Stlačte tlačidlo pre spustenie kamery"}
          </p>

          <div className={[
            "relative rounded-2xl border-2 flex items-center justify-center overflow-hidden w-80 h-80",
            isScanning ? "border-blue-500" :
            status === "notFound" ? "border-rose-300 bg-rose-50/40" :
            status === "error" ? "border-amber-300 bg-amber-50/40" :
            "border-blue-200 bg-blue-50/40",
          ].join(" ")}>
            {status === "idle" && <QrCode className="w-24 h-24 text-blue-300" strokeWidth={1.2} />}
            {status === "loading" && (
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            )}
            {status === "notFound" && (
              <div className="flex flex-col items-center gap-3">
                <XCircle className="w-20 h-20 text-rose-400" strokeWidth={1.2} />
                <p className="text-sm font-semibold text-rose-600">Zariadenie sa nenašlo</p>
              </div>
            )}
            {status === "error" && (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <AlertTriangle className="w-20 h-20 text-amber-400" strokeWidth={1.2} />
                <p className="text-sm font-semibold text-amber-700">{errorMsg}</p>
              </div>
            )}
            <div id={READER_ID} className={`absolute inset-0 ${isScanning ? "block" : "hidden"}`} />
          </div>

          <p className="text-sm text-slate-400 text-center h-5">
            {isScanning && "Prebieha skenovanie..."}
            {status === "loading" && "Overujem zariadenie..."}
          </p>

          {status === "idle" && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11" onClick={startScanner}>
              Začať skenovanie
            </Button>
          )}
          {status === "notFound" && (
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white h-11" onClick={startScanner}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Skúsiť znova
            </Button>
          )}
          {status === "error" && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11" onClick={startScanner}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Skúsiť znova
            </Button>
          )}
          {isScanning && (
            <Button variant="outline" className="w-full border-slate-200 text-slate-600" onClick={async () => { await stopScanner(); setStatus("idle") }}>
              <StopCircle className="w-4 h-4 mr-2" />
              Zastaviť
            </Button>
          )}
        </div>
      </div>

      <style>{`
        #qr-reader__dashboard { display: none !important; }
        #qr-reader__status_span { display: none !important; }
        #qr-reader > img { display: none !important; }
        #qr-reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
      `}</style>
    </div>
  )
}
