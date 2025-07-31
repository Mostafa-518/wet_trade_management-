import React from 'react';

interface SubcontractStepperProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function SubcontractStepper({ onClose }: SubcontractStepperProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2>Create Subcontract</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}