
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Project } from '@/types/project';
import { TableSelectionCheckbox } from '@/components/TableSelectionCheckbox';

interface ProjectsTableContentProps {
  filteredProjects: Project[];
  selectedIds: Set<string>;
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onViewDetail: (projectId: string) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectsTableContent({
  filteredProjects,
  selectedIds,
  allSelected,
  onToggleAll,
  onToggleOne,
  onViewDetail,
  onEdit,
  onDelete
}: ProjectsTableContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects ({filteredProjects.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <TableSelectionCheckbox 
                  checked={allSelected} 
                  onCheckedChange={onToggleAll} 
                  ariaLabel="Select all projects"
                />
              </TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Project Code</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <TableSelectionCheckbox
                    checked={selectedIds.has(project.id)}
                    onCheckedChange={() => onToggleOne(project.id)}
                    ariaLabel={`Select project ${project.name}`}
                  />
                </TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.code}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(project.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
