
import { Trade, TradeItem } from '@/types/trade';

export const mockTrades: Trade[] = [
  {
    id: 'TRADE001',
    name: 'Electrical',
    category: 'Building Services',
    description: 'All electrical installations and systems',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: 'TRADE002',
    name: 'Plumbing',
    category: 'Building Services',
    description: 'Water supply, drainage, and sanitary systems',
    created_at: '2024-01-16',
    updated_at: '2024-01-16'
  },
  {
    id: 'TRADE003',
    name: 'HVAC',
    category: 'Building Services',
    description: 'Heating, Ventilation, and Air Conditioning systems',
    created_at: '2024-01-17',
    updated_at: '2024-01-17'
  },
  {
    id: 'TRADE004',
    name: 'Masonry',
    category: 'Construction',
    description: 'Brick and block work, stone installations',
    created_at: '2024-01-18',
    updated_at: '2024-01-18'
  },
  {
    id: 'TRADE005',
    name: 'Painting',
    category: 'Finishing',
    description: 'Interior and exterior painting services',
    created_at: '2024-01-19',
    updated_at: '2024-01-19'
  }
];

export const mockTradeItems: TradeItem[] = [
  {
    id: 'ITEM001',
    trade_id: 'TRADE001',
    name: 'Power Distribution Panels',
    unit: 'Each',
    description: 'Electrical power distribution panels',
    created_at: '2024-01-20',
    updated_at: '2024-01-20'
  },
  {
    id: 'ITEM002',
    trade_id: 'TRADE001',
    name: 'Lighting Systems',
    unit: 'Sqm',
    description: 'LED lighting installation',
    created_at: '2024-01-21',
    updated_at: '2024-01-21'
  },
  {
    id: 'ITEM003',
    trade_id: 'TRADE002',
    name: 'Water Supply System',
    unit: 'Set',
    description: 'Complete water supply installation',
    created_at: '2024-01-22',
    updated_at: '2024-01-22'
  },
  {
    id: 'ITEM004',
    trade_id: 'TRADE003',
    name: 'Central Air Conditioning',
    unit: 'Each',
    description: 'Central AC unit installation',
    created_at: '2024-01-23',
    updated_at: '2024-01-23'
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
