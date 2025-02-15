import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NoteType, GetAppointmentNoteResponse, GetAppointmentResponse } from "@/types/appointment";
import { useAppointmentStore } from "@/stores/appointment-store";
import { useTranslation } from "react-i18next";
import { AppointmentNoteDialog } from "@/components/appointments/AppointmentNoteDialog";
import { AppointmentNoteCreateDialog } from "@/components/appointments/AppointmentNoteCreateDialog";

export default function AppointmentNotesPage() {
  const { t } = useTranslation();
  const {
    appointmentNotes,
    appointments,
    getAppointments,
    createAppointmentNote,
    updateAppointmentNote,
    deleteAppointmentNote,
    isLoading,
    error
  } = useAppointmentStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAppointment, setFilterAppointment] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<GetAppointmentNoteResponse | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState<NoteType>(NoteType.PreAppointment);
  const [selectedAppointment, setSelectedAppointment] = useState<GetAppointmentResponse | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch all appointments on mount
  useEffect(() => {
    getAppointments({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)), // Last 12 months
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)) // Next 12 months
    });
  }, []);

  const handleSaveNote = useCallback(async () => {
    try {
      if (selectedNote) {
        // Update existing note
        await updateAppointmentNote({
          id: selectedNote.id,
          note: noteText,
          noteType
        });
      } else {
        // For new notes, we need an appointment selected
        if (!selectedAppointment && !filterAppointment) {
          console.error('Please select an appointment first');
          return;
        }

        // Use either the selected appointment or the filtered appointment
        const appointmentId = selectedAppointment?.id ?? 
          (filterAppointment !== 'all' ? parseInt(filterAppointment) : undefined);

        if (!appointmentId) {
          console.error('No appointment selected');
          return;
        }

        await createAppointmentNote({
          appointmentId,
          note: noteText,
          noteType
        });
      }

      // Reset form
      setIsDialogOpen(false);
      setSelectedNote(null);
      setNoteText('');
      setNoteType(NoteType.PreAppointment);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }, [selectedAppointment, selectedNote, noteText, noteType, filterAppointment]);

  const handleDeleteNote = useCallback(async (noteId: number) => {
    try {
      await deleteAppointmentNote(noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, []);

  const handleEditNote = useCallback((note: GetAppointmentNoteResponse) => {
    setSelectedNote(note);
    setNoteText(note.note);
    setNoteType(note.noteType);
    setIsDialogOpen(true);
  }, []);

  const filteredNotes = appointmentNotes
    .filter((note) => {
      const matchesSearch = note.note
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || note.noteType.toString() === filterType;
      const matchesAppointment =
        filterAppointment === "all" || note.appointmentId.toString() === filterAppointment;
      return matchesSearch && matchesType && matchesAppointment;
    })
    .sort((a, b) => {
      return sortBy === 'newest' 
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  return (
    <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{t('notes.title')}</h1>
          <div className="flex gap-4 items-center">
            <Button 
              onClick={() => {
                setSelectedAppointmentId(null);
                setSelectedNote(null);
                setNoteText('');
                setNoteType(NoteType.PreAppointment);
                setIsCreateDialogOpen(true);
              }}
            >
              {t('notes.addNote')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={filterAppointment} onValueChange={setFilterAppointment}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by appointment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              {appointments.map((appointment) => (
                <SelectItem key={appointment.id} value={appointment.id.toString()}>
                  {`${appointment.clientName} - ${new Date(appointment.start).toLocaleDateString()}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(NoteType).map((type) => (
                <SelectItem key={type} value={type.toString()}>
                  {t(`notes.types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Appointment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('notes.noNotes')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotes.map((note) => {
                  const appointment = appointments.find(a => a.id === note.appointmentId);
                  return (
                    <TableRow key={note.id} className="hover:bg-muted/50">
                      <TableCell>
                        {appointment ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{appointment.clientName}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(appointment.start).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          t('notes.appointmentNotFound')
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            note.noteType === NoteType.PreAppointment
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : note.noteType === NoteType.DuringAppointment
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {t(`notes.types.${note.noteType}`)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{note.note}</TableCell>
                      <TableCell>{new Date(note.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary/10"
                            onClick={() => {
                              setSelectedAppointment(appointment ?? null);
                              handleEditNote(note);
                            }}
                          >
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-destructive/10 text-destructive"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            {t('common.delete')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialog for editing existing notes */}
        <AppointmentNoteDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedNote={selectedNote}
          noteText={noteText}
          onNoteTextChange={setNoteText}
          noteType={noteType}
          onNoteTypeChange={setNoteType}
          onSubmit={handleSaveNote}
          isLoading={isLoading}
        />

        {/* Dialog for creating new notes */}
        <AppointmentNoteCreateDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          appointments={appointments}
          selectedAppointmentId={selectedAppointmentId}
          onAppointmentChange={(id) => {
            setSelectedAppointmentId(id);
            setSelectedAppointment(appointments.find(a => a.id.toString() === id) ?? null);
          }}
          noteText={noteText}
          onNoteTextChange={setNoteText}
          noteType={noteType}
          onNoteTypeChange={setNoteType}
          onSubmit={handleSaveNote}
          isLoading={isLoading}
        />
    </div>
  );
}