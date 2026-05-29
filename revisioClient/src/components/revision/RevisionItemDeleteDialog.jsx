import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function RevisionItemDeleteDialog({ open, onOpenChange, onConfirm, isPending }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vymazať revíziu?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-600">
          Táto akcia je nenávratná. Revízny záznam bude trvalo vymazaný.
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
