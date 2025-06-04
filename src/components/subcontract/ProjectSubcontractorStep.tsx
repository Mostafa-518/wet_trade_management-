
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FormData } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';
import { CreateProjectModal } from './CreateProjectModal';
import { CreateSubcontractorModal } from './CreateSubcontractorModal';

interface ProjectSubcontractorStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function ProjectSubcontractorStep({ formData, setFormData }: ProjectSubcontractorStepProps) {
  const { projects, subcontractors } = useData();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSubcontractorModal, setShowSubcontractorModal] = useState(false);

  const handleProjectCreated = (projectName: string) => {
    setFormData(prev => ({ ...prev, project: projectName }));
  };

  const handleSubcontractorCreated = (subcontractorName: string) => {
    setFormData(prev => ({ ...prev, subcontractor: subcontractorName }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="project">Select Project</Label>
        <div className="space-y-2">
          <Select value={formData.project} onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a project..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowProjectModal(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Project
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="subcontractor">Select Subcontractor</Label>
        <div className="space-y-2">
          <Select value={formData.subcontractor} onValueChange={(value) => setFormData(prev => ({ ...prev, subcontractor: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a subcontractor..." />
            </SelectTrigger>
            <SelectContent>
              {subcontractors.map(sub => (
                <SelectItem key={sub.id} value={sub.name}>
                  <div>
                    <div className="font-medium">{sub.name}</div>
                    <div className="text-sm text-muted-foreground">{sub.contactPerson} • {sub.phone}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSubcontractorModal(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Subcontractor
          </Button>
        </div>
      </div>

      <CreateProjectModal
        open={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      <CreateSubcontractorModal
        open={showSubcontractorModal}
        onClose={() => setShowSubcontractorModal(false)}
        onSubcontractorCreated={handleSubcontractorCreated}
      />
    </div>
  );
}
