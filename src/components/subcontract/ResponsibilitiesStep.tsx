
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormData } from '@/types/subcontract';
import { responsibilities } from '@/data/mockData';

interface ResponsibilitiesStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function ResponsibilitiesStep({ formData, setFormData }: ResponsibilitiesStepProps) {
  const toggleResponsibility = (resp: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.includes(resp)
        ? prev.responsibilities.filter(r => r !== resp)
        : [...prev.responsibilities, resp]
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Assign Responsibilities</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Select all responsibilities that apply to this subcontract
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {responsibilities.map(resp => (
            <Button
              key={resp}
              variant={formData.responsibilities.includes(resp) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleResponsibility(resp)}
              className="justify-start"
            >
              {resp}
            </Button>
          ))}
        </div>
        {formData.responsibilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {formData.responsibilities.map(resp => (
              <Badge key={resp} variant="secondary">
                {resp}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
