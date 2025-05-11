export enum MainPageInterval {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export interface MainPageOverviewItem {
  totalCount: number;
  direction: 'Up' | 'Down';
  changePercentage: string;
}

export interface MainPageOverviewChartItem {
  timestamp: number;
  incomes: number;
  clients: number;
}

export interface GetMainPageOverviewRequest {
  startDate?: Date;
  endDate?: Date;
  interval?: MainPageInterval;
}

export interface GetMainPageOverviewResponse {
  client: MainPageOverviewItem;
  appointment: MainPageOverviewItem;
  income: MainPageOverviewItem;
  mainPageOverviewChartItems: MainPageOverviewChartItem[];
  interval: string;
}

export interface GetMainPageChartRequest {
  interval?: MainPageInterval;
  startDate?: Date;
}

export interface MainPageOverviewChartResponse {
  intervals: MainPageOverviewChartItem[];
}

export interface FormattedChartDataItem {
  date: string;
  clients: number;
  revenue: number;
} 