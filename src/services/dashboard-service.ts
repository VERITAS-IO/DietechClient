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
        return MainPageInterval.Daily;
      case 'weekly':
        return MainPageInterval.Weekly;
      case 'monthly':
        return MainPageInterval.Monthly;
      case 'yearly':
        return MainPageInterval.Yearly;
      default:
        return MainPageInterval.Monthly; 
    }
  }

  // Get display name for interval value
  getIntervalDisplayName(interval: MainPageInterval): string {
    switch (interval) {
      case MainPageInterval.Daily:
        return 'Daily';
      case MainPageInterval.Weekly:
        return 'Weekly';
      case MainPageInterval.Monthly:
        return 'Monthly';
      case MainPageInterval.Yearly:
        return 'Yearly';
      default:
        return 'Monthly';
    }
  }
}

export const dashboardService = new DashboardService(); 