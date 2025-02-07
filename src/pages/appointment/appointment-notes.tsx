import { useState, useCallback } from "react";
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
import { NoteType, QueryAppointmentNoteResponse } from "@/types/appointment";
import { useTranslation } from "react-i18next";
import { AppointmentNoteDialog } from "@/components/appointments/AppointmentNoteDialog";

// Mock data for demonstration
const mockNotes: QueryAppointmentNoteResponse[] = [
  {
    id: 1,
    appointmentId: 101,
    note: "Patient reported mild discomfort",
    noteType: NoteType.PreAppointment,
  },
  {
    id: 2,
    appointmentId: 102,
    note: "Treatment plan discussed and agreed",
    noteType: NoteType.DuringAppointment,
  },
];

export default function AppointmentNotesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<QueryAppointmentNoteResponse | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState<NoteType>(NoteType.PreAppointment);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateNote = useCallback(async () => {
    setIsLoading(true);
    // Implement your update logic here
    try {
      // API call would go here
      console.log("Updating note:", { noteText, noteType });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setIsLoading(false);
    }
  }, [noteText, noteType]);

  const handleDeleteNote = useCallback(async (noteId: number) => {
    // Implement your delete logic here
    console.log("Deleting note:", noteId);
  }, []);

  const handleEditNote = useCallback((note: QueryAppointmentNoteResponse) => {
    setSelectedNote(note);
    setNoteText(note.note);
    setNoteType(note.noteType);
    setIsDialogOpen(true);
  }, []);

  const filteredNotes = mockNotes
    .filter((note) => {
      const matchesSearch = note.note
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || note.noteType.toString() === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.id - b.id;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container m-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Appointment Notes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track appointment notes
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={NoteType.PreAppointment.toString()}>
                Pre-Appointment
              </SelectItem>
              <SelectItem value={NoteType.DuringAppointment.toString()}>
                During Appointment
              </SelectItem>
              <SelectItem value={NoteType.AfterAppointment.toString()}>
                After Appointment
              </SelectItem>
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
                <TableHead>Note</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Appointment ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{note.note}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        note.noteType === NoteType.PreAppointment
                          ? "bg-blue-100 text-blue-700"
                          : note.noteType === NoteType.DuringAppointment
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {NoteType[note.noteType]}
                    </span>
                  </TableCell>
                  <TableCell>{note.appointmentId}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10"
                        onClick={() => handleEditNote(note)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-destructive/10 text-destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AppointmentNoteDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedNote={selectedNote}
          noteText={noteText}
          onNoteTextChange={setNoteText}
          noteType={noteType}
          onNoteTypeChange={setNoteType}
          onSubmit={handleUpdateNote}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}