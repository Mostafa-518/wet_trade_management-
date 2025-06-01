
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubcontractorsTable } from '@/components/SubcontractorsTable';
import { SubcontractorForm } from '@/components/SubcontractorForm';
import { Subcontractor, SubcontractorFormData } from '@/types/subcontractor';

export function Subcontractors() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingSubcontractor, setEditingSubcontractor] = useState<Subcontractor | null>(null);

  const handleCreateNew = () => {
    setEditingSubcontractor(null);
    setShowForm(true);
  };

  const handleViewDetail = (subcontractorId: string) => {
    navigate(`/subcontractors/${subcontractorId}`);
  };

  const handleEdit = (subcontractor: Subcontractor) => {
    setEditingSubcontractor(subcontractor);
    setShowForm(true);
  };

  const handleDelete = (subcontractorId: string) => {
    console.log('Deleting subcontractor:', subcontractorId);
  };

  const handleSave = (data: SubcontractorFormData) => {
    console.log('Saving subcontractor:', data);
    if (editingSubcontractor) {
      console.log('Updating existing subcontractor:', editingSubcontractor.id);
    } else {
      console.log('Creating new subcontractor');
    }
    setShowForm(false);
    setEditingSubcontractor(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubcontractor(null);
  };

  if (showForm) {
    return (
      <SubcontractorForm
        subcontractor={editingSubcontractor}
        onSubmit={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <SubcontractorsTable 
      onCreateNew={handleCreateNew}
      onViewDetail={handleViewDetail}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
