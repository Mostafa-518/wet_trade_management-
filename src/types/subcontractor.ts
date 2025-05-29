
export interface Subcontractor {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  trades: string[];
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  totalProjects: number;
  currentProjects: number;
  registrationDate: string;
  taxId: string;
  bankAccount: string;
}

export interface SubcontractorFormData {
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  trades: string[];
  taxId: string;
  bankAccount: string;
}
