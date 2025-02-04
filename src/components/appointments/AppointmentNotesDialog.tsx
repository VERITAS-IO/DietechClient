import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('appointment.notes.title')}</DialogTitle>
        </DialogHeader>
        <AppointmentNotes appointmentId={appointmentId} />
      </DialogContent>
    </Dialog>
  );
}