
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, FileText, Building2 } from 'lucide-react';
import { Project } from '@/types/project';
import { useData } from '@/contexts/DataContext';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onEdit: (project: any) => void;
}

export function ProjectDetailView({ project, onBack, onEdit }: ProjectDetailViewProps) {
  const { subcontracts } = useData();
  
  // Find subcontracts for this project
  const projectSubcontracts = subcontracts.filter(subcontract => 
    subcontract.project === project.name
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.code}</p>
          </div>
        </div>
        <Button onClick={() => onEdit(project)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Project Info</TabsTrigger>
          <TabsTrigger value="subcontracts">Subcontracts ({projectSubcontracts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                  <p className="text-lg font-semibold">{project.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Code</label>
                  <p className="text-lg font-semibold">{project.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-lg font-semibold">{project.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                  <p className="text-lg font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcontracts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Subcontracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectSubcontracts.length > 0 ? (
                <div className="space-y-4">
                  {projectSubcontracts.map(subcontract => (
                    <div key={subcontract.id} className="border rounded-lg p-4 hover:bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{subcontract.subcontractor}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subcontract.tradeItems.map(item => item.trade).join(', ')}
                          </p>
                          <p className="text-sm text-muted-foreground">Value: ${subcontract.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            subcontract.status === 'active' ? 'bg-green-100 text-green-800' :
                            subcontract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {subcontract.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No subcontracts found for this project.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
