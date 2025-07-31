
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
      console.log('Step validation passed, moving to next step');
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      console.log('Step validation failed');
    }
  };

  const handlePrev = () => {
    console.log('Moving to previous step from:', currentStep);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getTotalAmount = () => {
    const total = formData.tradeItems.reduce((sum, item) => sum + item.total, 0);
    console.log('Calculated total amount:', total);
    return total;
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
