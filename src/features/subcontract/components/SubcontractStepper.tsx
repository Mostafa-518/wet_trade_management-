import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useSubcontractForm } from '../hooks/useSubcontractForm';
import { SubcontractFormModal } from './SubcontractFormModal';
import { ProjectSubcontractorStep } from './ProjectSubcontractorStep';
import { TradeItemForm } from './TradeItemForm';
import { ResponsibilitiesStep } from './ResponsibilitiesStep';
import { DocumentsReviewStep } from './DocumentsReviewStep';
import { ContractTypeSelector } from './ContractTypeSelector';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SubcontractStepperProps } from '../types';

export function SubcontractStepper({ onClose, onSave }: SubcontractStepperProps) {
  const { trades, tradeItems, responsibilities } = useData();
  const {
    currentStep,
    formData,
    setFormData,
    isSaving,
    steps,
    handlePrev,
    handleNext,
    validateCurrentStep
  } = useSubcontractForm();

  const handleFileUpload = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      pdfFile: file
    }));
  };

  const handleSave = async () => {
    try {
      // Validate the form data before submitting
      if (!formData.project || !formData.subcontractor) {
        console.error('Missing required fields');
        return;
      }

      if (!formData.tradeItems || formData.tradeItems.length === 0) {
        console.error('At least one trade item is required');
        return;
      }

      // Call the parent's onSave function with the form data
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving subcontract:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectSubcontractorStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <TradeItemForm
            tradeItems={formData.tradeItems}
            onTradeItemsChange={(items) => setFormData(prev => ({
              ...prev,
              tradeItems: items
            }))}
            trades={trades}
            availableTradeItems={tradeItems}
          />
        );
      case 3:
        return (
          <ResponsibilitiesStep
            selectedResponsibilities={formData.responsibilities}
            onResponsibilitiesChange={(responsibilities) => setFormData(prev => ({
              ...prev,
              responsibilities
            }))}
            responsibilities={responsibilities}
          />
        );
      case 4:
        const totalAmount = formData.tradeItems.reduce((sum, item) => sum + item.total, 0);
        return (
          <DocumentsReviewStep
            formData={formData}
            setFormData={setFormData}
            totalAmount={totalAmount}
            onFileUpload={handleFileUpload}
            renderExtraFields={() => (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dateOfIssuing">Date of Issuing</Label>
                  <Input
                    id="dateOfIssuing"
                    type="date"
                    value={formData.dateOfIssuing || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dateOfIssuing: e.target.value
                    }))}
                  />
                </div>
                <ContractTypeSelector
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SubcontractFormModal
      formData={formData}
      currentStep={currentStep}
      steps={steps}
      isSaving={isSaving}
      onClose={onClose}
      onPrev={handlePrev}
      onNext={handleNext}
      onSave={handleSave}
    >
      {renderStepContent()}
    </SubcontractFormModal>
  );
}