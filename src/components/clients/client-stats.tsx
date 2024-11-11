import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    title: "Total Clients",
    value: "2,420",
    icon: Users,
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Active Diets",
    value: "1,210",
    icon: TrendingUp,
    trend: "+18%",
    trendUp: true,
  },
  {
    title: "Appointments Today",
    value: "24",
    icon: Calendar,
    trend: "+5%",
    trendUp: true,
  },
  {
    title: "Avg. Session Time",
    value: "45m",
    icon: Clock,
    trend: "-3%",
    trendUp: false,
  },
];

export function ClientStats() {
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
              {stat.trend} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}