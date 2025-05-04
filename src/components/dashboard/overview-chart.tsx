import * as React from "react";
import { useTranslation } from 'react-i18next';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data";

interface OverviewChartProps {
  initialTimeRange?: string;
  onTimeRangeChange?: (timeRange: string) => void;
}

export const OverviewChart = ({ 
  initialTimeRange = "monthly", 
  onTimeRangeChange 
}: OverviewChartProps) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = React.useState(initialTimeRange);

  const { isLoading, isError, chartData, intervalDisplayName } = useDashboardData({ timeRange });

  // When timeRange changes, notify parent component
  React.useEffect(() => {
    if (onTimeRangeChange) {
      onTimeRangeChange(timeRange);
    }
  }, [timeRange, onTimeRangeChange]);

  const chartConfig = {
    clients: {
      label: t('dashboard.charts.clients', { defaultValue: 'Clients' }),
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: t('dashboard.charts.revenue', { defaultValue: 'Revenue' }),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Function to handle timeRange change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  if (isLoading) {
    return (
      <Card className="col-span-2 w-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-10 w-[160px]" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-2 w-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>{t('dashboard.charts.overview')}</CardTitle>
            <CardDescription className="text-red-500">
              {t('common.errorOccurred')}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-[350px] w-full items-center justify-center">
            <p>{t('common.errorOccurred')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{t('dashboard.charts.overview')}</CardTitle>
          <CardDescription>
            {t('dashboard.charts.interval', { intervalName: t(`dashboard.charts.intervals.${timeRange}`) })}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label={t('dashboard.charts.selectTimeRange', { defaultValue: "Select time range" })}
          >
            <SelectValue placeholder={t(`dashboard.charts.intervals.${timeRange}`)} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="daily" className="rounded-lg">
              {t('dashboard.charts.intervals.daily')}
            </SelectItem>
            <SelectItem value="weekly" className="rounded-lg">
              {t('dashboard.charts.intervals.weekly')}
            </SelectItem>
            <SelectItem value="monthly" className="rounded-lg">
              {t('dashboard.charts.intervals.monthly')}
            </SelectItem>
            <SelectItem value="yearly" className="rounded-lg">
              {t('dashboard.charts.intervals.yearly')}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px] w-full">
          <ChartContainer 
            config={chartConfig}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData}
                margin={{ top: 30, right: 30, left: 10, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="clientsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
                <YAxis
                  yAxisId="clients"
                  orientation="left"
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickMargin={8}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => value.toString()}
                  label={{ value: t('dashboard.charts.clients', { defaultValue: 'Clients' }), angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <YAxis
                  yAxisId="revenue"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tickMargin={8}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => new Intl.NumberFormat(undefined, {
                    style: 'currency', 
                    currency: 'USD',
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)}
                  label={{ value: t('dashboard.charts.revenue', { defaultValue: 'Revenue' }), angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                />
                <Tooltip
                  cursor={{ stroke: "#f0f0f0", strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {                      
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="mb-1 font-medium">{label}</div>
                          {payload.map((entry, index) => (
                            <div key={`item-${index}`} className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: entry.color }} 
                                />
                                <span className="text-sm text-muted-foreground">
                                  {entry.name}:
                                </span>
                              </div>
                              <span className="font-medium">
                                {entry.name === chartConfig.revenue.label 
                                  ? new Intl.NumberFormat(undefined, {
                                      style: 'currency',
                                      currency: 'USD',
                                      maximumFractionDigits: 0
                                    }).format(Number(entry.value)) 
                                  : entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clients"
                  yAxisId="clients"
                  name={chartConfig.clients.label}
                  stroke={chartConfig.clients.color}
                  fill="url(#clientsGradient)"
                  activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
                  isAnimationActive={true}
                  animationDuration={1500}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  yAxisId="revenue"
                  name={chartConfig.revenue.label}
                  stroke={chartConfig.revenue.color}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
                  isAnimationActive={true}
                  animationDuration={1500}
                  dot={false}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ bottom: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};