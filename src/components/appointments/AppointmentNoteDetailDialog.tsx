import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Pencil, Trash2 } from 'lucide-react';
import { NoteType } from '@/types/appointment';
import { useAppointmentNoteStore } from '@/stores/appointment-note-store';
import { useAppointments } from '@/hooks/appointment-hooks';

export function AppointmentNoteDetailDialog() {
  const { t } = useTranslation();
  const selectedNote = useAppointmentNoteStore((state) => state.selectedNote);
  const isOpen = useAppointmentNoteStore((state) => state.isDetailModalOpen);
  const setIsOpen = useAppointmentNoteStore((state) => state.setDetailModalOpen);
  const setIsDeleteModalOpen = useAppointmentNoteStore((state) => state.setDeleteModalOpen);
  const setCreateModalOpen = useAppointmentNoteStore((state) => state.setCreateModalOpen);
  
  // Get appointments to display appointment info
  const { appointments } = useAppointments();
  const [appointmentInfo, setAppointmentInfo] = useState<string>('');

  useEffect(() => {
    if (selectedNote && appointments.length > 0) {
      const appointment = appointments.find(a => a.id === selectedNote.appointmentId);
      if (appointment) {
        try {
          const date = new Date(appointment.start);
          let formattedDate = t('common.invalidDate');
          
          if (!isNaN(date.getTime())) {
            formattedDate = format(date, 'dd/MM/yyyy HH:mm');
          }
          
          setAppointmentInfo(`${appointment.clientName} - ${formattedDate}`);
        } catch (err) {
          console.error('Date formatting error:', err);
          setAppointmentInfo(`${appointment.clientName} - ${t('common.invalidDate')}`);
        }
      } else {
        setAppointmentInfo(t('appointment.notes.appointmentNotFound'));
      }
    }
  }, [selectedNote, appointments, t]);

  const handleEdit = () => {
    setIsOpen(false);
    setCreateModalOpen(true);
  };

  const handleDelete = () => {
    setIsOpen(false);
    setIsDeleteModalOpen(true);
  };

  const getNoteTypeLabel = (noteType?: NoteType) => {
    if (!noteType) return '';
    return t(`appointment.notes.types.${noteType}`);
  };

  const getNoteTypeBadge = (noteType?: NoteType) => {
    if (!noteType) return null;
    
    switch (noteType) {
      case NoteType.PreAppointment:
        return <Badge className="bg-blue-100 text-blue-800">{getNoteTypeLabel(noteType)}</Badge>;
      case NoteType.DuringAppointment:
        return <Badge className="bg-green-100 text-green-800">{getNoteTypeLabel(noteType)}</Badge>;
      case NoteType.AfterAppointment:
        return <Badge className="bg-amber-100 text-amber-800">{getNoteTypeLabel(noteType)}</Badge>;
      default:
        return <Badge variant="secondary">{getNoteTypeLabel(noteType)}</Badge>;
    }
  };

  if (!selectedNote) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('appointment.notes.detail.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t('appointment.label')}
            </h4>
            <p className="text-sm">{appointmentInfo}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t('appointment.notes.type')}
            </h4>
            <div>
              {getNoteTypeBadge(selectedNote.noteType)}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t('appointment.notes.content')}
            </h4>
            <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
              {selectedNote.note}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t('common.createdAt')}
            </h4>
            <div className="flex items-center text-sm">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              {(() => {
                try {
                  const date = new Date(selectedNote.createdAt);
                  if (isNaN(date.getTime())) {
                    return t('common.invalidDate');
                  }
                  return format(date, 'PPpp');
                } catch (err) {
                  console.error('Date formatting error:', err);
                  return t('common.invalidDate');
                }
              })()}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 