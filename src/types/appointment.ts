export enum AppointmentType {
  Initial = 'Initial',
  FollowUp = 'FollowUp',
  Assessment = 'Assessment',
  Emergency = 'Emergency'
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}

export enum NoteType {
  PreAppointment = 'PreAppointment',
  DuringAppointment = 'DuringAppointment',
  AfterAppointment = 'AfterAppointment'
}

export interface CreateAppointmentRequest {
  title: string;
  start: Date;
  end: Date;
  clientId?: number;
  clientName: string;
  type: AppointmentType;
  status: AppointmentStatus;
  preparationInstructions?: string;
  note?:CreateAppointmentNoteRequest;
}

export interface UpdateAppointmentRequest {
  title?: string;
  start?: Date;
  end?: Date;
  clientId?: number;
  clientName?: string;
  type?: AppointmentType;
  status?: AppointmentStatus;
  preparationInstructions?: string;
}

export interface QueryAppointmentsRequest {
  dieticianId?: number;
  startDate?: Date;
  endDate?: Date;
  clientId?: number;
  type?: AppointmentType;
  status?: AppointmentStatus;
  page?: number;
  pageSize?: number;
} 

export interface GetAppointmentResponse {
  id: number;
  title: string;
  start: Date;
  end: Date;
  clientId?: number;
  clientName: string;
  type: AppointmentType;
  status: AppointmentStatus;
  preparationInstructions?: string;
  appointmentNotes?: GetAppointmentNoteResponse[];
}

export interface QueryAppointmentResponse {
  id: number;
  title: string;
  start: Date;
  end: Date;
  clientId?: number;
  clientName: string;
  type: AppointmentType;
  status: AppointmentStatus;
  preparationInstructions?: string;
}

export interface GetAppointmentNoteResponse {
  id: number;
  appointmentId: number;
  note: string;
  noteType: NoteType;
  createdAt: Date;
}

export interface QueryAppointmentNoteResponse {
  id: number;
  appointmentId: number;
  note: string;
  noteType: NoteType;
}

export interface CreateAppointmentNoteRequest {
  note: string;
  noteType: NoteType;
}

export interface UpdateAppointmentNoteRequest {
  note: string;
  noteType?: NoteType;
}

export interface QueryAppointmentNotesRequest {
  appointmentId?: number;
  note?: string;
  noteType?: NoteType;
  page?: number;
  pageSize?: number;
}