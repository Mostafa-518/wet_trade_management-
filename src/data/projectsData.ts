
import { Project } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: 'PRJ001',
    name: 'Downtown Office Complex',
    code: 'DOC-2024',
    location: 'New York, NY',
    status: 'active',
    description: 'Modern office complex in downtown area',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'PRJ002',
    name: 'Residential Tower Phase 1',
    code: 'RTP1-2024',
    location: 'Los Angeles, CA',
    status: 'planning',
    description: 'First phase of residential tower development',
    startDate: '2024-02-10',
    endDate: '2025-02-10',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    id: 'PRJ003',
    name: 'Shopping Mall Renovation',
    code: 'SMR-2024',
    location: 'Chicago, IL',
    status: 'on_hold',
    description: 'Complete renovation of existing shopping mall',
    startDate: '2024-03-05',
    endDate: '2024-11-05',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05'
  },
  {
    id: 'PRJ004',
    name: 'Highway Bridge Construction',
    code: 'HBC-2024',
    location: 'Houston, TX',
    status: 'completed',
    description: 'New highway bridge construction project',
    startDate: '2024-03-20',
    endDate: '2024-09-20',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  }
];
