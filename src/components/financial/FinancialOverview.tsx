import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Financial, GetFinancialOverviewInitResponse, IntervalData, FinancialInterval, FinancialIntervalMapping } from '@/types/financial';
import { formatCurrency } from '@/lib/utils/format';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, ClockIcon, CheckCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';

interface FinancialOverviewProps {
  overviewData: GetFinancialOverviewInitResponse;
  selectedInterval?: FinancialInterval;
  onIntervalChange?: (interval: FinancialInterval) => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ 
  overviewData,
  selectedInterval = FinancialInterval.Daily,
  onIntervalChange 
}) => {
  const { t } = useTranslation();

  // Convert interval to tab value
  const getTabValue = (interval: FinancialInterval): string => {
    switch (interval) {
      case FinancialInterval.Daily:
        return 'daily';
      case FinancialInterval.Weekly:
        return 'weekly';
      case FinancialInterval.Monthly:
        return 'monthly';
      case FinancialInterval.Yearly:
        return 'yearly';
      default:
        return 'daily';
    }
  };

  // Convert tab value to interval
  const getIntervalFromTab = (tab: string): FinancialInterval => {
    switch (tab) {
      case 'daily':
        return FinancialInterval.Daily;
      case 'weekly':
        return FinancialInterval.Weekly;
      case 'monthly':
        return FinancialInterval.Monthly;
      case 'yearly':
        return FinancialInterval.Yearly;
      default:
        return FinancialInterval.Daily;
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    const interval = getIntervalFromTab(value);
    onIntervalChange?.(interval);
  };

  // Helper function to get the correct interval data array
  const getIntervalData = (intervals: Record<string | number, IntervalData[]>, intervalType: FinancialInterval): IntervalData[] => {
    // Try to get data using string key first
    const stringKey = intervalType;
    if (intervals[stringKey] && intervals[stringKey].length > 0) {
      return intervals[stringKey];
    }
    
    // If not found, try using the numeric mapping
    const numericKey = FinancialIntervalMapping.toNumber[intervalType];
    if (numericKey && intervals[numericKey] && intervals[numericKey].length > 0) {
      return intervals[numericKey];
    }
    
    // If all else fails, return empty array
    return [];
  };

  // Transform interval data to chart format
  const chartData = useMemo(() => {
    if (!overviewData.intervals) {
      return { daily: [], weekly: [], monthly: [], yearly: [] };
    }
    
    // Get data for each interval type using the helper function
    const dailyData = getIntervalData(overviewData.intervals, FinancialInterval.Daily);
    const weeklyData = getIntervalData(overviewData.intervals, FinancialInterval.Weekly);
    const monthlyData = getIntervalData(overviewData.intervals, FinancialInterval.Monthly);
    const yearlyData = getIntervalData(overviewData.intervals, FinancialInterval.Yearly);
    
    const formatIntervalData = (intervalData: IntervalData[]) => {
      return intervalData.map(item => {
        try {
          // Parse the ISO date string
          const date = parseISO(item.date);
          
          // Format the date based on interval type
          let label = format(date, 'MMM dd');
          
          // For monthly data, use month only
          if (item.date.includes('T00:00:00')) {
            if (item.date.endsWith('T00:00:00')) {
              label = format(date, 'MMM yyyy'); // Monthly format
            } else if (item.date.endsWith('T00:00:00Z')) {
              label = format(date, 'MMM dd'); // Weekly/Daily format
            }
          }
          
          // For yearly data, use year only
          if (item.date.includes('-01-01T00:00:00')) {
            label = format(date, 'yyyy');
          }
          
          return {
            label,
            income: item.totalIncome || 0,
            expense: item.totalExpenses || 0,
            netIncome: item.totalNetIncome || 0,
          };
        } catch (error) {
          console.error('Error formatting interval data:', error, item);
          return {
            label: 'Error',
            income: 0,
            expense: 0,
            netIncome: 0
          };
        }
      });
    };

    return {
      daily: formatIntervalData(dailyData),
      weekly: formatIntervalData(weeklyData),
      monthly: formatIntervalData(monthlyData),
      yearly: formatIntervalData(yearlyData),
    };
  }, [overviewData?.intervals]);

  const formatYAxis = (value: number) => {
    return value.toLocaleString();
  };

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  const getBarProps = (dataKey: string) => {
    if (dataKey === 'income') {
      return {
        fill: "hsl(142, 76%, 36%)",
        activeBar: { fill: "hsl(142, 76%, 50%)" }, // Lighter green on hover
        radius: [4, 4, 0, 0] as [number, number, number, number],
      };
    } else {
      return {
        fill: "hsl(0, 84%, 60%)",
        activeBar: { fill: "hsl(0, 84%, 70%)" }, // Lighter red on hover
        radius: [4, 4, 0, 0] as [number, number, number, number],
      };
    }
  };

  const tooltipStyle = {
    backgroundColor: 'rgba(22, 22, 22, 0.9)',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    padding: '8px 12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Net Income Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('financial.overview.netIncome')}
          </CardTitle>
          {(overviewData.totalNetIncome || 0) >= 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(overviewData.totalNetIncome || 0)}
          </div>
        </CardContent>
      </Card>

      {/* Pending Amount Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('financial.overview.pendingAmount')}
          </CardTitle>
          <ClockIcon className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(overviewData.pendingIncome || 0)}
          </div>
        </CardContent>
      </Card>

      {/* Completed Amount Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('financial.overview.completedAmount')}
          </CardTitle>
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(overviewData.completedIncomes || 0)}
          </div>
        </CardContent>
      </Card>

      {/* Total Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('financial.overview.totalTransactions')}
          </CardTitle>
          <RefreshCwIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overviewData.totalTransactions || 0}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{t('financial.overview.chartTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={getTabValue(selectedInterval)} 
            value={getTabValue(selectedInterval)} 
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="daily">{t('financial.overview.daily')}</TabsTrigger>
              <TabsTrigger value="weekly">{t('financial.overview.weekly')}</TabsTrigger>
              <TabsTrigger value="monthly">{t('financial.overview.monthly')}</TabsTrigger>
              <TabsTrigger value="yearly">{t('financial.overview.yearly')}</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.daily} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis 
                      width={50} 
                      tickFormatter={formatYAxis} 
                      label={{ 
                        value: '$', 
                        position: 'insideLeft', 
                        offset: -5,
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      contentStyle={tooltipStyle}
                      cursor={{ fill: 'rgba(142, 255, 158, 0.1)' }} // Light green transparent overlay
                    />
                    <Legend />
                    <Bar 
                      dataKey="income" 
                      name={t('financial.type.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.type.expense')} 
                      {...getBarProps('expense')}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.weekly} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis 
                      width={50} 
                      tickFormatter={formatYAxis} 
                      label={{ 
                        value: '$', 
                        position: 'insideLeft', 
                        offset: -5,
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      contentStyle={tooltipStyle}
                      cursor={{ fill: 'rgba(142, 255, 158, 0.1)' }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="income" 
                      name={t('financial.type.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.type.expense')} 
                      {...getBarProps('expense')}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.monthly} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis 
                      width={50} 
                      tickFormatter={formatYAxis} 
                      label={{ 
                        value: '$', 
                        position: 'insideLeft', 
                        offset: -5,
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      contentStyle={tooltipStyle}
                      cursor={{ fill: 'rgba(142, 255, 158, 0.1)' }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="income" 
                      name={t('financial.type.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.type.expense')} 
                      {...getBarProps('expense')}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="yearly" className="space-y-4">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.yearly} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis 
                      width={50} 
                      tickFormatter={formatYAxis} 
                      label={{ 
                        value: '$', 
                        position: 'insideLeft', 
                        offset: -5,
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      contentStyle={tooltipStyle}
                      cursor={{ fill: 'rgba(142, 255, 158, 0.1)' }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="income" 
                      name={t('financial.type.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.type.expense')} 
                      {...getBarProps('expense')}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 