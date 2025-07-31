import { useState } from 'react';

export function useSubcontractorsImport() {
  const [isImporting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload:', event.target.files);
  };

  const downloadTemplate = () => {
    console.log('Download template');
  };

  return {
    isImporting,
    handleFileUpload,
    downloadTemplate
  };
}