
import { Trade, TradeItem } from '@/types/trade';

export const mockTrades: Trade[] = [
  {
    id: 'TRADE001',
    name: 'Electrical',
    category: 'Building Services',
    description: 'All electrical installations and systems',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'TRADE002',
    name: 'Plumbing',
    category: 'Building Services',
    description: 'Water supply, drainage, and sanitary systems',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 'TRADE003',
    name: 'HVAC',
    category: 'Building Services',
    description: 'Heating, Ventilation, and Air Conditioning systems',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: 'TRADE004',
    name: 'Masonry',
    category: 'Construction',
    description: 'Brick and block work, stone installations',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: 'TRADE005',
    name: 'Painting',
    category: 'Finishing',
    description: 'Interior and exterior painting services',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19'
  }
];

export const mockTradeItems: TradeItem[] = [
  {
    id: 'ITEM001',
    tradeId: 'TRADE001',
    tradeName: 'Electrical',
    name: 'Power Distribution Panels',
    unit: 'Each',
    category: 'Panels',
    unitPrice: 1500,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 'ITEM002',
    tradeId: 'TRADE001',
    tradeName: 'Electrical',
    name: 'Lighting Systems',
    unit: 'Sqm',
    category: 'Lighting',
    unitPrice: 250,
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21'
  },
  {
    id: 'ITEM003',
    tradeId: 'TRADE002',
    tradeName: 'Plumbing',
    name: 'Water Supply System',
    unit: 'Set',
    category: 'Supply',
    unitPrice: 3200,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  },
  {
    id: 'ITEM004',
    tradeId: 'TRADE003',
    tradeName: 'HVAC',
    name: 'Central Air Conditioning',
    unit: 'Each',
    category: 'Cooling',
    unitPrice: 5000,
    createdAt: '2024-01-23',
    updatedAt: '2024-01-23'
  }
];

export const tradeCategories = [
  'Building Services',
  'Construction',
  'Finishing',
  'Structural',
  'Infrastructure',
  'Landscaping',
  'Specialty'
];

export const tradeItemCategories = [
  'Panels',
  'Lighting',
  'Supply',
  'Cooling',
  'Heating',
  'Materials',
  'Equipment',
  'Labor'
];

export const tradeUnits = [
  'Each',
  'Sqm',
  'Set',
  'Lm',
  'Lot',
  'Roll',
  'Box',
  'Day',
  'Hour'
];
