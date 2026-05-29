import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DeviceItemDeleteDialog({ open, onOpenChange, device, onConfirm, isPending }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vymazať zariadenie?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-600">
          Táto akcia je nenávratná. Zariadenie <span className="font-semibold text-slate-800">"{device?.name}"</span> a všetky jeho revízie budú trvalo vymazané.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Zrušiť</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} disabled={isPending}>
            Vymazať
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
