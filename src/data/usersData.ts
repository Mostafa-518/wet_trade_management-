
import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.rashid@company.com',
    role: 'admin',
    department: 'Management',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-06-04',
    phone: '+966501234567'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager', // was 'project_manager'
    department: 'Project Management',
    status: 'active',
    createdAt: '2024-02-10',
    lastLogin: '2024-06-03',
    phone: '+966507654321'
  },
  {
    id: '3',
    name: 'Omar Hassan',
    email: 'omar.hassan@company.com',
    role: 'manager', // was 'supervisor'
    department: 'Engineering',
    status: 'active',
    createdAt: '2024-03-05',
    lastLogin: '2024-06-02',
    phone: '+966509876543'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    role: 'manager', // was 'project_manager'
    department: 'Finance',
    status: 'inactive',
    createdAt: '2024-01-20',
    lastLogin: '2024-05-15',
    phone: '+966502468135'
  },
  {
    id: '5',
    name: 'Mohammed Al-Fayed',
    email: 'mohammed.fayed@company.com',
    role: 'viewer',
    department: 'Operations',
    status: 'suspended',
    createdAt: '2024-04-12',
    lastLogin: '2024-05-30',
    phone: '+966508642097'
  }
];
