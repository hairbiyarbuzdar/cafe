"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSupplierAction } from "@/lib/actions/suppliers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Fired after a successful save. The caller decides what to do with
   * the new supplier — typically the New Item sheet auto-selects it
   * so the operator doesn't have to re-open the dropdown.
   */
  onCreated?: (supplier: { id: string; name: string }) => void;
};

/**
 * Inline supplier creator. Opened from the New Item sheet's supplier
 * dropdown so the operator never has to leave the half-filled item
 * form to register a new supplier first. Three fields by design:
 *
 *   • name      — required, unique-ish identifier on receipts + POs
 *   • address   — optional, used on the printed slip
 *   • phone     — optional, used on the printed slip
 *
 * After save we trigger a `router.refresh()` so the parent page
 * (Inventory) re-fetches the supplier list; the `onCreated` callback
 * also receives the new row immediately so the caller can patch its
 * local state without waiting for the refresh round-trip.
 */
export function CreateSupplierDialog({ open, onOpenChange, onCreated }: Props) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName("");
      setAddress("");
      setPhone("");
    }
  }, [open]);

  const canSave = name.trim().length > 1 && !submitting;

  async function save() {
    if (!canSave) return;
    setSubmitting(true);
    try {
      const result = await createSupplierAction({
        name: name.trim(),
        address: address.trim() || null,
        phone: phone.trim() || null,
      });
      if (!result.ok) {
        toast.error("Couldn't add supplier", { description: result.error });
        return;
      }
      toast.success(`${result.name} added`);
      onCreated?.({ id: result.id, name: result.name });
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-3 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            New supplier
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Add a vendor so inventory items can credit their purchases
            back to them. Phone + address print on restock slips.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 pb-1">
          <div className="space-y-1.5">
            <Label htmlFor="sup-name" className="text-[12px] font-medium">
              Name
            </Label>
            <Input
              id="sup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Karachi Coffee Co."
              maxLength={80}
              className="h-10"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sup-phone" className="text-[12px] font-medium">
              Phone
            </Label>
            <Input
              id="sup-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              inputMode="tel"
              maxLength={32}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sup-address" className="text-[12px] font-medium">
              Address
            </Label>
            <Textarea
              id="sup-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop 14, Block 2, Clifton, Karachi"
              rows={2}
              maxLength={240}
              className="text-[13px]"
            />
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={save}
            disabled={!canSave}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Plus className="size-3.5" />
                Add supplier
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
