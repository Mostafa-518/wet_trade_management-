
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubcontractorsTable } from '@/components/SubcontractorsTable';
import { SubcontractorForm } from '@/components/SubcontractorForm';
import { Subcontractor, SubcontractorFormData } from '@/types/subcontractor';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function Subcontractors() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingSubcontractor, setEditingSubcontractor] = useState<Subcontractor | null>(null);
  
  const { addSubcontractor, updateSubcontractor, deleteSubcontractor } = useData();
  const { toast } = useToast();

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
    deleteSubcontractor(subcontractorId);
    toast({
      title: "Subcontractor deleted",
      description: "The subcontractor has been removed successfully."
    });
  };

  const handleSave = (data: SubcontractorFormData) => {
    if (editingSubcontractor) {
      updateSubcontractor(editingSubcontractor.id, data);
      toast({
        title: "Subcontractor updated",
        description: "The subcontractor has been updated successfully."
      });
    } else {
      addSubcontractor(data);
      toast({
        title: "Subcontractor created",
        description: "A new subcontractor has been created successfully."
      });
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
