import { 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  QueryAppointmentsRequest,
  QueryAppointmentResponse,
  CreateAppointmentNoteRequest,
  UpdateAppointmentNoteRequest,
  QueryAppointmentNotesRequest,
  GetAppointmentNoteResponse
} from '@/types/appointment';
import { api } from '@/lib/axios';
import { format } from 'date-fns';

// For timestamp with time zone in PostgreSQL, we MUST use UTC
const formatDateForApi = (date: Date): string => {
  // PostgreSQL only accepts UTC for timestamp with time zone columns
  // Return ISO string with UTC timezone (Z)
  return date.toISOString();
};

const prepareAppointmentData = (data: any) => {
  const prepared = { ...data };
  
  if (prepared.start instanceof Date) {
    const originalDate = new Date(prepared.start);
    const formattedLocal = format(originalDate, "yyyy-MM-dd'T'HH:mm:ss");
    
    // Make sure the date is in UTC
    if (originalDate.getTimezoneOffset() !== 0) {
      console.warn('Warning: Converting a non-UTC date to UTC for timestamp with time zone column');
    }
    
    prepared.start = formatDateForApi(prepared.start);
    console.log('Date conversion - start:', 
      'Local format:', formattedLocal,
      'API format (UTC):', prepared.start
    );
  }
  
  if (prepared.end instanceof Date) {
    const originalDate = new Date(prepared.end);
    const formattedLocal = format(originalDate, "yyyy-MM-dd'T'HH:mm:ss");
    
    // Make sure the date is in UTC
    if (originalDate.getTimezoneOffset() !== 0) {
      console.warn('Warning: Converting a non-UTC date to UTC for timestamp with time zone column');
    }
    
    prepared.end = formatDateForApi(prepared.end);
    console.log('Date conversion - end:', 
      'Local format:', formattedLocal,
      'API format (UTC):', prepared.end
    );
  }
  
  return prepared;
};

export const appointmentService = {
  getAppointments: async (query?: QueryAppointmentsRequest) => {
    // Prepare query params if they contain dates
    const params: any = query ? { ...query } : undefined;
    if (params?.startDate instanceof Date) {
      params.startDate = formatDateForApi(params.startDate);
    }
    if (params?.endDate instanceof Date) {
      params.endDate = formatDateForApi(params.endDate);
    }
    
    const response = await api.get<QueryAppointmentResponse[]>('/appointments', { 
      params
    });
    return response.data;
  },

  getAppointment: async (id: number) => {
    const response = await api.get<QueryAppointmentResponse>(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (appointment: CreateAppointmentRequest) => {
    const preparedData = prepareAppointmentData(appointment);
    const response = await api.post<QueryAppointmentResponse>(
      '/appointments',
      preparedData
    );
    return response.data;
  },

  updateAppointment: async (id: number, appointment: Partial<UpdateAppointmentRequest>) => {
    const preparedData = prepareAppointmentData(appointment);
    await api.patch(
      `/appointments/${id}`,
      preparedData
    );
    return null;
  },

  deleteAppointment: async (id: number) => {
    await api.delete(`/appointments/${id}`);
  },

  // Appointment Note Methods
  getAppointmentNotes: async (query?: QueryAppointmentNotesRequest) => {
    const response = await api.get<GetAppointmentNoteResponse[]>('/appointment-notes', { 
      params: query 
    });
    return response.data;
  },

  createAppointmentNote: async (note: CreateAppointmentNoteRequest & { appointmentId: number }) => {
    const response = await api.post<GetAppointmentNoteResponse>(
      '/appointment-notes',
      note
    );
    return response.data;
  },

  updateAppointmentNote: async (id: number, note: UpdateAppointmentNoteRequest) => {
    const response = await api.patch<GetAppointmentNoteResponse>(
      `/appointment-notes/${id}`,
      note
    );
    return response.data;
  },

  deleteAppointmentNote: async (id: number) => {
    await api.delete(`/appointment-notes/${id}`);
  }
};