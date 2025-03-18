import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Financial, FinancialType, FinancialStatus } from '@/types/financial';
import { formatCurrency } from '@/lib/utils/format';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, ClockIcon, CheckCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FinancialOverviewProps {
  financials: Financial[];
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ financials }) => {
  const { t } = useTranslation();

  // Calculate summary statistics
  const summary = React.useMemo(() => {
    const totalIncome = financials
      .filter(f => f.type === FinancialType.Income)
      .reduce((sum, f) => sum + f.amount, 0);

    const totalExpense = financials
      .filter(f => f.type === FinancialType.Expense)
      .reduce((sum, f) => sum + f.amount, 0);

    const pendingAmount = financials
      .filter(f => f.status === FinancialStatus.Pending)
      .reduce((sum, f) => sum + f.amount, 0);

    const completedAmount = financials
      .filter(f => f.status === FinancialStatus.Completed)
      .reduce((sum, f) => sum + f.amount, 0);

    return {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      pendingAmount,
      completedAmount,
    };
  }, [financials]);

  const formatYAxis = (value: number) => {
    return value.toLocaleString();
  };

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  // Prepare data for charts
  const chartData = React.useMemo(() => {
    const dailyData = financials.reduce((acc, f) => {
      const date = new Date(f.date);
      const day = date.toLocaleDateString('default', { weekday: 'short' });
      
      if (!acc[day]) {
        acc[day] = { income: 0, expense: 0 };
      }

      if (f.type === FinancialType.Income) {
        acc[day].income += f.amount;
      } else if (f.type === FinancialType.Expense) {
        acc[day].expense += f.amount;
      }

      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const weeklyData = financials.reduce((acc, f) => {
      const date = new Date(f.date);
      const week = `Week ${Math.ceil(date.getDate() / 7)}`;
      
      if (!acc[week]) {
        acc[week] = { income: 0, expense: 0 };
      }

      if (f.type === FinancialType.Income) {
        acc[week].income += f.amount;
      } else if (f.type === FinancialType.Expense) {
        acc[week].expense += f.amount;
      }

      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const monthlyData = financials.reduce((acc, f) => {
      const date = new Date(f.date);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }

      if (f.type === FinancialType.Income) {
        acc[month].income += f.amount;
      } else if (f.type === FinancialType.Expense) {
        acc[month].expense += f.amount;
      }

      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const yearlyData = financials.reduce((acc, f) => {
      const date = new Date(f.date);
      const year = date.getFullYear().toString();
      
      if (!acc[year]) {
        acc[year] = { income: 0, expense: 0 };
      }

      if (f.type === FinancialType.Income) {
        acc[year].income += f.amount;
      } else if (f.type === FinancialType.Expense) {
        acc[year].expense += f.amount;
      }

      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    return {
      daily: Object.entries(dailyData).map(([day, data]) => ({
        name: day,
        income: data.income,
        expense: data.expense,
      })),
      weekly: Object.entries(weeklyData).map(([week, data]) => ({
        name: week,
        income: data.income,
        expense: data.expense,
      })),
      monthly: Object.entries(monthlyData).map(([month, data]) => ({
        name: month,
        income: data.income,
        expense: data.expense,
      })),
      yearly: Object.entries(yearlyData).map(([year, data]) => ({
        name: year,
        income: data.income,
        expense: data.expense,
      })),
    };
  }, [financials]);

  // Custom mouse-over styles for bars
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

  // Custom tooltip style
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
            {t('financial.netIncome')}
          </CardTitle>
          {summary.netIncome >= 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.netIncome)}
          </div>
        </CardContent>
      </Card>

      {/* Pending Amount Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('financial.pendingAmount')}
          </CardTitle>
          <ClockIcon className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.pendingAmount)}
          </div>
        </CardContent>
      </Card>

      {/* Completed Amount Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('financial.completedAmount')}
          </CardTitle>
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.completedAmount)}
          </div>
        </CardContent>
      </Card>

      {/* Total Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('financial.totalTransactions')}
          </CardTitle>
          <RefreshCwIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {financials.length}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{t('financial.overview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily">{t('financial.daily')}</TabsTrigger>
              <TabsTrigger value="weekly">{t('financial.weekly')}</TabsTrigger>
              <TabsTrigger value="monthly">{t('financial.monthly')}</TabsTrigger>
              <TabsTrigger value="yearly">{t('financial.yearly')}</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.daily} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
                      name={t('financial.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.expense')} 
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
                    <XAxis dataKey="name" />
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
                      name={t('financial.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.expense')} 
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
                    <XAxis dataKey="name" />
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
                      name={t('financial.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.expense')} 
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
                    <XAxis dataKey="name" />
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
                      name={t('financial.income')} 
                      {...getBarProps('income')}
                    />
                    <Bar 
                      dataKey="expense" 
                      name={t('financial.expense')} 
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