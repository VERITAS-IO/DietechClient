import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateClientWizard } from "./create-client-wizard";
import { useTranslation } from "react-i18next";

export function CreateClientDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button onClick={() => setOpen(true)} className="shadow-lg hover:shadow-xl transition-shadow">
        <Plus className="mr-2 h-4 w-4" /> {t('client.addNew')}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('client.createNew')}</DialogTitle>
          </DialogHeader>
          <CreateClientWizard onComplete={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}