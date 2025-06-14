
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface SearchCondition {
  field: string;
  value: string;
}

interface AdvancedSearchProps {
  onSearch: (conditions: SearchCondition[]) => void;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [field, setField] = useState('contractId');
  const [value, setValue] = useState('');
  const [conditions, setConditions] = useState<SearchCondition[]>([]);

  const searchFields = [
    { value: 'contractId', label: 'Contract ID' },
    { value: 'project', label: 'Project' },
    { value: 'subcontractor', label: 'Subcontractor' },
    { value: 'trade', label: 'Trade' },
    { value: 'item', label: 'Trade Item' },
    { value: 'status', label: 'Status' },
  ];

  const addCondition = () => {
    if (value.trim()) {
      const newConditions = [...conditions, { field, value: value.trim() }];
      setConditions(newConditions);
      setValue('');
      onSearch(newConditions);
    }
  };

  const removeCondition = (indexToRemove: number) => {
    const newConditions = conditions.filter((_, index) => index !== indexToRemove);
    setConditions(newConditions);
    onSearch(newConditions);
  };

  const clearAll = () => {
    setConditions([]);
    onSearch([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCondition();
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Search Field</label>
          <Select value={field} onValueChange={setField}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchFields.map((fieldOption) => (
                <SelectItem key={fieldOption.value} value={fieldOption.value}>
                  {fieldOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-2">
          <label className="text-sm font-medium mb-1 block">Value</label>
          <Input
            type="text"
            placeholder="Enter search value..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <Button onClick={addCondition} disabled={!value.trim()}>
          Add Condition
        </Button>
      </div>

      {/* Display active conditions */}
      {conditions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <strong className="text-sm">Active Search Conditions:</strong>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
              >
                <span className="font-medium">
                  {searchFields.find(f => f.value === condition.field)?.label}:
                </span>
                <span>{condition.value}</span>
                <button
                  onClick={() => removeCondition(idx)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
