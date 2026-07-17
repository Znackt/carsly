export interface OverviewItem {
  id: number;
  title: string;
  value: string;
}

export interface ChartData {
  name: string;
  value: number;
  label: string;
}

export interface TrendItem {
  id: number;
  title: string;
  mainStat: string;
  subStat: string;
  isPositive: boolean;
  chartData: ChartData[];
}

export interface InventoryItem {
  id: number;
  item: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
}

export interface InventoryData {
  overview: OverviewItem[];
  trends: TrendItem[];
  inventoryList: InventoryItem[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  label: string;
}

export interface TrendWidget {
  id: string;
  title: string;
  mainStat: string;
  subStat: string;
  isPositive: boolean;
  type: 'line' | 'bar';
  chartData: ChartDataPoint[];
}

export interface AnalyticsData {
  trends: TrendWidget[];
  // You can add your report logs type here later
}
