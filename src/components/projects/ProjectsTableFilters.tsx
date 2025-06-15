
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ProjectSearchFilters } from '@/types/project';

interface ProjectsTableFiltersProps {
  searchFilters: ProjectSearchFilters;
  onFilterChange: (field: keyof ProjectSearchFilters, value: string) => void;
  onClearFilters: () => void;
}

export function ProjectsTableFilters({ 
  searchFilters, 
  onFilterChange, 
  onClearFilters 
}: ProjectsTableFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Project Name</label>
            <Input
              placeholder="Search by project name..."
              value={searchFilters.name}
              onChange={(e) => onFilterChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Project Code</label>
            <Input
              placeholder="Search by project code..."
              value={searchFilters.code}
              onChange={(e) => onFilterChange('code', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Input
              placeholder="Search by location..."
              value={searchFilters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
