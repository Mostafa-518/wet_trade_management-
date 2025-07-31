
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'supervisor' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  avatar?: string;
}
