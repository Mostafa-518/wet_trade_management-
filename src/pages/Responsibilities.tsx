
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsibilitiesTable } from '@/components/ResponsibilitiesTable';
import { ResponsibilityForm } from '@/components/ResponsibilityForm';
import { ResponsibilityDetailView } from '@/components/ResponsibilityDetailView';
import { Responsibility, ResponsibilityFormData } from '@/types/responsibility';

export function Responsibilities() {
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'form' | 'detail'>('table');
  const [editingResponsibility, setEditingResponsibility] = useState<Responsibility | null>(null);
  const [viewingResponsibilityId, setViewingResponsibilityId] = useState<string>('');

  const handleCreateNew = () => {
    setEditingResponsibility(null);
    setView('form');
  };

  const handleEdit = (responsibility: Responsibility) => {
    setEditingResponsibility(responsibility);
    setView('form');
  };

  const handleDelete = (responsibilityId: string) => {
    console.log('Deleting responsibility:', responsibilityId);
    // In a real app, this would make an API call
  };

  const handleViewDetail = (responsibilityId: string) => {
    setViewingResponsibilityId(responsibilityId);
    setView('detail');
  };

  const handleSave = (data: ResponsibilityFormData) => {
    console.log('Saving responsibility:', data);
    if (editingResponsibility) {
      console.log('Updating existing responsibility:', editingResponsibility.id);
    } else {
      console.log('Creating new responsibility');
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
