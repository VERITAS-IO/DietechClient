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
import { ApiService } from '@/types/api';
import { ApiResponse, PagedResponse } from '@/types/common';
import { format } from 'date-fns';

// For timestamp with time zone in PostgreSQL, we MUST use UTC
const formatDateForApi = (date: Date): string => {
  // PostgreSQL only accepts UTC for timestamp with time zone columns
  // Return ISO string with UTC timezone (Z)
  return date.toISOString();
};

const prepareAppointmentData = (data: unknown) => {
  const prepared = { ...(data as Record<string, unknown>) };
  
  if (prepared.start instanceof Date) {
    const originalDate = new Date(prepared.start);
    const formattedLocal = format(originalDate, "yyyy-MM-dd'T'HH:mm:ss");
    
    // Make sure the date is in UTC
    if (originalDate.getTimezoneOffset() !== 0) {
      // Convert to UTC
    }
    
    prepared.start = formatDateForApi(prepared.start);
  }
  
  if (prepared.end instanceof Date) {
    const originalDate = new Date(prepared.end);
    const formattedLocal = format(originalDate, "yyyy-MM-dd'T'HH:mm:ss");
    
    // Make sure the date is in UTC
    if (originalDate.getTimezoneOffset() !== 0) {
      // Convert to UTC
    }
    
    prepared.end = formatDateForApi(prepared.end);
  }
  
  return prepared;
};

// ✅ Appointment Service Class (Rehberinizden: API template kullan)
class AppointmentService extends ApiService {
  constructor() {
    super('/appointments');
  }

  // ✅ Generic methods using template
  async getAppointments(query?: QueryAppointmentsRequest): Promise<PagedResponse<QueryAppointmentResponse>> {
    // Prepare query params if they contain dates
    const params: Record<string, unknown> = query ? { ...query } : {};
    if (params.startDate instanceof Date) {
      params.startDate = formatDateForApi(params.startDate);
    }
    if (params.endDate instanceof Date) {
      params.endDate = formatDateForApi(params.endDate);
    }
    
    return this.getPaged('', params);
  }

  async getAppointment(id: number): Promise<ApiResponse<QueryAppointmentResponse>> {
    return this.get(`/${id}`);
  }

  async createAppointment(appointment: CreateAppointmentRequest): Promise<ApiResponse<QueryAppointmentResponse>> {
    const preparedData = prepareAppointmentData(appointment);
    return this.post('', preparedData);
  }

  async updateAppointment(id: number, appointment: Partial<UpdateAppointmentRequest>): Promise<ApiResponse<void>> {
    const preparedData = prepareAppointmentData(appointment);
    return this.put(`/${id}`, preparedData);
  }

  async deleteAppointment(id: number): Promise<ApiResponse<void>> {
    return this.delete(`/${id}`);
  }

  // ✅ Appointment Note Methods
  async getAppointmentNotes(query?: QueryAppointmentNotesRequest): Promise<PagedResponse<GetAppointmentNoteResponse>> {
    return this.getPaged('/notes', query as Record<string, unknown>);
  }

  async createAppointmentNote(note: CreateAppointmentNoteRequest & { appointmentId: number }): Promise<ApiResponse<GetAppointmentNoteResponse>> {
    return this.post('/notes', note);
  }

  async updateAppointmentNote(id: number, note: UpdateAppointmentNoteRequest): Promise<ApiResponse<GetAppointmentNoteResponse>> {
    return this.put(`/notes/${id}`, note);
  }

  async deleteAppointmentNote(id: number): Promise<ApiResponse<void>> {
    return this.delete(`/notes/${id}`);
  }
}

// ✅ Service instance (Rehberinizden: Singleton pattern)
export const appointmentService = new AppointmentService();