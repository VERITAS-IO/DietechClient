import { addDays, addHours, startOfDay, setHours } from 'date-fns';
import { Appointment, Client } from '@/types/appointment';

const today = startOfDay(new Date());

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    lastVisit: addDays(today, -5),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    lastVisit: addDays(today, -2),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567892',
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1234567893',
    lastVisit: addDays(today, -10),
  },
];

const appointmentTypes = ['initial', 'followUp', 'assessment', 'emergency'] as const;
const appointmentStatuses = ['scheduled', 'confirmed', 'cancelled', 'completed'] as const;

export function generateRandomAppointments(count: number): Appointment[] {
  const appointments: Appointment[] = [];

  for (let i = 0; i < count; i++) {
    const client = mockClients[Math.floor(Math.random() * mockClients.length)];
    const daysOffset = Math.floor(Math.random() * 30);
    const startHour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const startDate = setHours(addDays(today, daysOffset), startHour);
    const endDate = addHours(startDate, Math.random() > 0.5 ? 1 : 2);

    appointments.push({
      id: `appointment-${i + 1}`,
      title: `${appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)]} Appointment`,
      start: startDate,
      end: endDate,
      clientId: client.id,
      clientName: client.name,
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      status: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
      notes: Math.random() > 0.5 ? 'Some notes about the appointment...' : undefined,
      preparationInstructions: Math.random() > 0.5 
        ? 'Please arrive 10 minutes early and bring any relevant medical records.'
        : undefined,
    });
  }

  return appointments.sort((a, b) => a.start.getTime() - b.start.getTime());
}