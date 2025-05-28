
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '@/types/subcontract';
import { mockProjects, mockSubcontractors } from '@/data/mockData';

interface ProjectSubcontractorStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function ProjectSubcontractorStep({ formData, setFormData }: ProjectSubcontractorStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="project">Select Project</Label>
        <Select value={formData.project} onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a project..." />
          </SelectTrigger>
          <SelectContent>
            {mockProjects.map(project => (
              <SelectItem key={project.id} value={project.name}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subcontractor">Select Subcontractor</Label>
        <Select value={formData.subcontractor} onValueChange={(value) => setFormData(prev => ({ ...prev, subcontractor: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a subcontractor..." />
          </SelectTrigger>
          <SelectContent>
            {mockSubcontractors.map(sub => (
              <SelectItem key={sub.id} value={sub.name}>
                <div>
                  <div className="font-medium">{sub.name}</div>
                  <div className="text-sm text-muted-foreground">{sub.rep} • {sub.phone}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
