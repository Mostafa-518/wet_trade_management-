export interface TradeItem {
  id: string;
  trade: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  wastagePercentage?: number;
}

export interface FormData {
  project: string;
  subcontractor: string;
  tradeItems: TradeItem[];
  responsibilities: string[];
  pdfFile: File | null;
  dateOfIssuing?: string;
  contractType?: 'subcontract' | 'ADD';
  addendumNumber?: string;
  parentSubcontractId?: string;
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

// Database trade item structure
export interface SubcontractTradeItemDB {
  id: string;
  subcontract_id: string;
  trade_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  wastage_percentage?: number;
}

// Updated Subcontract interface to match what components expect and database schema
export interface Subcontract {
  id: string;
  contractId: string;
  project: string;
  subcontractor: string;
  tradeItems: TradeItem[];
  responsibilities: string[];
  totalValue: number;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  dateOfIssuing?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  contractType: 'subcontract' | 'ADD';
  addendumNumber?: string;
  parentSubcontractId?: string;
}

// Frontend form data
export interface SubcontractFormData {
  project: string;
  subcontractor: string;
  tradeItems: TradeItem[];
  responsibilities: string[];
  pdfFile: File | null;
  dateOfIssuing?: string;
}

// Export from subcontractor types
export interface SubcontractorFormData {
  name: string;
  rep: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  category?: string;
}

export interface SubcontractorTableData {
  id: string;
  name: string;
  rep: string;
  email: string;
  phone: string;
  address: string;
  projects?: string[];
  totalValue?: number;
  activeSince?: string;
  status?: string;
}

export interface CreateSubcontractorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface SubcontractorAction {
  type: 'view' | 'edit' | 'delete';
  id: string;
  name: string;
}

export interface SubcontractorEditFormData {
  name: string;
  rep: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  category?: string;
}

export interface SubcontractorCreateData {
  name: string;
  rep: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  category?: string;
}