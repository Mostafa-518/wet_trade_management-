
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormData, TradeItem, SubcontractStepperProps } from '@/types/subcontract';
import { ProjectSubcontractorStep } from '@/components/subcontract/ProjectSubcontractorStep';
import { TradeItemForm } from '@/components/subcontract/TradeItemForm';
import { TradeItemsList } from '@/components/subcontract/TradeItemsList';
import { ResponsibilitiesStep } from '@/components/subcontract/ResponsibilitiesStep';
import { DocumentsReviewStep } from '@/components/subcontract/DocumentsReviewStep';

export function SubcontractStepper({ onClose, onSave }: SubcontractStepperProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    project: '',
    subcontractor: '',
    tradeItems: [],
    responsibilities: [],
    pdfFile: null
  });

  const [currentTradeItem, setCurrentTradeItem] = useState<Partial<TradeItem>>({
    trade: '',
    item: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    total: 0
  });

  const steps = [
    'Project & Subcontractor',
    'Trade & Items',
    'Responsibilities',
    'Documents & Review'
  ];

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.project || !formData.subcontractor) {
          toast({
            title: "Missing Information",
            description: "Please select both project and subcontractor",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (formData.tradeItems.length === 0) {
          toast({
            title: "Missing Information",
            description: "Please add at least one trade item",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        if (formData.responsibilities.length === 0) {
          toast({
            title: "Missing Information",
            description: "Please select at least one responsibility",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const addTradeItem = () => {
    if (!currentTradeItem.trade || !currentTradeItem.item || !currentTradeItem.quantity || !currentTradeItem.unitPrice) {
      toast({
        title: "Incomplete Item",
        description: "Please fill all fields for the trade item",
        variant: "destructive"
      });
      return;
    }

    const newItem: TradeItem = {
      id: Date.now().toString(),
      trade: currentTradeItem.trade!,
      item: currentTradeItem.item!,
      unit: currentTradeItem.unit!,
      quantity: currentTradeItem.quantity!,
      unitPrice: currentTradeItem.unitPrice!,
      total: currentTradeItem.total!
    };

    setFormData(prev => ({
      ...prev,
      tradeItems: [...prev.tradeItems, newItem]
    }));

    setCurrentTradeItem({
      trade: '',
      item: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    });

    toast({
      title: "Item Added",
      description: "Trade item has been added to the contract"
    });
  };

  const removeTradeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      tradeItems: prev.tradeItems.filter(item => item.id !== id)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, pdfFile: file }));
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    if (validateStep()) {
      onSave(formData);
      toast({
        title: "Subcontract Created",
        description: "New subcontract has been saved successfully"
      });
      onClose();
    }
  };

  const getTotalAmount = () => {
    return formData.tradeItems.reduce((sum, item) => sum + item.total, 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProjectSubcontractorStep formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <div className="space-y-6">
            <TradeItemForm
              currentTradeItem={currentTradeItem}
              setCurrentTradeItem={setCurrentTradeItem}
              onAddItem={addTradeItem}
            />
            <TradeItemsList
              items={formData.tradeItems}
              onRemoveItem={removeTradeItem}
              totalAmount={getTotalAmount()}
            />
          </div>
        );
      case 3:
        return <ResponsibilitiesStep formData={formData} setFormData={setFormData} />;
      case 4:
        return (
          <DocumentsReviewStep
            formData={formData}
            setFormData={setFormData}
            totalAmount={getTotalAmount()}
            onFileUpload={handleFileUpload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create New Subcontract</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index + 1 <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className={`ml-2 text-sm ${index + 1 === currentStep ? 'font-medium' : 'text-muted-foreground'}`}>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-8 ${index + 1 < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save Subcontract
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
