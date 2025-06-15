
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubcontractorFormData } from '@/types/subcontractor';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

interface CreateSubcontractorModalProps {
  open: boolean;
  onClose: () => void;
  onSubcontractorCreated: (subcontractorName: string) => void;
}

export function CreateSubcontractorModal({ open, onClose, onSubcontractorCreated }: CreateSubcontractorModalProps) {
  const { addSubcontractor } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SubcontractorFormData>({
    name: '',
    companyName: '',
    representativeName: '',
    commercialRegistration: '',
    taxCardNo: '',
    email: '',
    phone: '',
    address: '',
    trades: [],
    rating: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.representativeName || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill required fields (Name, Representative Name, Phone)",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSubcontractor(formData);
      toast({
        title: "Subcontractor Created",
        description: `${formData.name} has been created successfully`
      });
      onSubcontractorCreated(formData.name);
      setFormData({
        name: '',
        companyName: '',
        representativeName: '',
        commercialRegistration: '',
        taxCardNo: '',
        email: '',
        phone: '',
        address: '',
        trades: [],
        rating: 0
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subcontractor",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof SubcontractorFormData, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Subcontractor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sub-name">Business Name *</Label>
              <Input
                id="sub-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter business name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub-company">Company Name</Label>
              <Input
                id="sub-company"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub-representative">Representative Name *</Label>
              <Input
                id="sub-representative"
                value={formData.representativeName}
                onChange={(e) => handleInputChange('representativeName', e.target.value)}
                placeholder="Enter representative name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub-commercial">Commercial Registration</Label>
              <Input
                id="sub-commercial"
                value={formData.commercialRegistration}
                onChange={(e) => handleInputChange('commercialRegistration', e.target.value)}
                placeholder="Enter commercial registration"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub-tax">Tax Card No.</Label>
              <Input
                id="sub-tax"
                value={formData.taxCardNo}
                onChange={(e) => handleInputChange('taxCardNo', e.target.value)}
                placeholder="Enter tax card number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub-phone">Phone *</Label>
              <Input
                id="sub-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub-email">Email</Label>
              <Input
                id="sub-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub-address">Address</Label>
            <Textarea
              id="sub-address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Subcontractor
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
