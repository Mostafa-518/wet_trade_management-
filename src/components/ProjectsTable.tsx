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

interface ProjectsTableProps {
  onCreateNew: () => void;
  onViewDetail: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectsTable({ onCreateNew, onViewDetail, onEdit, onDelete }: ProjectsTableProps) {
  const { projects, addProject } = useData();
  const [searchFilters, setSearchFilters] = useState<ProjectSearchFilters>({
    name: '',
    code: '',
    location: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = projects.filter(project => {
    return (
      project.name.toLowerCase().includes(searchFilters.name.toLowerCase()) &&
      project.code.toLowerCase().includes(searchFilters.code.toLowerCase()) &&
      project.location.toLowerCase().includes(searchFilters.location.toLowerCase())
    );
  });

  const [importedData, setImportedData] = useState<any[] | null>(null); // Hold imported rows

  const previewColumns = [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
    { key: "description", label: "Description" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status" },
  ];

  function normalizeHeader(header: string) {
    const key = header.trim().toLowerCase().replace(/[\s_]+/g, '');
    // Map variations to expected camelCase keys
    if (key === "startdate") return "startDate";
    if (key === "enddate") return "endDate";
    if (key === "projectname") return "name";
    if (key === "projectcode") return "code";
    if (key === "projectlocation") return "location";
    return (
      {
        name: "name",
        code: "code",
        location: "location",
        description: "description",
        status: "status",
        startdate: "startDate",
        enddate: "endDate",
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
        // No data or just headers
        setImportedData([]);
        console.warn("No data rows found in Excel file.");
        return;
      }

      let [rawHeaders, ...rows] = jsonData;

      // Clean up headers
      const headers = rawHeaders.map((h: string) => normalizeHeader(h));
      console.log("Parsed headers:", headers);
      console.log("First row sample:", rows[0]);

      // Build array of objects using normalized headers
      const mapped = rows
        .filter((row) => row.some((cell) => cell !== undefined && cell !== "")) // skip totally empty rows
        .map((row) => {
          const out: any = {};
          headers.forEach((header: string, idx: number) => {
            out[header] = row[idx] ?? "";
          });
          if (!out.status) out.status = "planning";
          return out;
        });

      console.log("Imported data preview:", mapped);

      if (mapped.length === 0) {
        setImportedData([]);
        return;
      }

      setImportedData(mapped);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async (rows: any[]) => {
    for (const row of rows) {
      await addProject({
        name: row.name,
        code: row.code,
        location: row.location,
        description: row.description,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status || "planning",
      });
    }
    setImportedData(null);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Project Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.code}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
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
                        onClick={() => onEdit(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(project.id)}
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
