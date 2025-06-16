
import React, { useState, useEffect } from 'react';
import { Subcontract } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';
import { useSubcontractHelpers } from '@/hooks/subcontract/useSubcontractHelpers';
import { SubcontractEditFields } from './SubcontractEditFields';
import { SubcontractEditActions } from './SubcontractEditActions';

interface SubcontractEditFormProps {
  subcontract: Subcontract;
  onSave: (id: string, data: Partial<Subcontract>) => Promise<void>;
  onClose: () => void;
}

export function SubcontractEditForm({ subcontract, onSave, onClose }: SubcontractEditFormProps) {
  const { projects, subcontractors, subcontracts } = useData();
  const { getProjectName, getSubcontractorName } = useSubcontractHelpers();
  
  const [formData, setFormData] = useState({
    contractId: '',
    project: '',
    subcontractor: '',
    status: 'draft' as 'draft' | 'pending' | 'active' | 'completed' | 'cancelled',
    totalValue: 0,
    startDate: '',
    endDate: '',
    dateOfIssuing: '',
    description: '',
    contractType: 'subcontract' as 'subcontract' | 'ADD',
    parentSubcontractId: ''
  });

  // Filter out projects and subcontractors with empty or invalid IDs
  const validProjects = projects.filter(project => project.id && project.name && project.id.trim() !== '' && project.name.trim() !== '');
  const validSubcontractors = subcontractors.filter(sub => sub.id && sub.companyName && sub.id.trim() !== '' && sub.companyName.trim() !== '');

  useEffect(() => {
    if (subcontract) {
      // Calculate total value without wastage
      const calculatedTotal = subcontract.tradeItems?.reduce((total, item) => {
        return total + ((item.quantity || 0) * (item.unitPrice || 0));
      }, 0) || 0;

      setFormData({
        contractId: subcontract.contractId || '',
        project: subcontract.project || '',
        subcontractor: subcontract.subcontractor || '',
        status: subcontract.status || 'draft',
        totalValue: calculatedTotal,
        startDate: subcontract.startDate || '',
        endDate: subcontract.endDate || '',
        dateOfIssuing: subcontract.dateOfIssuing || '',
        description: subcontract.description || '',
        contractType: subcontract.contractType || 'subcontract',
        parentSubcontractId: subcontract.parentSubcontractId || ''
      });
    }
  }, [subcontract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(subcontract.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving subcontract:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SubcontractEditFields
        formData={formData}
        setFormData={setFormData}
        validProjects={validProjects}
        validSubcontractors={validSubcontractors}
        subcontracts={subcontracts}
        getProjectName={getProjectName}
        getSubcontractorName={getSubcontractorName}
      />
      <SubcontractEditActions onClose={onClose} />
    </form>
  );
}
