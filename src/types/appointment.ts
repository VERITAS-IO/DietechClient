export type AppointmentType = 'initial' | 'followUp' | 'assessment' | 'emergency';

export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  clientId: string;
  clientName: string;
  type: AppointmentType;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  preparationInstructions?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit?: Date;
}