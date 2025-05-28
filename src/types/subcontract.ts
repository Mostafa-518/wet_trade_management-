
export interface TradeItem {
  id: string;
  trade: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface FormData {
  project: string;
  subcontractor: string;
  tradeItems: TradeItem[];
  responsibilities: string[];
  pdfFile: File | null;
}

export interface Project {
  id: string;
  name: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  rep: string;
  phone: string;
}

export interface TradeItemOption {
  item: string;
  unit: string;
}

export interface SubcontractStepperProps {
  onClose: () => void;
  onSave: (data: any) => void;
}
