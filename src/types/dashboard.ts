export enum MainPageInterval {
  Unknown = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4
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