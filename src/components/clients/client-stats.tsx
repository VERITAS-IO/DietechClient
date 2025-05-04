import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ClientStats() {
  const { t } = useTranslation();
  
  const stats = [
    {
      title: t('client.stats.totalClients'),
      value: "2,420",
      icon: Users,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: t('dashboard.stats.appointments'),
      value: "1,210",
      icon: Calendar,
      trend: "+18%",
      trendUp: true,
    },

    {
      title: t('appointment.time'),
      value: "45m",
      icon: Clock,
      trend: "-3%",
      trendUp: false,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trendUp ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              {stat.trend} {t('dashboard.stats.vsLastMonth')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}