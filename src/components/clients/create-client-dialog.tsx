import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateClientWizard } from "./create-client-wizard";

export function CreateClientDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="shadow-lg hover:shadow-xl transition-shadow">
        <Plus className="mr-2 h-4 w-4" /> Add New Client
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
          </DialogHeader>
          <CreateClientWizard onComplete={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}