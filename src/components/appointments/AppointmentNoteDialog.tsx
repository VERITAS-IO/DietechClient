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
import { NoteType, GetAppointmentNoteResponse } from '@/types/appointment';

interface AppointmentNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNote: GetAppointmentNoteResponse | null;
  noteText: string;
  onNoteTextChange: (text: string) => void;
  noteType: NoteType;
  onNoteTypeChange: (type: NoteType) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export function AppointmentNoteDialog({
  isOpen,
  onOpenChange,
  selectedNote,
  noteText,
  onNoteTextChange,
  noteType,
  onNoteTypeChange,
  onSubmit,
  isLoading,
}: AppointmentNoteDialogProps) {
  const { t } = useTranslation();

  const handleSubmit = useCallback(async () => {
    await onSubmit();
  }, [onSubmit]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedNote
              ? t('appointment.notes.edit')
              : t('appointment.notes.add')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
                  {t(`appointment.notes.types.${NoteType.PreAppointment}`)}
                </SelectItem>
                <SelectItem value={NoteType.DuringAppointment.toString()}>
                  {t(`appointment.notes.types.${NoteType.DuringAppointment}`)}
                </SelectItem>
                <SelectItem value={NoteType.AfterAppointment.toString()}>
                  {t(`appointment.notes.types.${NoteType.AfterAppointment}`)}
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
            <Button onClick={handleSubmit} disabled={isLoading}>
              {selectedNote ? t('common.update') : t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}