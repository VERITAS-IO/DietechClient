import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NoteType, UpdateAppointmentNoteRequest } from '@/types/appointment';
import { useAppointmentNoteStore } from '@/stores/appointment-note-store';
import { useAppointments } from '@/hooks/appointment-hooks';
import { useAppointmentNotes } from '@/hooks/appointment-hooks';
import { useToast } from '@/hooks/use-toast';

export function AppointmentNoteCreateDialog() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isOpen = useAppointmentNoteStore((state) => state.isCreateModalOpen);
  const setIsOpen = useAppointmentNoteStore((state) => state.setCreateModalOpen);
  const selectedNote = useAppointmentNoteStore((state) => state.selectedNote);
  const setSelectedNote = useAppointmentNoteStore((state) => state.setSelectedNote);
  
  // Get appointments for the dropdown
  const { appointments } = useAppointments();
  
  // Get mutation functions for notes
  const { createAppointmentNote, updateAppointmentNote } = useAppointmentNotes();
  
  // Form state
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<NoteType>(NoteType.PreAppointment);
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if we're in edit mode
  const isEditMode = !!selectedNote;
  
  // Set initial form values when the dialog opens or selected note changes
  useEffect(() => {
    if (selectedNote) {
      setNoteText(selectedNote.note);
      setNoteType(selectedNote.noteType);
      setAppointmentId(selectedNote.appointmentId.toString());
    } else {
      setNoteText('');
      setNoteType(NoteType.PreAppointment);
      setAppointmentId('');
    }
  }, [selectedNote, isOpen]);
  
  // Handle dialog close
  const handleClose = () => {
    setIsOpen(false);
    // Only reset selected note when closing
    if (isOpen) {
      setTimeout(() => setSelectedNote(null), 300);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!noteText.trim()) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('validation.required'),
      });
      return;
    }
    
    if (!appointmentId && !isEditMode) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('appointment.notes.selectAppointment'),
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && selectedNote) {
        // Update existing note
        const updateData: UpdateAppointmentNoteRequest = {
          note: noteText,
          noteType
        };
        
        await updateAppointmentNote({
          id: selectedNote.id,
          data: updateData
        });
        
        toast({
          title: t('appointment.notes.updateSuccess'),
          description: t('appointment.notes.updateSuccessDesc'),
        });
      } else {
        // Create new note
        await createAppointmentNote({
          appointmentId: parseInt(appointmentId),
          note: noteText,
          noteType
        });
        
        toast({
          title: t('appointment.notes.createSuccess'),
          description: t('appointment.notes.createSuccessDesc'),
        });
      }
      
      handleClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('appointment.notes.saveFailed'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode 
              ? t('appointment.notes.edit') 
              : t('appointment.notes.add')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="appointmentId">
                {t('appointment.select')}
              </Label>
              <Select
                value={appointmentId}
                onValueChange={setAppointmentId}
              >
                <SelectTrigger id="appointmentId">
                  <SelectValue placeholder={t('appointment.notes.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {appointments.map((appointment) => {
                    let dateDisplay;
                    try {
                      const date = new Date(appointment.start);
                      dateDisplay = !isNaN(date.getTime()) 
                        ? date.toLocaleDateString() 
                        : t('common.invalidDate');
                    } catch (err) {
                      console.error('Date formatting error:', err);
                      dateDisplay = t('common.invalidDate');
                    }
                    
                    return (
                      <SelectItem 
                        key={appointment.id} 
                        value={appointment.id.toString()}
                      >
                        {`${appointment.clientName} - ${dateDisplay}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="noteType">
              {t('appointment.notes.type')}
            </Label>
            <Select
              value={noteType.toString()}
              onValueChange={(value) => setNoteType(parseInt(value) as NoteType)}
            >
              <SelectTrigger id="noteType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NoteType.PreAppointment.toString()}>
                  {t('appointment.notes.types.1')}
                </SelectItem>
                <SelectItem value={NoteType.DuringAppointment.toString()}>
                  {t('appointment.notes.types.2')}
                </SelectItem>
                <SelectItem value={NoteType.AfterAppointment.toString()}>
                  {t('appointment.notes.types.3')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="noteText">
              {t('appointment.notes.content')}
            </Label>
            <Textarea
              id="noteText"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={5}
              placeholder={t('appointment.notes.content')}
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? t('common.saving')
              : isEditMode 
                ? t('common.save') 
                : t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
