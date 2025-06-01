
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectsTable } from '@/components/ProjectsTable';
import { ProjectForm } from '@/components/ProjectForm';
import { Project, ProjectFormData } from '@/types/project';

export function Projects() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateNew = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleViewDetail = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (projectId: string) => {
    console.log('Deleting project:', projectId);
  };

  const handleSave = (data: ProjectFormData) => {
    console.log('Saving project:', data);
    if (editingProject) {
      console.log('Updating existing project:', editingProject.id);
    } else {
      console.log('Creating new project');
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (showForm) {
    return (
      <ProjectForm
        project={editingProject}
        onSubmit={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProjectsTable 
      onCreateNew={handleCreateNew}
      onViewDetail={handleViewDetail}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
