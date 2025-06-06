
export interface Responsibility {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResponsibilityFormData {
  name: string;
  description?: string;
  category?: string;
}

export interface ResponsibilitySearchFilters {
  name: string;
  category: string;
}
