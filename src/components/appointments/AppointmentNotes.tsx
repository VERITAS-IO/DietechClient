import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAppointmentStore } from '@/stores/appointment-store';
import { GetAppointmentNoteResponse, NoteType } from '@/types/appointment';
import { AppointmentNoteDialog } from './AppointmentNoteDialog';

interface AppointmentNotesProps {
  appointmentId: number;
}

export function AppointmentNotes({ appointmentId }: AppointmentNotesProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<GetAppointmentNoteResponse | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<NoteType>(NoteType.PreAppointment);

  const {
    appointmentNotes,
    createAppointmentNote,
    updateAppointmentNote,
    deleteAppointmentNote,
    isLoading,
  } = useAppointmentStore();

  const filteredNotes = appointmentNotes.filter(
    (note) => note.appointmentId === appointmentId
  );

  const handleSubmit = useCallback(async () => {
    try {
      if (selectedNote) {
        await updateAppointmentNote({
          noteId: selectedNote.id,
          note: noteText,
          noteType,
        });
        toast({
          title: t('appointment.notes.updateSuccess'),
          description: t('appointment.notes.updateSuccessDesc'),
        });
      } else {
        await createAppointmentNote({
          appointmentId,
          note: noteText,
          noteType,
        });
        toast({
          title: t('appointment.notes.createSuccess'),
          description: t('appointment.notes.createSuccessDesc'),
        });
      }
      setIsDialogOpen(false);
      setSelectedNote(null);
      setNoteText('');
      setNoteType(NoteType.PreAppointment);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('appointment.notes.saveFailed'),
      });
    }
  }, [appointmentId, noteText, noteType, selectedNote, createAppointmentNote, updateAppointmentNote, toast, t]);

  const handleDelete = useCallback(async (noteId: number) => {
    try {
      await deleteAppointmentNote(noteId);
      toast({
        title: t('appointment.notes.deleteSuccess'),
        description: t('appointment.notes.deleteSuccessDesc'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('appointment.notes.deleteFailed'),
      });
    }
  }, [deleteAppointmentNote, toast, t]);

  const getNoteTypeLabel = useCallback((type: NoteType) => {
    switch (type) {
      case NoteType.PreAppointment:
        return t('appointment.notes.types.pre');
      case NoteType.DuringAppointment:
        return t('appointment.notes.types.during');
      case NoteType.AfterAppointment:
        return t('appointment.notes.types.after');
      default:
        return t('appointment.notes.types.unknown');
    }
  }, [t]);

  const handleOpenNewNote = useCallback(() => {
    setSelectedNote(null);
    setNoteText('');
    setNoteType(NoteType.PreAppointment);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEditNote = useCallback((note: GetAppointmentNoteResponse) => {
    setSelectedNote(note);
    setNoteText(note.note);
    setNoteType(note.noteType);
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('appointment.notes.title')}</h3>
        <DialogTrigger asChild>
          <Button onClick={handleOpenNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            {t('appointment.notes.add')}
          </Button>
        </DialogTrigger>
      </div>

      <AppointmentNoteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedNote={selectedNote}
        noteText={noteText}
        onNoteTextChange={setNoteText}
        noteType={noteType}
        onNoteTypeChange={setNoteType}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-4 border rounded-lg space-y-2 bg-background"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {getNoteTypeLabel(note.noteType)}
              </span>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEditNote(note)}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{note.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}