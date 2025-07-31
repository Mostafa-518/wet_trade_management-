import { useState } from 'react';

export function useSubcontractorsImport() {
  const [isImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload:', event.target.files);
  };

  const downloadTemplate = () => {
    console.log('Download template');
  };

  const handleImport = () => {
    console.log('Handle import');
  };

  return {
    isImporting,
    handleFileUpload,
    downloadTemplate,
    showImportDialog,
    setShowImportDialog,
    importData,
    setImportData,
    handleImport
  };
}