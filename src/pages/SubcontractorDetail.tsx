
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubcontractorDetailView } from '@/components/SubcontractorDetailView';
import { useData } from '@/contexts/DataContext';

export function SubcontractorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subcontractors } = useData();

  const handleBack = () => {
    navigate('/subcontractors');
  };

  const handleEdit = (subcontractor: any) => {
    navigate('/subcontractors', { state: { editSubcontractor: subcontractor } });
  };

  if (!id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Subcontractor Not Found</h2>
        <p className="text-muted-foreground">The requested subcontractor could not be found.</p>
      </div>
    );
  }

  const subcontractor = subcontractors.find(s => s.id === id);

  if (!subcontractor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Subcontractor Not Found</h2>
        <p className="text-muted-foreground">The requested subcontractor could not be found.</p>
      </div>
    );
  }

  return (
    <SubcontractorDetailView
      subcontractor={subcontractor}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
}
