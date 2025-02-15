import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { NoteType, GetAppointmentResponse } from '@/types/appointment';

interface AppointmentNoteCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  appointments: GetAppointmentResponse[];
  selectedAppointmentId: string | null;
  onAppointmentChange: (appointmentId: string) => void;
  noteText: string;
  onNoteTextChange: (text: string) => void;
  noteType: NoteType;
  onNoteTypeChange: (type: NoteType) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export function AppointmentNoteCreateDialog({
  isOpen,
  onOpenChange,
  appointments,
  selectedAppointmentId,
  onAppointmentChange,
  noteText,
  onNoteTextChange,
  noteType,
  onNoteTypeChange,
  onSubmit,
  isLoading,
}: AppointmentNoteCreateDialogProps) {
  const { t } = useTranslation();

  const handleSubmit = useCallback(async () => {
    await onSubmit();
  }, [onSubmit]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('appointment.notes.add')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label>{t('appointment.select')}</label>
            <Select
              value={selectedAppointmentId ?? ''}
              onValueChange={onAppointmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('appointment.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {appointments.map((appointment) => (
                  <SelectItem key={appointment.id} value={appointment.id.toString()}>
                    {`${appointment.clientName} - ${new Date(appointment.start).toLocaleDateString()}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label>{t('appointment.notes.type')}</label>
            <Select
              value={noteType.toString()}
              onValueChange={(value) => onNoteTypeChange(Number(value) as NoteType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NoteType.PreAppointment.toString()}>
                  {t('appointment.notes.types.pre')}
                </SelectItem>
                <SelectItem value={NoteType.DuringAppointment.toString()}>
                  {t('appointment.notes.types.during')}
                </SelectItem>
                <SelectItem value={NoteType.AfterAppointment.toString()}>
                  {t('appointment.notes.types.after')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label>{t('appointment.notes.content')}</label>
            <Textarea
              value={noteText}
              onChange={(e) => onNoteTextChange(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !selectedAppointmentId}
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
