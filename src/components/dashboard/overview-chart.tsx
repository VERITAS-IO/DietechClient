import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
  import { useTranslation } from 'react-i18next';
  
  const chartData = [
    { name: 'Jan', clients: 40, revenue: 2400 },
    { name: 'Feb', clients: 45, revenue: 2800 },
    { name: 'Mar', clients: 55, revenue: 3200 },
    { name: 'Apr', clients: 60, revenue: 3600 },
    { name: 'May', clients: 65, revenue: 4000 },
    { name: 'Jun', clients: 75, revenue: 4400 },
  ];
  
  export const OverviewChart = () => {
    const { t } = useTranslation();
  
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{t('dashboard.charts.overview')}</CardTitle>
          <CardDescription>
            {t('dashboard.charts.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="clients" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };