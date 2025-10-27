import { api } from '@/lib/axios';
import { 
  GetMainPageChartRequest, 
  GetMainPageOverviewRequest, 
  GetMainPageOverviewResponse, 
  MainPageInterval, 
  MainPageOverviewChartResponse 
} from '@/types/dashboard';

class DashboardService {
  private readonly baseUrl = '/main-page';

  async getOverview(request: GetMainPageOverviewRequest = {}): Promise<GetMainPageOverviewResponse> {
    const params: Record<string, any> = {};
    
    if (request.startDate) {
      params.startDate = request.startDate.toISOString();
    }
    
    if (request.endDate) {
      params.endDate = request.endDate.toISOString();
    }
    
    if (request.interval !== undefined) {
      params.interval = request.interval;
    }
    
    const response = await api.get<GetMainPageOverviewResponse>(`${this.baseUrl}/overview`, { params });
    
    return response.data;
  }

  async getChartData(request: GetMainPageChartRequest = {}): Promise<MainPageOverviewChartResponse> {
    const params: Record<string, any> = {};
    
    if (request.interval !== undefined) {
      params.interval = request.interval;
    }
    
    if (request.startDate) {
      params.startDate = request.startDate.toISOString();
    }
    
    const response = await api.get<MainPageOverviewChartResponse>(`${this.baseUrl}/chart`, { params });
    
    return response.data;
  }

  getIntervalFromTimeRange(timeRange: string): MainPageInterval {
    switch (timeRange) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return 'Monthly'; 
    }
  }

  // Get display name for interval value
  getIntervalDisplayName(interval: MainPageInterval): string {
    switch (interval) {
      case 'Daily':
        return 'Daily';
      case 'Weekly':
        return 'Weekly';
      case 'Monthly':
        return 'Monthly';
      case 'Yearly':
        return 'Yearly';
      default:
        return 'Monthly';
    }
  }
}

export const dashboardService = new DashboardService(); 