export enum AppointmentType {
  Unknown = 0,
  Initial = 1,
  FollowUp = 2,
  Assessment = 3,
  Emergency = 4
}

export enum AppointmentStatus {
  Unknown = 0,
  Scheduled = 1,
  Confirmed = 2,
  Cancelled = 3,
  Completed = 4
}

export enum NoteType {
  Unknown = 0,
  PreAppointment = 1,
  DuringAppointment = 2,
  AfterAppointment = 3
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
  appointmentId: number;
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

export interface GetAppointmentNoteResponse {
  id: number;
  appointmentId: number;
  note: string;
  noteType: NoteType;
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
  noteId: number;
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