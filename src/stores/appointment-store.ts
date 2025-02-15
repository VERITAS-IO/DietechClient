import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppointmentStatus, 
  AppointmentType,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  QueryAppointmentsRequest,
  CreateAppointmentNoteRequest,
  UpdateAppointmentNoteRequest,
  QueryAppointmentNotesRequest,
  NoteType,
  GetAppointmentResponse,
  GetAppointmentNoteResponse
} from '@/types/appointment';

interface AppointmentState {
  appointments: GetAppointmentResponse[];
  appointmentNotes: GetAppointmentNoteResponse[];
  isLoading: boolean;
  error: string | null;

  // Appointment Actions
  getAppointments: (query: QueryAppointmentsRequest) => Promise<void>;
  getAppointment: (id: number) => Promise<GetAppointmentResponse | undefined>;
  createAppointment: (request: CreateAppointmentRequest) => Promise<void>;
  updateAppointment: (id: number, request: UpdateAppointmentRequest) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;

  // Appointment Note Actions
  getAppointmentNotes: (query: QueryAppointmentNotesRequest) => Promise<void>;
  createAppointmentNote: (request: CreateAppointmentNoteRequest & { appointmentId: number }) => Promise<void>;
  updateAppointmentNote: (request: UpdateAppointmentNoteRequest) => Promise<void>;  
  deleteAppointmentNote: (id: number) => Promise<void>;
}

// Helper function to preserve timezone when creating Date objects
const createDateWithTimezone = (dateString: string | Date): Date => {
  const date = new Date(dateString);
  return new Date(
    date.getTime() - (date.getTimezoneOffset() * 60000)
  );
};

// Mock data with timezone-aware dates
const mockAppointments: GetAppointmentResponse[] = [
  {
    id: 1,
    title: "Initial Consultation - John Doe",
    start: createDateWithTimezone("2024-02-01T10:00:00"),
    end: createDateWithTimezone("2024-02-01T11:00:00"),
    clientId: 1,
    clientName: "John Doe",
    type: AppointmentType.Initial,
    status: AppointmentStatus.Scheduled,
    preparationInstructions: "Please bring your recent blood tests",
  },
  {
    id: 2,
    title: "Follow-up - Jane Smith",
    start: createDateWithTimezone("2024-02-02T14:00:00"),
    end: createDateWithTimezone("2024-02-02T15:00:00"),
    clientId: 2,
    clientName: "Jane Smith",
    type: AppointmentType.FollowUp,
    status: AppointmentStatus.Confirmed,
    preparationInstructions: "Update your food diary",
  },
];

