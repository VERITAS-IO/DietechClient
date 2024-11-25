// import { Appointment } from '@/types/appointment';
// import { api } from '@/lib/axios';

// export const appointmentService = {
//   getAppointments: async () => {
//     const response = await api.get<Appointment[]>(`/appointments`);
//     return response.data;
//   },

//   createAppointment: async (appointment: Omit<Appointment, 'id'>) => {
//     const response = await api.post<Appointment>(
//       `/appointments`,
//       appointment
//     );
//     return response.data;
//   },

//   updateAppointment: async (id: string, appointment: Partial<Appointment>) => {
//     const response = await api.put<Appointment>(
//       `$/appointments/${id}`,
//       appointment
//     );
//     return response.data;
//   },

//   deleteAppointment: async (id: string) => {
//     await api.delete(`$/appointments/${id}`);
//   },
// };

import { generateRandomAppointments } from '@/lib/mock-data';
import { Appointment } from '@/types/appointment';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage
let appointments = generateRandomAppointments(20);

export const appointmentService = {
  getAppointments: async () => {
    await delay(800); // Simulate network delay
    return appointments;
  },

  createAppointment: async (appointment: Omit<Appointment, 'id'>) => {
    await delay(500);
    const newAppointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
    };
    appointments = [...appointments, newAppointment];
    return newAppointment;
  },

  updateAppointment: async (id: string, data: Partial<Appointment>) => {
    await delay(500);
    const index = appointments.findIndex(apt => apt.id === id);
    if (index === -1) throw new Error('Appointment not found');
    
    const updatedAppointment = {
      ...appointments[index],
      ...data,
    };
    appointments = [
      ...appointments.slice(0, index),
      updatedAppointment,
      ...appointments.slice(index + 1),
    ];
    return updatedAppointment;
  },

  deleteAppointment: async (id: string) => {
    await delay(500);
    appointments = appointments.filter(apt => apt.id !== id);
  },
};