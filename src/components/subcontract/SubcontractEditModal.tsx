import React from 'react';

interface SubcontractEditModalProps {
  subcontract: any;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
}

export function SubcontractEditModal({ open, onClose }: SubcontractEditModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2>Edit Subcontract</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}