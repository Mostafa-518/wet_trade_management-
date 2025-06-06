
export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  code: string;
  location: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
}
