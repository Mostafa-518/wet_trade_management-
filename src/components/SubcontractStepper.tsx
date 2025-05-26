
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubcontractStepperProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

interface FormData {
  project: string;
  subcontractor: string;
  trade: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  responsibilities: string[];
  pdfFile: File | null;
}

const mockProjects = [
  { id: '1', name: 'Residential Complex A' },
  { id: '2', name: 'Commercial Tower B' },
  { id: '3', name: 'Villa Project C' },
];

const mockSubcontractors = [
  { id: '1', name: 'Al-Khaleej Construction', rep: 'Ahmed Ali', phone: '+20 123 456 7890' },
  { id: '2', name: 'Modern Plumbing Co.', rep: 'Sarah Hassan', phone: '+20 123 456 7891' },
  { id: '3', name: 'Elite HVAC Systems', rep: 'Mohamed Farid', phone: '+20 123 456 7892' },
];

const mockTrades = {
  'Electrical': [
    { item: 'Power Distribution Panels', unit: 'Each' },
    { item: 'Lighting Systems', unit: 'Sqm' },
    { item: 'Emergency Power Systems', unit: 'Set' }
  ],
  'Plumbing': [
    { item: 'Water Supply System', unit: 'Set' },
    { item: 'Sewage System', unit: 'Set' },
    { item: 'Water Tanks', unit: 'Each' }
  ],
  'HVAC': [
    { item: 'Central Air Conditioning', unit: 'Each' },
    { item: 'Ventilation System', unit: 'Sqm' },
    { item: 'Exhaust Fans', unit: 'Each' }
  ]
};

const responsibilities = [
  'Installation',
  'Testing',
  'Documentation',
  'Commissioning',
  'Maintenance Setup',
  'Training',
  'Warranty Support'
];

export function SubcontractStepper({ onClose, onSave }: SubcontractStepperProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    project: '',
    subcontractor: '',
    trade: '',
    item: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    total: 0,
    responsibilities: [],
    pdfFile: null
  });

  const steps = [
    'Project & Subcontractor',
    'Trade & Items',
    'Quantities & Pricing',
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
        if (!formData.trade || !formData.item) {
          toast({
            title: "Missing Information",
            description: "Please select trade and item",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        if (formData.quantity <= 0 || formData.unitPrice <= 0) {
          toast({
            title: "Invalid Values",
            description: "Quantity and unit price must be greater than 0",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 4:
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

  const handleTradeChange = (trade: string) => {
    setFormData(prev => ({
      ...prev,
      trade,
      item: '',
      unit: ''
    }));
  };

  const handleItemChange = (item: string) => {
    const selectedTrade = mockTrades[formData.trade as keyof typeof mockTrades];
    const selectedItem = selectedTrade?.find(t => t.item === item);
    
    setFormData(prev => ({
      ...prev,
      item,
      unit: selectedItem?.unit || ''
    }));
  };

  const handleQuantityOrPriceChange = (field: 'quantity' | 'unitPrice', value: number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      updated.total = updated.quantity * updated.unitPrice;
      return updated;
    });
  };

  const toggleResponsibility = (resp: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.includes(resp)
        ? prev.responsibilities.filter(r => r !== resp)
        : [...prev.responsibilities, resp]
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
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
          {/* Step 1: Project & Subcontractor */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="project">Select Project</Label>
                <Select value={formData.project} onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map(project => (
                      <SelectItem key={project.id} value={project.name}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcontractor">Select Subcontractor</Label>
                <Select value={formData.subcontractor} onValueChange={(value) => setFormData(prev => ({ ...prev, subcontractor: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subcontractor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSubcontractors.map(sub => (
                      <SelectItem key={sub.id} value={sub.name}>
                        <div>
                          <div className="font-medium">{sub.name}</div>
                          <div className="text-sm text-muted-foreground">{sub.rep} • {sub.phone}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Trade & Items */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="trade">Select Trade</Label>
                <Select value={formData.trade} onValueChange={handleTradeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a trade..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(mockTrades).map(trade => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.trade && (
                <div>
                  <Label htmlFor="item">Select Item</Label>
                  <Select value={formData.item} onValueChange={handleItemChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an item..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTrades[formData.trade as keyof typeof mockTrades]?.map(item => (
                        <SelectItem key={item.item} value={item.item}>
                          <div>
                            <div className="font-medium">{item.item}</div>
                            <div className="text-sm text-muted-foreground">Unit: {item.unit}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.unit && (
                <div>
                  <Label>Unit of Measurement</Label>
                  <Input value={formData.unit} disabled className="bg-muted" />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Quantities & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    type="number"
                    value={formData.quantity || ''}
                    onChange={(e) => handleQuantityOrPriceChange('quantity', Number(e.target.value))}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price (EGP)</Label>
                  <Input
                    type="number"
                    value={formData.unitPrice || ''}
                    onChange={(e) => handleQuantityOrPriceChange('unitPrice', Number(e.target.value))}
                    placeholder="Enter unit price"
                  />
                </div>
              </div>

              {formData.quantity > 0 && formData.unitPrice > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-lg font-semibold">
                    Total Amount: {formatCurrency(formData.total)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.quantity} {formData.unit} × {formatCurrency(formData.unitPrice)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Responsibilities */}
          {currentStep === 4 && (
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
          )}

          {/* Step 5: Documents & Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="pdf">Upload Contract PDF</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {formData.pdfFile ? formData.pdfFile.name : 'Choose PDF file...'}
                  </Button>
                </div>
              </div>

              {/* Review Summary */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Contract Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><strong>Project:</strong> {formData.project}</div>
                  <div><strong>Subcontractor:</strong> {formData.subcontractor}</div>
                  <div><strong>Trade:</strong> {formData.trade}</div>
                  <div><strong>Item:</strong> {formData.item}</div>
                  <div><strong>Quantity:</strong> {formData.quantity} {formData.unit}</div>
                  <div><strong>Unit Price:</strong> {formatCurrency(formData.unitPrice)}</div>
                  <div className="md:col-span-2"><strong>Total Amount:</strong> <span className="text-lg font-semibold text-primary">{formatCurrency(formData.total)}</span></div>
                </div>
                <div>
                  <strong>Responsibilities:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.responsibilities.map(resp => (
                      <Badge key={resp} variant="outline" className="text-xs">
                        {resp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
