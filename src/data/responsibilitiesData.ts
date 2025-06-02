
import { Responsibility } from '@/types/responsibility';

export const mockResponsibilities: Responsibility[] = [
  {
    id: 'RESP001',
    name: 'Installation',
    description: 'Complete installation of equipment and systems',
    category: 'Technical',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'RESP002',
    name: 'Testing',
    description: 'Comprehensive testing and quality assurance',
    category: 'Quality',
    isActive: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 'RESP003',
    name: 'Documentation',
    description: 'Preparation of technical documentation and manuals',
    category: 'Documentation',
    isActive: true,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: 'RESP004',
    name: 'Commissioning',
    description: 'System commissioning and handover procedures',
    category: 'Technical',
    isActive: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: 'RESP005',
    name: 'Maintenance Setup',
    description: 'Setup of maintenance procedures and schedules',
    category: 'Maintenance',
    isActive: true,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19'
  },
  {
    id: 'RESP006',
    name: 'Training',
    description: 'User training and knowledge transfer',
    category: 'Training',
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 'RESP007',
    name: 'Warranty Support',
    description: 'Warranty coverage and support services',
    category: 'Support',
    isActive: true,
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21'
  }
];

export const responsibilityCategories = [
  'Technical',
  'Quality',
  'Documentation',
  'Maintenance',
  'Training',
  'Support',
  'Safety',
  'Compliance'
];
