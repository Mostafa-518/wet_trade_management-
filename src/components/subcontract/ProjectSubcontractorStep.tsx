
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
    // Find the project by name to get its ID
    const project = projects.find(p => p.name === projectName);
    if (project) {
      setFormData(prev => ({ ...prev, project: project.id }));
    }
  };

  const handleSubcontractorCreated = (subcontractorName: string) => {
    // Find the subcontractor by name to get its ID
    const subcontractor = subcontractors.find(s => s.name === subcontractorName);
    if (subcontractor) {
      setFormData(prev => ({ ...prev, subcontractor: subcontractor.id }));
    }
  };

  const selectedProject = projects.find(p => p.id === formData.project);
  const selectedSubcontractor = subcontractors.find(s => s.id === formData.subcontractor);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="project">Select Project</Label>
        <div className="space-y-2">
          <Select 
            value={formData.project} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a project...">
                {selectedProject ? selectedProject.name : "Choose a project..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.code} • {project.location}</div>
                  </div>
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
          <Select 
            value={formData.subcontractor} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, subcontractor: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a subcontractor...">
                {selectedSubcontractor ? selectedSubcontractor.name : "Choose a subcontractor..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {subcontractors.map(sub => (
                <SelectItem key={sub.id} value={sub.id}>
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
