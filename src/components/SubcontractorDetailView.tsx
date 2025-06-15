
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Star, TrendingUp, FileText, Building2, User, Award } from 'lucide-react';
import { Subcontractor } from '@/types/subcontractor';
import { useData } from '@/contexts/DataContext';

interface SubcontractorDetailViewProps {
  subcontractor: Subcontractor;
  onBack: () => void;
  onEdit: (subcontractor: Subcontractor) => void;
}

export function SubcontractorDetailView({ subcontractor, onBack, onEdit }: SubcontractorDetailViewProps) {
  const { subcontracts } = useData();

  // Get subcontracts for this subcontractor
  const subcontractorProjects = subcontracts.filter(s => s.subcontractor === subcontractor.name);

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

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'overbudget':
        return <Badge variant="destructive">Over Budget</Badge>;
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

  const totalContractValue = subcontractorProjects.reduce((sum, project) => sum + project.totalValue, 0);

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

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Subcontractor Info</TabsTrigger>
          <TabsTrigger value="subcontracts">Subcontracts ({subcontractorProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trades & Specializations */}
            <div className="lg:col-span-2 space-y-6">
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
                    <div className="font-semibold">{subcontractor.representativeName}</div>
                    <div className="text-sm text-muted-foreground">Representative</div>
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
                    <div className="font-medium">Commercial Registration</div>
                    <div className="text-muted-foreground">{subcontractor.commercialRegistration}</div>
                  </div>
                  <div>
                    <div className="font-medium">Tax Card No.</div>
                    <div className="text-muted-foreground">{subcontractor.taxCardNo}</div>
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
                    <span>Total Contract Value:</span>
                    <span className="font-medium text-green-600">{formatCurrency(totalContractValue)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subcontracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Subcontracts History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subcontractorProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead className="text-right">Contract Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Created Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subcontractorProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.contractId}</TableCell>
                        <TableCell>{project.project}</TableCell>
                        <TableCell className="text-right">{formatCurrency(project.totalValue)}</TableCell>
                        <TableCell>{getProjectStatusBadge(project.status)}</TableCell>
                        <TableCell className="text-sm">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No subcontracts found for this subcontractor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
