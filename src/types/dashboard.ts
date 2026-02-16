export interface Investment {
  id: string;
  amount: number;
  startDate: number;
  growthRate: number;
  plan: "basic" | "standard" | "premium";
}

export interface DashboardData {
  balance: number;
  investments: Investment[];
  walletAddress?: string;
  character?: "basic" | "standard" | "premium";
}
