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

// Sample data for different time ranges
// Daily data - for 7 days view
const dailyData = [
  { date: "Jun 24, 2024", clients: 122, revenue: 5480 },
  { date: "Jun 25, 2024", clients: 146, revenue: 6580 },
  { date: "Jun 26, 2024", clients: 178, revenue: 8020 },
  { date: "Jun 27, 2024", clients: 155, revenue: 6980 },
  { date: "Jun 28, 2024", clients: 137, revenue: 6170 },
  { date: "Jun 29, 2024", clients: 103, revenue: 4640 },  // Weekend drop
  { date: "Jun 30, 2024", clients: 92, revenue: 4140 }    // Weekend drop
];

// Monthly data - for 30 days view
const monthlyData = [
  { date: "May 01, 2024", clients: 240, revenue: 10800 },
  { date: "May 10, 2024", clients: 255, revenue: 11500 },
  { date: "May 20, 2024", clients: 268, revenue: 12100 },
  { date: "Jun 01, 2024", clients: 284, revenue: 12800 },
  { date: "Jun 10, 2024", clients: 302, revenue: 13600 },
  { date: "Jun 20, 2024", clients: 318, revenue: 14300 },
  { date: "Jun 30, 2024", clients: 335, revenue: 15100 }
];

// Yearly data - for 90 days view
const yearlyData = [
  { date: "Jan 2024", clients: 225, revenue: 10100 },
  { date: "Feb 2024", clients: 238, revenue: 10700 },
  { date: "Mar 2024", clients: 255, revenue: 11500 },
  { date: "Apr 2024", clients: 268, revenue: 12100 },
  { date: "May 2024", clients: 284, revenue: 12800 },
  { date: "Jun 2024", clients: 335, revenue: 15100 }
];

export const OverviewChart = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = React.useState("90d");

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

  // Select appropriate data based on time range
  const filteredData = React.useMemo(() => {
    switch(timeRange) {
      case "7d":
        return dailyData;
      case "30d":
        return monthlyData;
      case "90d":
      default:
        return yearlyData;
    }
  }, [timeRange]);

  return (
    <Card className="col-span-2 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{t('dashboard.charts.overview')}</CardTitle>
          <CardDescription>
            {timeRange === "7d" 
              ? t('dashboard.charts.last7Days', { defaultValue: "Showing data for the last 7 days" }) 
              : timeRange === "30d" 
                ? t('dashboard.charts.last30Days', { defaultValue: "Showing data for the last 30 days" })
                : t('dashboard.charts.last90Days', { defaultValue: "Showing data for the last 3 months" })}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label={t('analytics.timeRange', { defaultValue: "Select time range" })}
          >
            <SelectValue placeholder={t('analytics.last90Days', { defaultValue: "Last 3 months" })} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              {t('analytics.last90Days', { defaultValue: "Last 3 months" })}
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              {t('analytics.last30Days', { defaultValue: "Last 30 days" })}
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              {t('analytics.last7Days', { defaultValue: "Last 7 days" })}
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
                data={filteredData}
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
                  tickFormatter={(value) => {
                    // Different formatting based on time range
                    if (timeRange === "7d") {
                      // For daily data, show day
                      const dateParts = value.split(", ")[0].split(" ");
                      return `${dateParts[0]} ${dateParts[1]}`;
                    } else if (timeRange === "30d") {
                      // For monthly data, show month and day
                      const dateParts = value.split(", ")[0].split(" ");
                      return `${dateParts[0]} ${dateParts[1]}`;
                    } else {
                      // For yearly data, just show month
                      return value;
                    }
                  }}
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
                  label={{ value: 'Clients', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
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
                  label={{ value: 'Revenue', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                />
                <Tooltip
                  cursor={{ stroke: "#f0f0f0", strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      // Format the date label based on time range
                      let formattedLabel = label;
                      if (timeRange === "7d" || timeRange === "30d") {
                        // For daily and monthly views, add year if not present
                        if (!label.includes("2024")) {
                          formattedLabel = `${label}, 2024`;
                        }
                      }
                      
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="mb-1 font-medium">{formattedLabel}</div>
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