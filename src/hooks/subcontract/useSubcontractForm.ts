
import { useState } from 'react';
import { FormData } from '@/types/subcontract';

export function useSubcontractForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    project: '',
    subcontractor: '',
    tradeItems: [],
    responsibilities: [],
    pdfFile: null,
    dateOfIssuing: undefined,
    contractType: 'subcontract',
    addendumNumber: '',
    parentSubcontractId: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    'Project & Subcontractor',
    'Trade & Items',
    'Responsibilities',
    'Documents & Review'
  ];

  const handleNext = (validateStep: () => boolean) => {
    console.log('Current step validation:', currentStep, formData);
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getTotalAmount = () => {
    return formData.tradeItems.reduce((sum, item) => sum + item.total, 0);
  };

  return {
    currentStep,
    formData,
    setFormData,
    isSaving,
    setIsSaving,
    steps,
    handleNext,
    handlePrev,
    getTotalAmount
  };
}
