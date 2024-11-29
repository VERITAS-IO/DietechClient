import { useTranslation } from 'react-i18next';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';

const Dashboard = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.stats.totalClients'),
      value: "248",
      change: "+12%",
      trend: 'up' as const,
      icon: Users,
      description: t('dashboard.stats.vsLastMonth')
    },
    {
      title: t('dashboard.stats.appointments'),
      value: "42",
      change: "+8%",
      trend: 'up' as const,
      icon: CalendarCheck,
      description: t('dashboard.stats.thisWeek')
    },
    {
      title: t('dashboard.stats.clientGrowth'),
      value: "15%",
      change: "+2.5%",
      trend: 'up' as const,
      icon: TrendingUp,
      description: t('dashboard.stats.vsLastQuarter')
    },
    {
      title: t('dashboard.stats.revenue'),
      value: "$12,450",
      change: "-4%",
      trend: 'down' as const,
      icon: DollarSign,
      description: t('dashboard.stats.vsLastMonth')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.menu.dashboard')}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <OverviewChart />
      </div>
    </div>
  );
};

export default Dashboard;