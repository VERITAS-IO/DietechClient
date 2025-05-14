import { api as apiClient } from '@/lib/axios';
import {
  CreateFinancialRequest,
  CreateFinancialResponse,
  QueryFinancialsRequest,
  QueryFinancialsResponse,
  UpdateFinancialRequest,
  GetFinancialResponse,
  GetFinancialOverviewInitRequest,
  GetFinancialOverviewInitResponse,
  FinancialInterval,
  FinancialIntervalMapping,
  IntervalData
} from '@/types/financial';
import { useAuthStore } from '@/stores/auth-store';
import { parseISO, formatISO } from 'date-fns';

const BASE_URL = '/financials';

// Helper function to handle dietician ID
const getDieticianIdFromUser = () => {
  const user = useAuthStore.getState().user;
  
  if (!user) {
    console.error('User is not authenticated');
    return getFallbackDieticianId();
  }
  
  // If dieticianId exists, use it
  if (user.dieticianId) {
    console.log('Using dieticianId from user profile:', user.dieticianId);
    return user.dieticianId;
  }
  
  // If no dieticianId, but user has Dietician role, try to use their ID as a fallback
  if (user.id && user.roles && user.roles.includes('Dietician')) {
    const fallbackId = Number(user.id);
    console.warn('DieticianId not found in user profile, using user ID as fallback for Dietician role:', fallbackId);
    return fallbackId;
  }
  
  return getFallbackDieticianId();
};

// Fallback function for development
const getFallbackDieticianId = (): number | undefined => {
  // In development mode, use a fallback ID (1)
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using development fallback dieticianId (1)');
    return 1;
  }
  
  console.error('Neither dieticianId nor userId with Dietician role available in user profile');
  throw new Error('No valid dietician ID available in user profile');
};

const formatDateForApi = (date?: Date): string | undefined => {
  if (!date) return undefined;
  return formatISO(date, { representation: 'complete' });
};

const getNumericInterval = (interval?: FinancialInterval | number): number | undefined => {
  if (interval === undefined) return undefined;
  if (typeof interval === 'number') return interval;
  return FinancialIntervalMapping.toNumber[interval];
};

export const financialService = {
  /**
   * Query financials with filters and pagination
   */
  async queryFinancials(request: QueryFinancialsRequest): Promise<QueryFinancialsResponse[]> {
    console.log('queryFinancials called with request:', request);
    
    try {
      // Ensure dieticianId is included
      if (!request.dieticianId) {
        const dieticianId = getDieticianIdFromUser();
        if (dieticianId) {
          request.dieticianId = dieticianId;
          console.log('Added dieticianId to financial query request:', dieticianId);
        } else {
          console.error('No dieticianId available for financial query');
          throw new Error('DieticianId is required for querying financials');
        }
      }
      
      // Format dates for the API if present
      const formattedRequest = {
        ...request,
        startDate: request.startDate ? formatDateForApi(new Date(request.startDate)) : undefined,
        endDate: request.endDate ? formatDateForApi(new Date(request.endDate)) : undefined
      };
      
      // Send request - dieticianId will be added by axios interceptor if needed
      console.log(`Making GET request to ${BASE_URL} with params:`, formattedRequest);
      
      const { data } = await apiClient.get<QueryFinancialsResponse[]>(BASE_URL, { 
        params: formattedRequest
      });
      console.log('Financial API response received:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching financials:', error);
      // Rethrow with more context
      const contextError = new Error(`Failed to query financials: ${error.message}`);
      contextError.stack = error.stack;
      throw contextError;
    }
  },

  /**
   * Get a single financial by ID
   */
  async getFinancial(id: number): Promise<GetFinancialResponse> {
    try {
      console.log(`Making GET request to ${BASE_URL}/${id}`);
      const { data } = await apiClient.get<GetFinancialResponse>(`${BASE_URL}/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching financial with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new financial
   */
  async createFinancial(request: CreateFinancialRequest): Promise<CreateFinancialResponse> {
    try {
      const user = useAuthStore.getState().user;
      
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      // Attempt to get dieticianId, either from user profile or using fallback logic
      let dieticianId;
      try {
        dieticianId = getDieticianIdFromUser();
      } catch (error) {
        console.warn('Could not determine dieticianId:', error);
        // The axios interceptor will try to handle this
      }
      
      // Format the date to UTC ISO string
      const formattedRequest = {
        ...request,
        dieticianId: dieticianId,
        tenantId: user.tenantId || 0,
        date: formatDateForApi(request.date)
      };
      
      console.log('Creating financial with user data:', formattedRequest);
      
      const { data } = await apiClient.post<CreateFinancialResponse>(BASE_URL, formattedRequest);
      return data;
    } catch (error) {
      console.error('Error creating financial:', error);
      throw error;
    }
  },

  /**
   * Update an existing financial
   */
  async updateFinancial(request: UpdateFinancialRequest): Promise<void> {
    try {
      await apiClient.patch(`${BASE_URL}/${request.id}`, request);
    } catch (error) {
      console.error('Error updating financial:', error);
      throw error;
    }
  },

  /**
   * Delete a financial by ID
   */
  async deleteFinancial(id: number): Promise<void> {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting financial with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get financial overview data
   */
  async getFinancialOverview(request: GetFinancialOverviewInitRequest = {}): Promise<GetFinancialOverviewInitResponse> {
    console.log('getFinancialOverview called with request:', request);
    
    try {
      // Create a mutable copy to avoid modifying the original
      const mutableRequest = { ...request };
      
      // Ensure dieticianId is included
      if (!mutableRequest.dieticianId) {
        const dieticianId = getDieticianIdFromUser();
        if (dieticianId) {
          mutableRequest.dieticianId = dieticianId;
          console.log('Added dieticianId to financial overview request:', dieticianId);
        } else {
          console.error('No dieticianId available for financial overview request');
          throw new Error('DieticianId is required for financial overview');
        }
      }
      
      // Format dates to UTC ISO strings and interval to numeric value
      const formattedRequest = {
        ...mutableRequest,
        startDate: mutableRequest.startDate ? formatDateForApi(mutableRequest.startDate) : undefined,
        endDate: mutableRequest.endDate ? formatDateForApi(mutableRequest.endDate) : undefined,
        interval: getNumericInterval(mutableRequest.interval)
      };
      
      // Send request
      console.log(`Making GET request to ${BASE_URL}/overview with params:`, formattedRequest);
      
      const { data } = await apiClient.get<GetFinancialOverviewInitResponse>(`${BASE_URL}/overview`, { 
        params: formattedRequest
      });
      
      console.log('Financial overview API response received:', data);
      
      // Process the response to adapt the interval keys if needed
      if (data.intervals) {
        // Create a new intervals object with consistent keys
        const processedIntervals: Record<string, IntervalData[]> = {};
        
        // Convert numeric keys to string enum keys for consistent frontend usage
        Object.entries(data.intervals).forEach(([key, value]) => {
          // Convert numeric keys to their corresponding enum strings using the mapping
          const numericKey = parseInt(key, 10);
          const mappingKey = !isNaN(numericKey) ? numericKey : key;
          const intervalKey = FinancialIntervalMapping.toString[mappingKey as keyof typeof FinancialIntervalMapping.toString] || key;
          processedIntervals[intervalKey] = value;
        });
        
        // Replace the original intervals with processed ones
        data.intervals = processedIntervals as any;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching financial overview:', error);
      // Rethrow with more context
      const contextError = new Error(`Failed to get financial overview: ${error.message}`);
      contextError.stack = error.stack;
      throw contextError;
    }
  }
}; 