const mockAppointmentNotes: GetAppointmentNoteResponse[] = [
  {
    id: 1,
    appointmentId: 1,
    note: "Client reported issues with current diet plan",
    noteType: NoteType.PreAppointment,
    createdAt: new Date()
  },
  {
    id: 2,
    appointmentId: 1,
    note: "Discussed alternative meal options",
    noteType: NoteType.DuringAppointment,
    createdAt: new Date()
  },
];

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      appointmentNotes: [],
      isLoading: false,
      error: null,

      // Appointment Actions
      getAppointments: async (query) => {
        set({ isLoading: true, error: null });
        try {
          // Use the stored appointments instead of mock data
          const state = get();
          const filtered = state.appointments.filter(apt => {
            if (query.clientId && apt.clientId !== query.clientId) return false;
            if (query.type && apt.type !== query.type) return false;
            if (query.status && apt.status !== query.status) return false;
            if (query.startDate && new Date(apt.start) < query.startDate) return false;
            if (query.endDate && new Date(apt.end) > query.endDate) return false;
            return true;
          });

          // Don't overwrite the stored appointments, just update loading state
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      getAppointment: async (id) => {
        set({ isLoading: true });
        try {
          const appointment = mockAppointments.find(a => a.id === id);
          if (appointment) {
            appointment.appointmentNotes = mockAppointmentNotes.filter(
              note => note.appointmentId === id
            );
            return {
              ...appointment,
              start: createDateWithTimezone(appointment.start),
              end: createDateWithTimezone(appointment.end)
            };
          }
          return appointment;
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      createAppointment: async (request) => {
        set({ isLoading: true });
        try {
          const state = get();
          const tempAppointmentId = Math.max(...state.appointments.map(a => a.id), 0) + 1;
      
          const newAppointment: GetAppointmentResponse = {
            id: tempAppointmentId,
            title: request.title,
            start: createDateWithTimezone(request.start),
            end: createDateWithTimezone(request.end),
            clientId: request.clientId,
            clientName: request.clientName,
            type: request.type,
            status: request.status,
            preparationInstructions: request.preparationInstructions,
            appointmentNotes: [] 
          };
      
          const updates: Partial<AppointmentState> = {
            appointments: [...state.appointments, newAppointment],
            error: null
          };
      
          if (request.note) {
            const newNote: GetAppointmentNoteResponse = {
              id: tempAppointmentId, 
              appointmentId: tempAppointmentId, 
              note: request.note.note,
              noteType: request.note.noteType,
              createdAt: new Date()
            };
            
            newAppointment.appointmentNotes = [newNote];
            updates.appointmentNotes = [...state.appointmentNotes, newNote];
          }
      
          set(updates);
          
          // Force a store update to ensure persistence
          set(state => ({ ...state }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateAppointment: async (id, request) => {
        set({ isLoading: true });
        try {
          set(state => ({
            appointments: state.appointments.map(apt =>
              apt.id === id ? {
                ...apt,
                ...request,
                start: request.start ? createDateWithTimezone(request.start) : apt.start,
                end: request.end ? createDateWithTimezone(request.end) : apt.end,
              } : apt
            ),
            error: null,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAppointment: async (id) => {
        set({ isLoading: true });
        try {
          set(state => ({
            appointments: state.appointments.filter(apt => apt.id !== id),
            appointmentNotes: state.appointmentNotes.filter(note => note.appointmentId !== id),
            error: null,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Appointment Note Actions
      getAppointmentNotes: async (query) => {
        set({ isLoading: true });
        try {
          const filtered = get().appointmentNotes.filter(note => {
            if (query.appointmentId && note.appointmentId !== query.appointmentId) return false;
            if (query.noteType && note.noteType !== query.noteType) return false;
            if (query.note && !note.note.toLowerCase().includes(query.note.toLowerCase())) return false;
            return true;
          });
          set({ appointmentNotes: filtered, error: null });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      createAppointmentNote: async (request) => {
        set({ isLoading: true });
        try {
          const currentNotes = get().appointmentNotes;
          const newNoteId = currentNotes.length > 0 
            ? Math.max(...currentNotes.map(n => n.id)) + 1 
            : 1;

          const newNote: GetAppointmentNoteResponse = {
            id: newNoteId,
            appointmentId: request.appointmentId,
            note: request.note,
            noteType: request.noteType,
            createdAt: new Date()
          };

          set(state => ({
            appointmentNotes: [...state.appointmentNotes, newNote],
            error: null,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateAppointmentNote: async (request) => {
        set({ isLoading: true });
        try {
          set(state => {
            const updatedNotes = state.appointmentNotes.map(note => {
              if (note.id === request.id) {
                return {
                  ...note,
                  note: request.note,
                  noteType: request.noteType as NoteType,
                };
              }
              return note;
            });
            
            return {
              ...state,
              appointmentNotes: updatedNotes,
              error: null,
            };
          });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAppointmentNote: async (id) => {
        set({ isLoading: true });
        try {
          set(state => ({
            appointmentNotes: state.appointmentNotes.filter(note => note.id !== id),
            error: null,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'appointment-storage',
      partialize: (state) => ({
        appointments: state.appointments,
        appointmentNotes: state.appointmentNotes,
      }),
    }
  )
);