
import { Trade, TradeItem } from '@/types/trade';

export const mockTrades: Trade[] = [
  {
    id: 'TRD001',
    name: 'Electrical',
    category: 'MEP',
    description: 'Electrical systems installation and maintenance',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'TRD002',
    name: 'Plumbing',
    category: 'MEP',
    description: 'Water supply and drainage systems',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    id: 'TRD003',
    name: 'HVAC',
    category: 'MEP',
    description: 'Heating, Ventilation, and Air Conditioning',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05'
  },
  {
    id: 'TRD004',
    name: 'General Construction',
    category: 'Civil',
    description: 'General construction and structural work',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  }
];

export const mockTradeItems: TradeItem[] = [
  {
    id: 'ITM001',
    tradeId: 'TRD001',
    tradeName: 'Electrical',
    name: 'Power Distribution Panels',
    unit: 'Each',
    category: 'Power Systems',
    unitPrice: 2500,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'ITM002',
    tradeId: 'TRD001',
    tradeName: 'Electrical',
    name: 'Lighting Systems',
    unit: 'Sqm',
    category: 'Lighting',
    unitPrice: 150,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 'ITM003',
    tradeId: 'TRD002',
    tradeName: 'Plumbing',
    name: 'Water Supply System',
    unit: 'Set',
    category: 'Water Systems',
    unitPrice: 5000,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    id: 'ITM004',
    tradeId: 'TRD003',
    tradeName: 'HVAC',
    name: 'Central Air Conditioning',
    unit: 'Each',
    category: 'Cooling Systems',
    unitPrice: 15000,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05'
  }
];
