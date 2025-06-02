
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar, Tag, FileText, Activity } from 'lucide-react';
import { mockResponsibilities } from '@/data/responsibilitiesData';

interface ResponsibilityDetailViewProps {
  responsibilityId: string;
  onBack: () => void;
  onEdit: (responsibility: any) => void;
}

export function ResponsibilityDetailView({ responsibilityId, onBack, onEdit }: ResponsibilityDetailViewProps) {
  const responsibility = mockResponsibilities.find(r => r.id === responsibilityId);

  if (!responsibility) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Responsibility Not Found</h2>
        <p className="text-muted-foreground">The requested responsibility could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Responsibilities
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{responsibility.name}</h1>
          <p className="text-muted-foreground">{responsibility.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={responsibility.isActive ? "default" : "secondary"}>
            {responsibility.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button variant="outline" onClick={() => onEdit(responsibility)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {responsibility.description}
              </p>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">Active Assignments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-muted-foreground">Completed Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">ID</div>
                <div className="text-sm text-muted-foreground">{responsibility.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Category</div>
                <Badge variant="outline">{responsibility.category}</Badge>
              </div>
              <div>
                <div className="text-sm font-medium">Status</div>
                <Badge variant={responsibility.isActive ? "default" : "secondary"}>
                  {responsibility.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium">Created</div>
                <div className="text-muted-foreground">{new Date(responsibility.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="text-muted-foreground">{new Date(responsibility.updatedAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Related Information */}
          <Card>
            <CardHeader>
              <CardTitle>Related Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subcontracts:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Projects:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Subcontractors:</span>
                <span className="font-medium">8</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
