
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubcontractorDetailView } from '@/components/SubcontractorDetailView';
import { mockSubcontractors } from '@/data/subcontractorsData';

export function SubcontractorDetail() {
  const { subcontractorId } = useParams<{ subcontractorId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/subcontractors');
  };

  const handleEdit = (subcontractor: any) => {
    navigate('/subcontractors', { state: { editSubcontractor: subcontractor } });
  };

  if (!subcontractorId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Subcontractor Not Found</h2>
        <p className="text-muted-foreground">The requested subcontractor could not be found.</p>
      </div>
    );
  }

  return (
    <SubcontractorDetailView
      subcontractorId={subcontractorId}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
}
