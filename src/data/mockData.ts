
import { Project, Subcontractor, TradeItemOption } from '@/types/subcontract';

export const mockProjects: Project[] = [
  { id: '1', name: 'Residential Complex A' },
  { id: '2', name: 'Commercial Tower B' },
  { id: '3', name: 'Villa Project C' },
];

export const mockSubcontractors: Subcontractor[] = [
  { id: '1', name: 'Al-Khaleej Construction', rep: 'Ahmed Ali', phone: '+20 123 456 7890' },
  { id: '2', name: 'Modern Plumbing Co.', rep: 'Sarah Hassan', phone: '+20 123 456 7891' },
  { id: '3', name: 'Elite HVAC Systems', rep: 'Mohamed Farid', phone: '+20 123 456 7892' },
];

export const mockContracts = [
  {
    id: 'SC001',
    projectName: 'Downtown Office Complex',
    subcontractor: 'Al-Khaleej Construction',
    trade: 'General Construction',
    value: '$2,500,000',
    status: 'Active'
  },
  {
    id: 'SC002',
    projectName: 'Residential Tower Phase 1',
    subcontractor: 'Modern Plumbing Co.',
    trade: 'Plumbing',
    value: '$150,000',
    status: 'Draft'
  },
  {
    id: 'SC003',
    projectName: 'Shopping Mall Renovation',
    subcontractor: 'Elite HVAC Systems',
    trade: 'HVAC',
    value: '$300,000',
    status: 'Active'
  },
  {
    id: 'SC004',
    projectName: 'Downtown Office Complex',
    subcontractor: 'Elite HVAC Systems',
    trade: 'HVAC',
    value: '$180,000',
    status: 'Draft'
  }
];

export const mockTrades: Record<string, TradeItemOption[]> = {
  'Electrical': [
    { item: 'Power Distribution Panels', unit: 'Each' },
    { item: 'Lighting Systems', unit: 'Sqm' },
    { item: 'Emergency Power Systems', unit: 'Set' }
  ],
  'Plumbing': [
    { item: 'Water Supply System', unit: 'Set' },
    { item: 'Sewage System', unit: 'Set' },
    { item: 'Water Tanks', unit: 'Each' }
  ],
  'HVAC': [
    { item: 'Central Air Conditioning', unit: 'Each' },
    { item: 'Ventilation System', unit: 'Sqm' },
    { item: 'Exhaust Fans', unit: 'Each' }
  ]
};

export const responsibilities = [
  'Installation',
  'Testing',
  'Documentation',
  'Commissioning',
  'Maintenance Setup',
  'Training',
  'Warranty Support'
];
