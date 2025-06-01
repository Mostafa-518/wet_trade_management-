
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetailView } from '@/components/ProjectDetailView';
import { mockProjects } from '@/data/projectsData';

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

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

  return (
    <ProjectDetailView
      projectId={projectId}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
}
