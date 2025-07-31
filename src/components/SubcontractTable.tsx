import React, { useState } from 'react';
import { useSubcontractContext } from '@/contexts/SubcontractContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Eye, Search, Download, Upload, MoreHorizontal, Edit, Trash } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PaginationControls } from "@/components/PaginationControls";

interface SubcontractTableProps {
  onCreateNew?: () => void;
  onViewDetail: (contractId: string) => void;
  reportFilters?: any;
}

export function SubcontractTable({ onCreateNew, onViewDetail, reportFilters }: SubcontractTableProps) {
  const { subcontracts, isLoading } = useSubcontractContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const itemsPerPage = 5;

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate summary metrics
  const totalContracts = subcontracts.length;
  const totalValue = subcontracts.reduce((sum, contract) => sum + contract.totalValue, 0);
  const activeContracts = subcontracts.filter(contract => contract.status === 'active').length;

  // Filter contracts based on search
  const filteredContracts = subcontracts.filter(contract =>
    contract.contractId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.subcontractor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContracts(paginatedContracts.map(contract => contract.id));
    } else {
      setSelectedContracts([]);
    }
  };

  const handleSelectContract = (contractId: string, checked: boolean) => {
    if (checked) {
      setSelectedContracts(prev => [...prev, contractId]);
    } else {
      setSelectedContracts(prev => prev.filter(id => id !== contractId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subcontracts</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import from Excel
          </Button>
          {onCreateNew && (
            <Button onClick={onCreateNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Subcontract
            </Button>
          )}
        </div>
      </div>

      {/* Contract Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{totalContracts}</div>
              <div className="text-sm text-muted-foreground">Total Contracts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                EGP {new Intl.NumberFormat('en-US').format(totalValue)}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{activeContracts}</div>
              <div className="text-sm text-muted-foreground">Active Contracts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Contract ID, Project, Project Code, Trade, Item, or Subcontractor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Advanced Search</Button>
      </div>

      {/* Subcontracts Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Subcontracts ({filteredContracts.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredContracts.length)} of {filteredContracts.length} results
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subcontracts found.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedContracts.length === paginatedContracts.length && paginatedContracts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Contract ID</TableHead>
                    <TableHead>Date of Issuing</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Subcontractor Company</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>QTY</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Responsibilities</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracts.map((subcontract) => (
                    <TableRow key={subcontract.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedContracts.includes(subcontract.id)}
                          onCheckedChange={(checked) => handleSelectContract(subcontract.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-blue-600">
                        {subcontract.contractId}
                      </TableCell>
                      <TableCell>
                        {subcontract.dateOfIssuing ? new Date(subcontract.dateOfIssuing).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        }) : '-'}
                      </TableCell>
                      <TableCell className="font-medium">{subcontract.project}</TableCell>
                      <TableCell>{subcontract.subcontractor}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {subcontract.tradeItems.length > 0 ? subcontract.tradeItems[0].trade : 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {subcontract.tradeItems.length > 0 ? subcontract.tradeItems[0].item : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {subcontract.tradeItems.length > 0 ? 
                          `${subcontract.tradeItems[0].quantity} ${subcontract.tradeItems[0].unit}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {subcontract.tradeItems.length > 0 ? 
                          `EGP ${subcontract.tradeItems[0].unitPrice}` : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">
                        EGP {new Intl.NumberFormat('en-US').format(subcontract.totalValue)}
                      </TableCell>
                      <TableCell>
                        {subcontract.responsibilities.slice(0, 2).join(', ')}
                        {subcontract.responsibilities.length > 2 && '...'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetail(subcontract.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    hasNextPage={currentPage < totalPages}
                    hasPreviousPage={currentPage > 1}
                    totalItems={filteredContracts.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}