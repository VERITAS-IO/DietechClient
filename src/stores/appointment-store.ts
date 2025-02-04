import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Appointment, 
  AppointmentNote,
  AppointmentStatus, 
  AppointmentType,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  QueryAppointmentsRequest,
  CreateAppointmentNoteRequest,
  UpdateAppointmentNoteRequest,
  QueryAppointmentNotesRequest,
  NoteType
} from '@/types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  appointmentNotes: AppointmentNote[];
  isLoading: boolean;
  error: string | null;

  // Appointment Actions
  getAppointments: (query: QueryAppointmentsRequest) => Promise<void>;
  getAppointment: (id: number) => Promise<Appointment | undefined>;
  createAppointment: (request: CreateAppointmentRequest) => Promise<void>;
  updateAppointment: (id: number, request: UpdateAppointmentRequest) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;

  // Appointment Note Actions
  getAppointmentNotes: (query: QueryAppointmentNotesRequest) => Promise<void>;
  createAppointmentNote: (request: CreateAppointmentNoteRequest) => Promise<void>;
  updateAppointmentNote: (request: UpdateAppointmentNoteRequest) => Promise<void>;
  deleteAppointmentNote: (id: number) => Promise<void>;
}

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: "Initial Consultation - John Doe",
    start: new Date("2024-02-01T10:00:00"),
    end: new Date("2024-02-01T11:00:00"),
    clientId: 1,
    clientName: "John Doe",
    type: AppointmentType.Initial,
    status: AppointmentStatus.Scheduled,
    preparationInstructions: "Please bring your recent blood tests",
  },
  {
    id: 2,
    title: "Follow-up - Jane Smith",
    start: new Date("2024-02-02T14:00:00"),
    end: new Date("2024-02-02T15:00:00"),
    clientId: 2,
    clientName: "Jane Smith",
    type: AppointmentType.FollowUp,
    status: AppointmentStatus.Confirmed,
    preparationInstructions: "Update your food diary",
  },
];

const mockAppointmentNotes: AppointmentNote[] = [
  {
    id: 1,
    appointmentId: 1,
    note: "Client reported issues with current diet plan",
    noteType: NoteType.PreAppointment,
  },
  {
    id: 2,
    appointmentId: 1,
    note: "Discussed alternative meal options",
    noteType: NoteType.DuringAppointment,
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
          // Mock API call
          const filtered = mockAppointments.filter(apt => {
            if (query.clientId && apt.clientId !== query.clientId) return false;
            if (query.type && apt.type !== query.type) return false;
            if (query.status && apt.status !== query.status) return false;
            if (query.startDate && new Date(apt.start) < query.startDate) return false;
            if (query.endDate && new Date(apt.end) > query.endDate) return false;
            return true;
          });

          // Ensure dates are properly parsed
          const parsedAppointments = filtered.map(apt => ({
            ...apt,
            start: new Date(apt.start),
            end: new Date(apt.end)
          }));

          set({ appointments: parsedAppointments, isLoading: false });
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
            // Ensure dates are properly parsed
            return {
              ...appointment,
              start: new Date(appointment.start),
              end: new Date(appointment.end)
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
          const tempAppointmentId = Date.now(); 
      
          const newAppointment: Appointment = {
            id: tempAppointmentId,
            title: request.title,
            start: request.start,
            end: request.end,
            clientId: request.clientId,
            clientName: request.clientName,
            type: request.type,
            status: request.status,
            preparationInstructions: request.preparationInstructions,
            appointmentNotes: [] 
          };
      
          if (request.note) {
            const newNote: AppointmentNote = {
              id: tempAppointmentId, 
              appointmentId: tempAppointmentId, 
              note: request.note.note,
              noteType: request.note.noteType
            };
            
            newAppointment.appointmentNotes = [newNote];
          }
      
          set(state => ({
            appointments: [...state.appointments, newAppointment],
            appointmentNotes: [
              ...state.appointmentNotes,
              ...(newAppointment.appointmentNotes || [])
            ],
            error: null,
          }));
      
          // In a real application, you would:
          // 1. Send the appointment data to the backend
          // 2. Get the real IDs back
          // 3. Update the store with the real IDs
          
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
              apt.id === id ? { ...apt, ...request } : apt
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
          const filtered = mockAppointmentNotes.filter(note => {
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
          const newNote: AppointmentNote = {
            id: Math.max(...mockAppointmentNotes.map(n => n.id)) + 1,
            appointmentId: 0,
            ...request,
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
          set(state => ({
            appointmentNotes: state.appointmentNotes.map(note =>
              note.id === request.noteId ? { ...note, ...request } : note
            ),
            error: null,
          }));
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