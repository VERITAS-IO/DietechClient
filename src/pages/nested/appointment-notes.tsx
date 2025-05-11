import { AppointmentNoteCardList } from "@/components/appointments/AppointmentNoteCardList";
import { AppointmentNoteDetailDialog } from "@/components/appointments/AppointmentNoteDetailDialog";
import { AppointmentNoteCreateDialog } from "@/components/appointments/AppointmentNoteCreateDialog";

export default function AppointmentNotesPage() {
  return (
    <div className="container mx-auto py-6">
      <AppointmentNoteCardList />
      <AppointmentNoteDetailDialog />
      <AppointmentNoteCreateDialog />
    </div>
  );
} 