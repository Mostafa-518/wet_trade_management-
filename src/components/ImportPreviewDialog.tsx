
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImportPreviewDialogProps<T> {
  open: boolean;
  onClose: () => void;
  data: T[];
  columns: { key: keyof T; label: string }[];
  onImport: (updatedData: T[]) => void;
}

export function ImportPreviewDialog<T extends { [key: string]: any }>({
  open,
  onClose,
  data,
  columns,
  onImport,
}: ImportPreviewDialogProps<T>) {
  const [tableData, setTableData] = useState<T[]>(data);

  // Handlers for editing
  const handleCellChange = (rowIdx: number, key: keyof T, value: string) => {
    setTableData((old) =>
      old.map((row, idx) =>
        idx === rowIdx ? { ...row, [key]: value } : row
      )
    );
  };

  const handleDelete = (rowIdx: number) => {
    setTableData((old) => old.filter((_, idx) => idx !== rowIdx));
  };

  const handleImport = () => {
    onImport(tableData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Review Imported Data</DialogTitle>
          <DialogDescription>
            Please review and edit the data as needed before importing into the system.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-96 my-2">
          <table className="min-w-full border rounded text-sm">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="p-2 border-b text-left">{col.label}</th>
                ))}
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="p-2 border-b">
                      <Input
                        type="text"
                        value={row[col.key] ?? ""}
                        onChange={(e) =>
                          handleCellChange(rowIdx, col.key, e.target.value)
                        }
                        className="w-36"
                      />
                    </td>
                  ))}
                  <td className="p-2 border-b">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(rowIdx)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {tableData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center p-8">
                    No data to import.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} asChild>
            <DialogClose>Cancel</DialogClose>
          </Button>
          <Button
            disabled={tableData.length === 0}
            onClick={handleImport}
          >
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
