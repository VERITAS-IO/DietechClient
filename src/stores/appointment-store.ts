import { create } from 'zustand';
import { Appointment } from '@/types/appointment';

interface AppointmentStore {
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  updateAppointment: (id, updatedAppointment) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updatedAppointment } : apt
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((apt) => apt.id !== id),
    })),
}));