
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsibilitiesTable } from '@/components/ResponsibilitiesTable';
import { ResponsibilityForm } from '@/components/ResponsibilityForm';
import { ResponsibilityDetailView } from '@/components/ResponsibilityDetailView';
import { Responsibility, ResponsibilityFormData } from '@/types/responsibility';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function Responsibilities() {
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'form' | 'detail'>('table');
  const [editingResponsibility, setEditingResponsibility] = useState<Responsibility | null>(null);
  const [viewingResponsibilityId, setViewingResponsibilityId] = useState<string>('');
  
  const { responsibilities, addResponsibility, updateResponsibility, deleteResponsibility } = useData();
  const { toast } = useToast();

  const handleCreateNew = () => {
    setEditingResponsibility(null);
    setView('form');
  };

  const handleEdit = (responsibility: Responsibility) => {
    setEditingResponsibility(responsibility);
    setView('form');
  };

  const handleDelete = (responsibilityId: string) => {
    deleteResponsibility(responsibilityId);
    toast({
      title: "Responsibility deleted",
      description: "The responsibility has been removed successfully."
    });
  };

  const handleViewDetail = (responsibilityId: string) => {
    setViewingResponsibilityId(responsibilityId);
    setView('detail');
  };

  const handleSave = (data: ResponsibilityFormData) => {
    if (editingResponsibility) {
      updateResponsibility(editingResponsibility.id, data);
      toast({
        title: "Responsibility updated",
        description: "The responsibility has been updated successfully."
      });
    } else {
      const newResponsibility = addResponsibility(data);
      toast({
        title: "Responsibility created",
        description: "A new responsibility has been created successfully."
      });
    }
    setView('table');
    setEditingResponsibility(null);
  };

  const handleCancel = () => {
    setView('table');
    setEditingResponsibility(null);
    setViewingResponsibilityId('');
  };

  const handleBack = () => {
    setView('table');
    setViewingResponsibilityId('');
  };

  if (view === 'form') {
    return (
      <ResponsibilityForm
        responsibility={editingResponsibility}
        onSubmit={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (view === 'detail') {
    return (
      <ResponsibilityDetailView
        responsibilityId={viewingResponsibilityId}
        onBack={handleBack}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <ResponsibilitiesTable
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewDetail={handleViewDetail}
    />
  );
}
