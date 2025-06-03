
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Edit, Trash2, Eye, FileDown } from 'lucide-react';
import { Project, ProjectSearchFilters } from '@/types/project';
import { useData } from '@/contexts/DataContext';

interface ProjectsTableProps {
  onCreateNew: () => void;
  onViewDetail: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectsTable({ onCreateNew, onViewDetail, onEdit, onDelete }: ProjectsTableProps) {
  const { projects } = useData();
  const [searchFilters, setSearchFilters] = useState<ProjectSearchFilters>({
    name: '',
    code: '',
    location: ''
  });

  const filteredProjects = projects.filter(project => {
    return (
      project.name.toLowerCase().includes(searchFilters.name.toLowerCase()) &&
      project.code.toLowerCase().includes(searchFilters.code.toLowerCase()) &&
      project.location.toLowerCase().includes(searchFilters.location.toLowerCase())
    );
  });

  const handleFilterChange = (field: keyof ProjectSearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({ name: '', code: '', location: '' });
  };

  const handleImportExcel = () => {
    console.log('Import from Excel clicked');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportExcel}>
            <FileDown className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button onClick={onCreateNew}>
            <FileText className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

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
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Project Code</label>
              <Input
                placeholder="Search by project code..."
                value={searchFilters.code}
                onChange={(e) => handleFilterChange('code', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input
                placeholder="Search by location..."
                value={searchFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Project Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.code}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetail(project.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
