import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  DollarSignIcon, 
  TrendingDownIcon, 
  TrendingUpIcon 
} from 'lucide-react';
import { Financial, FinancialType } from '@/types/financial';
import { formatCurrency } from '@/lib/utils/format';

interface FinancialOverviewProps {
  financials: Financial[];
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ financials }) => {
  const { t } = useTranslation();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Calculate financial summary
  useEffect(() => {
    if (!financials || financials.length === 0) return;

    // Calculate totals
    const income = financials
      .filter(f => f.type === FinancialType.Income)
      .reduce((sum, f) => sum + f.amount, 0);
    
    const expense = financials
      .filter(f => f.type === FinancialType.Expense)
      .reduce((sum, f) => sum + f.amount, 0);
    
    setTotalIncome(income);
    setTotalExpense(expense);
    setNetIncome(income - expense);

    // Prepare monthly data
    const monthlyMap = new Map<string, { month: string, income: number, expense: number }>();
    
    financials.forEach(f => {
      const date = new Date(f.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyMap.has(monthYear)) {
        monthlyMap.set(monthYear, { 
          month: monthYear, 
          income: 0, 
          expense: 0 
        });
      }
      
      const entry = monthlyMap.get(monthYear)!;
      
      if (f.type === FinancialType.Income) {
        entry.income += f.amount;
      } else if (f.type === FinancialType.Expense) {
        entry.expense += f.amount;
      }
    });
    
    // Sort by date
    const sortedMonthlyData = Array.from(monthlyMap.values())
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/').map(Number);
        const [bMonth, bYear] = b.month.split('/').map(Number);
        
        if (aYear !== bYear) return aYear - bYear;
        return aMonth - bMonth;
      });
    
    setMonthlyData(sortedMonthlyData);

    // Prepare pie chart data
    const typeMap = new Map<FinancialType, number>();
    
    financials.forEach(f => {
      if (!typeMap.has(f.type)) {
        typeMap.set(f.type, 0);
      }
      
      typeMap.set(f.type, (typeMap.get(f.type) || 0) + f.amount);
    });
    
    const pieChartData = Array.from(typeMap.entries()).map(([type, value]) => ({
      name: getTypeText(type),
      value
    }));
    
    setPieData(pieChartData);
  }, [financials]);

  // Get type text
  const getTypeText = (type: FinancialType) => {
    switch (type) {
      case FinancialType.Income:
        return t('financial.income');
      case FinancialType.Expense:
        return t('financial.expense');
      case FinancialType.Consultation:
        return t('financial.consultation');
      case FinancialType.Appointment:
        return t('financial.appointment');
      case FinancialType.Other:
        return t('financial.other');
      default:
        return t('financial.unknown');
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('financial.totalIncome')}
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              {t('financial.totalIncomeDescription')}
            </p>
          </CardContent>
        </Card>

        {/* Total Expense */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('financial.totalExpense')}
            </CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-muted-foreground">
              {t('financial.totalExpenseDescription')}
            </p>
          </CardContent>
        </Card>

        {/* Net Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('financial.netIncome')}
            </CardTitle>
            {netIncome >= 0 ? (
              <TrendingUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDownIcon className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(netIncome)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {netIncome >= 0 ? (
                <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span>
                {netIncome >= 0
                  ? t('financial.positiveNetIncomeDescription')
                  : t('financial.negativeNetIncomeDescription')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">{t('financial.monthlyOverview')}</TabsTrigger>
          <TabsTrigger value="distribution">{t('financial.incomeVsExpense')}</TabsTrigger>
        </TabsList>
        
        {/* Monthly Overview */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.monthlyOverview')}</CardTitle>
              <CardDescription>
                {t('financial.monthlyOverviewDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="income" name={t('financial.income')} fill="#4CAF50" />
                  <Bar dataKey="expense" name={t('financial.expense')} fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Income vs Expense Distribution */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.incomeVsExpense')}</CardTitle>
              <CardDescription>
                {t('financial.incomeVsExpenseDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 