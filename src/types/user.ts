
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer'; // updated to match new enum
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  avatar?: string;
}
