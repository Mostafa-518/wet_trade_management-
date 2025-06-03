
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectsTable } from '@/components/ProjectsTable';
import { ProjectForm } from '@/components/ProjectForm';
import { Project, ProjectFormData } from '@/types/project';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function Projects() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { addProject, updateProject, deleteProject } = useData();
  const { toast } = useToast();

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
    deleteProject(projectId);
    toast({
      title: "Project deleted",
      description: "The project has been removed successfully."
    });
  };

  const handleSave = (data: ProjectFormData) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      toast({
        title: "Project updated",
        description: "The project has been updated successfully."
      });
    } else {
      addProject(data);
      toast({
        title: "Project created",
        description: "A new project has been created successfully."
      });
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
