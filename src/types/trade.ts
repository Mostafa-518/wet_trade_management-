
export interface Trade {
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeFormData {
  name: string;
  category: string;
  description: string;
}

export interface TradeSearchFilters {
  name: string;
  category: string;
  description: string;
}

export interface TradeItem {
  id: string;
  tradeId: string;
  tradeName: string;
  name: string;
  unit: string;
  category: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface TradeItemFormData {
  tradeId: string;
  name: string;
  unit: string;
  category: string;
  unitPrice: number;
}

export interface TradeItemSearchFilters {
  name: string;
  tradeName: string;
  category: string;
  unit: string;
}
