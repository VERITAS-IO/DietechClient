import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppointmentStore } from '@/stores/appointment-store';
import { GetAppointmentNoteResponse, NoteType, UpdateAppointmentNoteRequest } from '@/types/appointment';
import { AppointmentNoteDialog } from './AppointmentNoteDialog';
import { useAppointmentNotes } from '@/hooks/appointment-hooks';

interface AppointmentNotesProps {
  appointmentId: number;
}

export function AppointmentNotes({ appointmentId }: AppointmentNotesProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<GetAppointmentNoteResponse | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<'PreAppointment' | 'DuringAppointment' | 'AfterAppointment'>('PreAppointment');

  // Use the new hooks
  const {
    notes,
    createAppointmentNote,
    updateAppointmentNote: updateAppointmentNoteHook,
    deleteAppointmentNote: deleteAppointmentNoteHook,
    isLoading: isNotesLoading,
    isDeletePending,
    deletingNoteId
  } = useAppointmentNotes({ appointmentId });

  // Fallback to store if needed
  const store = useAppointmentStore();
  const storeNotes = store.appointmentNotes.filter(note => note.appointmentId === appointmentId);
  
  // Use store or API data
  const filteredNotes = notes.length > 0 ? notes : storeNotes;
  const isLoading = isNotesLoading || store.isLoading;

  // Use the appropriate update and delete functions
  const updateAppointmentNote = updateAppointmentNoteHook || 
    ((params: { id: number, data: UpdateAppointmentNoteRequest }) => 
      store.updateAppointmentNote(params.id, params.data));
      
  const deleteAppointmentNote = deleteAppointmentNoteHook || store.deleteAppointmentNote;

  const handleSubmit = useCallback(async () => {
    try {
      if (selectedNote) {
        updateAppointmentNote({
          id: selectedNote.id,
          data: {
            note: noteText,
            noteType,
          }
        });
        toast({
          title: t('appointment.notes.updateSuccess'),
          description: t('appointment.notes.updateSuccessDesc'),
        });
      } else {
        createAppointmentNote({
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
      setNoteType('PreAppointment');
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
      deleteAppointmentNote(noteId);
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
      case 'PreAppointment':
        return t('appointment.notes.types.pre');
      case 'DuringAppointment':
        return t('appointment.notes.types.during');
      case 'AfterAppointment':
        return t('appointment.notes.types.after');
      default:
        return t('appointment.notes.types.unknown');
    }
  }, [t]);

  const handleOpenNewNote = useCallback(() => {
    setSelectedNote(null);
    setNoteText('');
    setNoteType('PreAppointment');
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
        <Button onClick={handleOpenNewNote}>
          <Plus className="h-4 w-4 mr-2" />
          {t('appointment.notes.add')}
        </Button>
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
              <div className="space-x-2 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEditNote(note)}
                  disabled={isDeletePending && deletingNoteId === note.id}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                  disabled={isDeletePending && deletingNoteId === note.id}
                >
                  {t('common.delete')}
                </Button>
                {isDeletePending && deletingNoteId === note.id && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{note.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}