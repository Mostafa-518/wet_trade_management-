
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetailView } from '@/components/ProjectDetailView';
import { useData } from '@/contexts/DataContext';

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects } = useData();

  const handleBack = () => {
    navigate('/projects');
  };

  const handleEdit = (project: any) => {
    navigate('/projects', { state: { editProject: project } });
  };

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground">The requested project could not be found.</p>
      </div>
    );
  }

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground">The requested project could not be found.</p>
      </div>
    );
  }

  return (
    <ProjectDetailView
      project={project}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
}
