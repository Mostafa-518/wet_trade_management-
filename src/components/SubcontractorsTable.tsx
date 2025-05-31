
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Eye, Edit, Trash2, Users, Star } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Subcontractor } from '@/types/subcontractor';
import { mockSubcontractors } from '@/data/subcontractorsData';

interface SubcontractorsTableProps {
  onCreateNew: () => void;
  onViewDetail: (subcontractorId: string) => void;
  onEdit: (subcontractor: Subcontractor) => void;
  onDelete?: (subcontractorId: string) => void;
}

export function SubcontractorsTable({ onCreateNew, onViewDetail, onEdit, onDelete }: SubcontractorsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mockSubcontractors);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockSubcontractors.filter(subcontractor =>
      subcontractor.name.toLowerCase().includes(value.toLowerCase()) ||
      subcontractor.companyName.toLowerCase().includes(value.toLowerCase()) ||
      subcontractor.contactPerson.toLowerCase().includes(value.toLowerCase()) ||
      subcontractor.email.toLowerCase().includes(value.toLowerCase()) ||
      subcontractor.trades.some(trade => trade.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleDelete = (subcontractorId: string) => {
    if (onDelete) {
      onDelete(subcontractorId);
    }
    console.log('Delete subcontractor:', subcontractorId);
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
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Subcontractors Management
          </h2>
          <p className="text-muted-foreground">Manage your network of trusted subcontractors</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Subcontractor
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name, company, contact, or trade..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email & Phone</TableHead>
              <TableHead>Trades</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((subcontractor) => (
              <TableRow 
                key={subcontractor.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewDetail(subcontractor.id)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{subcontractor.name}</div>
                    <div className="text-sm text-muted-foreground">{subcontractor.companyName}</div>
                  </div>
                </TableCell>
                <TableCell>{subcontractor.contactPerson}</TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{subcontractor.email}</div>
                    <div className="text-sm text-muted-foreground">{subcontractor.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {subcontractor.trades.map((trade) => (
                      <Badge key={trade} variant="outline" className="text-xs">
                        {trade}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{renderStars(subcontractor.rating)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Total: {subcontractor.totalProjects}</div>
                    <div className="text-muted-foreground">Active: {subcontractor.currentProjects}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(subcontractor.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => onViewDetail(subcontractor.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(subcontractor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Subcontractor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{subcontractor.name}"? 
                            This action cannot be undone and will remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(subcontractor.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{filteredData.length}</div>
          <div className="text-sm text-muted-foreground">Total Subcontractors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredData.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredData.reduce((sum, s) => sum + s.currentProjects, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Current Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {(filteredData.reduce((sum, s) => sum + s.rating, 0) / filteredData.length).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </div>
      </div>
    </div>
  );
}
