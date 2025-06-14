import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Edit, Trash2, Eye, FileDown } from 'lucide-react';
import { Project, ProjectSearchFilters } from '@/types/project';
import { useData } from '@/contexts/DataContext';
import * as XLSX from 'xlsx';
import { ImportPreviewDialog } from './ImportPreviewDialog';
import { TableSelectionCheckbox } from "./TableSelectionCheckbox";

interface ProjectsTableProps {
  onCreateNew: () => void;
  onViewDetail: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectsTable({ onCreateNew, onViewDetail, onEdit, onDelete }: ProjectsTableProps) {
  const { projects, addProject, deleteProject } = useData();
  const [searchFilters, setSearchFilters] = useState<ProjectSearchFilters>({
    name: '',
    code: '',
    location: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilterChange = (field: keyof ProjectSearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({ name: '', code: '', location: '' });
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Filter using the full Project type objects, not just the four fields
  const filteredProjects = projects.filter(project => {
    return (
      project.name.toLowerCase().includes(searchFilters.name.toLowerCase()) &&
      project.code.toLowerCase().includes(searchFilters.code.toLowerCase()) &&
      project.location.toLowerCase().includes(searchFilters.location.toLowerCase())
    );
  });

  const [importedData, setImportedData] = useState<any[] | null>(null); // Hold imported rows

  // Only show preview columns for the four fields
  const previewColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
  ];

  function normalizeHeader(header: string) {
    const key = header.trim().toLowerCase().replace(/[\s_]+/g, '');
    if (key === "projectname") return "name";
    if (key === "projectcode") return "code";
    if (key === "projectlocation") return "location";
    if (key === "projectid") return "id";
    return (
      {
        id: "id",
        name: "name",
        code: "code",
        location: "location",
      }[key] || key
    );
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!jsonData || jsonData.length < 2) {
        setImportedData([]);
        return;
      }

      let [rawHeaders, ...rows] = jsonData;

      // Only keep the four fields in the headers and mapped data
      const headers = rawHeaders.map((h: string) => normalizeHeader(h));
      const allowedKeys = ['id', 'name', 'code', 'location'];

      const mapped = rows
        .filter((row) => row.some((cell) => cell !== undefined && cell !== "")) // skip empty rows
        .map((row) => {
          const out: any = {};
          headers.forEach((header: string, idx: number) => {
            if (allowedKeys.includes(header)) {
              out[header] = row[idx] ?? "";
            }
          });
          return out;
        });

      setImportedData(mapped);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async (rows: any[]) => {
    for (const row of rows) {
      await addProject({
        name: row.name || '',
        code: row.code || '',
        location: row.location || '',
        // Provide the required status field
        status: 'planning'
      });
    }
    setImportedData(null);
  };

  // Bulk select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Select all toggle
  const allSelected = filteredProjects.length > 0 && filteredProjects.every(p => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteProject(id);
    }
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
        data-testid="import-excel-input"
      />
      {/* Import Preview Dialog */}
      {!!importedData && importedData.length > 0 && (
        <ImportPreviewDialog
          open={!!importedData}
          data={importedData}
          columns={previewColumns}
          onImport={handleImport}
          onClose={() => setImportedData(null)}
        />
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportClick}>
            <FileDown className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button onClick={onCreateNew}>
            <FileText className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Project Name</label>
              <Input
                placeholder="Search by project name..."
                value={searchFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Project Code</label>
              <Input
                placeholder="Search by project code..."
                value={searchFilters.code}
                onChange={(e) => handleFilterChange('code', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input
                placeholder="Search by location..."
                value={searchFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedIds.size > 0 && (
            <div className="mb-2 flex items-center gap-2">
              <span>{selectedIds.size} selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="ml-2"
              >
                Delete Selected
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <TableSelectionCheckbox checked={allSelected} onCheckedChange={toggleAll} ariaLabel="Select all projects"/>
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Project Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <TableSelectionCheckbox
                      checked={selectedIds.has(project.id)}
                      onCheckedChange={() => toggleOne(project.id)}
                      ariaLabel={`Select project ${project.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.code}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetail(project.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit && onEdit(project)}
                        disabled={!onEdit}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete && onDelete(project.id)}
                        disabled={!onDelete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
