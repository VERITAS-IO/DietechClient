import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { dashboardService } from '@/services/dashboard-service';
import { 
  FormattedChartDataItem, 
  MainPageInterval 
} from '@/types/dashboard';
import { useTranslation } from 'react-i18next';

interface UseDashboardDataOptions {
  timeRange: string;
}

export function useDashboardData({ timeRange }: UseDashboardDataOptions) {
  const { t } = useTranslation();
  
  const interval = useMemo(() => {
    return dashboardService.getIntervalFromTimeRange(timeRange);
  }, [timeRange]);
  
  const intervalDisplayName = useMemo(() => {
    return t(`dashboard.charts.intervals.${timeRange}`);
  }, [t, timeRange]);
  
  const overviewQuery = useQuery({
    queryKey: ['dashboardOverview', interval],
    queryFn: () => dashboardService.getOverview({ interval }),
  });
  
  const formattedChartData = useMemo<FormattedChartDataItem[]>(() => {
    if (overviewQuery.data && overviewQuery.data.mainPageOverviewChartItems && 
        overviewQuery.data.mainPageOverviewChartItems.length > 0) {
      return overviewQuery.data.mainPageOverviewChartItems.map(item => formatChartItem(item, interval));
    }
    
    return [];
  }, [overviewQuery.data, interval]);

  function formatChartItem(item: { timestamp: number; incomes: number; clients: number }, currentInterval: MainPageInterval): FormattedChartDataItem {
    const date = new Date(item.timestamp);
    
    let formattedDate = '';
    switch (currentInterval) {
      case 'Daily':
        formattedDate = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        break;
      case 'Weekly':
        formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        break;
      case 'Monthly':
        formattedDate = date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
        break;
      case 'Yearly':
        formattedDate = date.toLocaleDateString(undefined, { year: 'numeric' });
        break;
      default:
        formattedDate = date.toLocaleDateString();
    }

    return {
      date: formattedDate,
      clients: item.clients,
      revenue: item.incomes
    };
  }

  // Calculate stats from overview data
  const stats = useMemo(() => {
    if (!overviewQuery.data) {
      return null;
    }
    
    return {
      clients: {
        value: overviewQuery.data.client.totalCount.toString(),
        change: overviewQuery.data.client.changePercentage,
        trend: overviewQuery.data.client.direction.toLowerCase() as 'up' | 'down'
      },
      appointments: {
        value: overviewQuery.data.appointment.totalCount.toString(),
        change: overviewQuery.data.appointment.changePercentage,
        trend: overviewQuery.data.appointment.direction.toLowerCase() as 'up' | 'down'
      },
      revenue: {
        value: `$${overviewQuery.data.income.totalCount.toLocaleString()}`,
        change: overviewQuery.data.income.changePercentage,
        trend: overviewQuery.data.income.direction.toLowerCase() as 'up' | 'down'
      }
    };
  }, [overviewQuery.data]);

  return {
    isLoading: overviewQuery.isLoading,
    isError: overviewQuery.isError,
    error: overviewQuery.error,
    chartData: formattedChartData,
    stats,
    interval: overviewQuery.data?.interval,
    intervalDisplayName
  };
} 