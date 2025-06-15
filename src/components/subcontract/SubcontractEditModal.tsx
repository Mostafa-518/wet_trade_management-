
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Subcontract } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';

interface SubcontractEditModalProps {
  subcontract: Subcontract;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Subcontract>) => Promise<void>;
}

export function SubcontractEditModal({ subcontract, open, onClose, onSave }: SubcontractEditModalProps) {
  const { projects, subcontractors } = useData();
  const [formData, setFormData] = useState({
    contractId: '',
    project: '',
    subcontractor: '',
    status: 'draft' as 'draft' | 'pending' | 'active' | 'completed' | 'cancelled',
    totalValue: 0,
    startDate: '',
    endDate: '',
    description: ''
  });

  // Filter out projects and subcontractors with empty or invalid IDs
  const validProjects = projects.filter(project => project.id && project.name && project.id.trim() !== '' && project.name.trim() !== '');
  const validSubcontractors = subcontractors.filter(sub => sub.id && sub.companyName && sub.id.trim() !== '' && sub.companyName.trim() !== '');

  useEffect(() => {
    if (subcontract) {
      setFormData({
        contractId: subcontract.contractId || '',
        project: subcontract.project || '',
        subcontractor: subcontract.subcontractor || '',
        status: subcontract.status || 'draft',
        totalValue: subcontract.totalValue || 0,
        startDate: subcontract.startDate || '',
        endDate: subcontract.endDate || '',
        description: subcontract.description || ''
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Edit Subcontract</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contractId">Contract ID</Label>
              <Input
                id="contractId"
                value={formData.contractId}
                onChange={(e) => setFormData(prev => ({ ...prev, contractId: e.target.value }))}
                placeholder="Enter contract ID"
              />
            </div>

            <div>
              <Label htmlFor="project">Project</Label>
              <Select
                value={formData.project}
                onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {validProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} - {project.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subcontractor">Subcontractor</Label>
              <Select
                value={formData.subcontractor}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subcontractor: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcontractor" />
                </SelectTrigger>
                <SelectContent>
                  {validSubcontractors.map(sub => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled') => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalValue">Total Value</Label>
              <Input
                id="totalValue"
                type="number"
                value={formData.totalValue}
                onChange={(e) => setFormData(prev => ({ ...prev, totalValue: Number(e.target.value) }))}
                placeholder="Enter total value"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
