
export interface Subcontractor {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber?: string;
  rating: number;
  trades: string[];
  status: 'active' | 'inactive' | 'suspended';
  totalProjects: number;
  currentProjects: number;
  taxId: string;
  bankAccount: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubcontractorFormData {
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber?: string;
  rating: number;
  taxId: string;
  bankAccount: string;
}
