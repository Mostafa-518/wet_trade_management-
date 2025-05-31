
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Star, TrendingUp, FileText, Building2, User, Award } from 'lucide-react';
import { Subcontractor } from '@/types/subcontractor';
import { mockSubcontractors } from '@/data/subcontractorsData';

interface ProjectHistory {
  id: string;
  projectName: string;
  contractValue: number;
  status: 'completed' | 'active' | 'cancelled';
  startDate: string;
  endDate?: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface SubcontractorDetailViewProps {
  subcontractorId: string;
  onBack: () => void;
  onEdit: (subcontractor: Subcontractor) => void;
}

// Mock project history data
const mockProjectHistory: ProjectHistory[] = [
  {
    id: '1',
    projectName: 'Residential Complex A',
    contractValue: 125000,
    status: 'completed',
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    performance: 'excellent'
  },
  {
    id: '2',
    projectName: 'Office Building B',
    contractValue: 89000,
    status: 'active',
    startDate: '2024-03-01',
    performance: 'good'
  },
  {
    id: '3',
    projectName: 'Shopping Mall C',
    contractValue: 156000,
    status: 'completed',
    startDate: '2023-08-15',
    endDate: '2023-12-20',
    performance: 'excellent'
  }
];

export function SubcontractorDetailView({ subcontractorId, onBack, onEdit }: SubcontractorDetailViewProps) {
  const subcontractor = mockSubcontractors.find(s => s.id === subcontractorId);
  
  if (!subcontractor) {
    return (
      <div className="space-y-4">
        <Button onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Subcontractors
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Subcontractor Not Found</h2>
          <p className="text-muted-foreground">The requested subcontractor could not be found.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'average':
        return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
      case 'poor':
        return <Badge variant="destructive">Poor</Badge>;
      default:
        return <Badge variant="outline">{performance}</Badge>;
    }
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">({rating})</span>
      </div>
    );
  };

  const totalContractValue = mockProjectHistory.reduce((sum, project) => sum + project.contractValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Subcontractors
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{subcontractor.name}</h1>
          <p className="text-muted-foreground">{subcontractor.companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(subcontractor.status)}
          <Button variant="outline" onClick={() => onEdit(subcontractor)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalContractValue)}
                </div>
                <div className="text-sm text-muted-foreground">Total Contract Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {subcontractor.totalProjects}
                </div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {subcontractor.currentProjects}
                </div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {subcontractor.rating}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead className="text-right">Contract Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProjectHistory.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.projectName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.contractValue)}</TableCell>
                      <TableCell>{getProjectStatusBadge(project.status)}</TableCell>
                      <TableCell>{getPerformanceBadge(project.performance)}</TableCell>
                      <TableCell className="text-sm">
                        <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                        {project.endDate && (
                          <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Trades & Specializations */}
          <Card>
            <CardHeader>
              <CardTitle>Trades & Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {subcontractor.trades.map(trade => (
                  <Badge key={trade} variant="secondary" className="px-3 py-1">
                    {trade}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-semibold">{subcontractor.contactPerson}</div>
                <div className="text-sm text-muted-foreground">Contact Person</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{subcontractor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{subcontractor.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{subcontractor.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium">Tax ID</div>
                <div className="text-muted-foreground">{subcontractor.taxId}</div>
              </div>
              <div>
                <div className="font-medium">Bank Account</div>
                <div className="text-muted-foreground">{subcontractor.bankAccount}</div>
              </div>
              <div>
                <div className="font-medium">Registration Date</div>
                <div className="text-muted-foreground">{new Date(subcontractor.registrationDate).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium mb-1">Overall Rating</div>
                {renderStars(subcontractor.rating)}
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Projects:</span>
                <span className="font-medium">{subcontractor.totalProjects}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Projects:</span>
                <span className="font-medium">{subcontractor.currentProjects}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Success Rate:</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>On-Time Completion:</span>
                <span className="font-medium text-blue-600">88%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
