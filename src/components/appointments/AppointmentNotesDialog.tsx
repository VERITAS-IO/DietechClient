import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentNotes } from './AppointmentNotes';
import { useTranslation } from 'react-i18next';

interface AppointmentNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
}

export function AppointmentNotesDialog({
  isOpen,
  onClose,
  appointmentId,
}: AppointmentNotesDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t('appointment.notes.title')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
          <AppointmentNotes appointmentId={appointmentId} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}