export interface Investment {
  id: string;
  amount: number;
  startDate: number;
  growthRate: number;
}

export interface DashboardData {
  balance: number;
  investments: Investment[];
  walletAddress?: string;
}
