import { useTranslation } from 'react-i18next';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('monthly');
  const { stats, isLoading, intervalDisplayName } = useDashboardData({ timeRange });

  const getComparisonText = () => {
    switch (timeRange) {
      case 'daily':
        return t('dashboard.stats.vsYesterday');
      case 'weekly':
        return t('dashboard.stats.vsLastWeek');
      case 'yearly':
        return t('dashboard.stats.vsLastYear');
      case 'monthly':
      default:
        return t('dashboard.stats.vsLastMonth');
    }
  };

  const getPeriodText = () => {
    switch (timeRange) {
      case 'daily':
        return t('dashboard.stats.today');
      case 'weekly':
        return t('dashboard.stats.thisWeek');
      case 'yearly':
        return t('dashboard.stats.thisYear');
      case 'monthly':
      default:
        return t('dashboard.stats.thisMonth');
    }
  };

  const comparisonText = getComparisonText();

  const defaultStats = [
    {
      title: t('dashboard.stats.totalClients'),
      value: "0",
      change: "0%",
      trend: 'up' as const,
      icon: Users,
      description: comparisonText
    },
    {
      title: t('dashboard.stats.appointments'),
      value: "0",
      change: "0%",
      trend: 'up' as const,
      icon: CalendarCheck,
      description: comparisonText
    },
    {
      title: t('dashboard.stats.revenue'),
      value: "$0",
      change: "0%",
      trend: 'up' as const,
      icon: DollarSign,
      description: comparisonText
    }
  ];

  const displayStats = !isLoading && stats ? [
    {
      title: t('dashboard.stats.totalClients'),
      value: stats.clients.value,
      change: stats.clients.change,
      trend: stats.clients.trend,
      icon: Users,
      description: comparisonText
    },
    {
      title: t('dashboard.stats.appointments'),
      value: stats.appointments.value,
      change: stats.appointments.change,
      trend: stats.appointments.trend,
      icon: CalendarCheck,
      description: comparisonText
    },
    {
      title: t('dashboard.stats.revenue'),
      value: stats.revenue.value,
      change: stats.revenue.change,
      trend: stats.revenue.trend,
      icon: DollarSign,
      description: comparisonText
    }
  ] : defaultStats;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.menu.dashboard')}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Show skeletons while loading
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-8 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))
        ) : (
          // Show stats when loaded
          displayStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <OverviewChart onTimeRangeChange={setTimeRange} initialTimeRange={timeRange} />
      </div>
    </div>
  );
};

export default Dashboard;