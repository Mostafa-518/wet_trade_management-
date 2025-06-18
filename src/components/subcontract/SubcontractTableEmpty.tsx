
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

interface SubcontractTableEmptyProps {
  searchTerm: string;
  showAdvancedSearch: boolean;
  onCreateNew?: () => void;
  isFiltered?: boolean;
}

export function SubcontractTableEmpty({ 
  searchTerm, 
  showAdvancedSearch, 
  onCreateNew,
  isFiltered = false 
}: SubcontractTableEmptyProps) {
  const hasFilters = searchTerm || showAdvancedSearch || isFiltered;

  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          {hasFilters ? (
            <>
              <Filter className="h-12 w-12 text-gray-400" />
              <div className="text-lg font-medium text-gray-900">
                {isFiltered ? 'No subcontracts found for this filter' : 'No subcontracts found'}
              </div>
              <p className="text-gray-500 max-w-md">
                {isFiltered 
                  ? 'Try adjusting your filters or check the report criteria.'
                  : 'No subcontracts match your search criteria. Try adjusting your search terms or filters.'
                }
              </p>
              {isFiltered && (
                <div className="text-sm text-blue-600">
                  This view is filtered based on your report selection.
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-lg font-medium text-gray-900">No subcontracts found</div>
              <p className="text-gray-500 max-w-md">
                Get started by creating your first subcontract.
              </p>
              {onCreateNew && (
                <Button onClick={onCreateNew} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Subcontract
                </Button>
              )}
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
