import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAppointmentStore } from '@/stores/appointment-store';
import { AppointmentNote, NoteType } from '@/types/appointment';

interface AppointmentNotesProps {
  appointmentId: number;
}

export function AppointmentNotes({ appointmentId }: AppointmentNotesProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<AppointmentNote | null>(null);
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

  const handleOpenEditNote = useCallback((note: AppointmentNote) => {
    setSelectedNote(note);
    setNoteText(note.note);
    setNoteType(note.noteType);
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('appointment.notes.title')}</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNewNote}>
              <Plus className="h-4 w-4 mr-2" />
              {t('appointment.notes.add')}
            </Button>
          </DialogTrigger>
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
                  onValueChange={(value) => setNoteType(Number(value) as NoteType)}
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
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
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
      </div>

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