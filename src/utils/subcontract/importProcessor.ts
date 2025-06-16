
import { useToast } from '@/hooks/use-toast';
import { SubcontractImportData, groupByContract } from './dataMapper';
import { validateRow, validateContractData } from './importValidator';

export const processImportData = async (
  data: SubcontractImportData[],
  addSubcontract: (data: any) => Promise<any>,
  projects: any[],
  subcontractors: any[],
  toast: ReturnType<typeof useToast>['toast']
) => {
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Group data by contract (same Date of Issuing, Project Name, Subcontractor Company, Type of contract)
  const contractGroups = groupByContract(data);

  for (const [groupKey, groupData] of Object.entries(contractGroups)) {
    try {
      // Use the first row for contract details
      const contractRow = groupData[0];
      
      // Validate contract-level data
      const contractErrors = validateContractData(contractRow);
      if (contractErrors.length > 0) {
        errorCount++;
        errors.push(`Contract ${groupKey}: ${contractErrors.join(', ')}`);
        continue;
      }

      // Find project ID
      const project = projects.find(p => 
        p.name.toLowerCase() === contractRow['Project Name'].toLowerCase()
      );
      if (!project) {
        errorCount++;
        errors.push(`Contract ${groupKey}: Project "${contractRow['Project Name']}" not found`);
        continue;
      }

      // Find subcontractor ID
      const subcontractor = subcontractors.find(s => 
        s.companyName?.toLowerCase() === contractRow['Subcontractor Company'].toLowerCase()
      );
      if (!subcontractor) {
        errorCount++;
        errors.push(`Contract ${groupKey}: Subcontractor "${contractRow['Subcontractor Company']}" not found`);
        continue;
      }

      // Process all trade items for this contract
      const tradeItemsList = [];
      let hasValidTradeItems = false;

      for (let i = 0; i < groupData.length; i++) {
        const row = groupData[i];
        const rowErrors = validateRow(row, i + 1);

        if (rowErrors.length > 0) {
          errors.push(`Contract ${groupKey}, Row ${i + 1}: ${rowErrors.join(', ')}`);
          continue;
        }

        // Create trade item
        const tradeItem = {
          id: `imported-${Date.now()}-${i}`,
          trade: row['Trades'],
          item: row['Items'],
          unit: 'unit', // Default unit
          quantity: Number(row['QTY']) || 1,
          unitPrice: Number(row['Rate']) || 0,
          total: (Number(row['QTY']) || 1) * (Number(row['Rate']) || 0),
          wastagePercentage: Number(row['wastage']) || 0
        };

        tradeItemsList.push(tradeItem);
        hasValidTradeItems = true;
      }

      if (!hasValidTradeItems) {
        errorCount++;
        errors.push(`Contract ${groupKey}: No valid trade items found`);
        continue;
      }

      // Calculate total value
      const totalValue = tradeItemsList.reduce((sum, item) => sum + item.total, 0);

      // Parse responsibilities from the first row (assuming they apply to the whole contract)
      const responsibilityList = contractRow['Responsibilities'] 
        ? contractRow['Responsibilities'].split(',').map(r => r.trim())
        : [];

      // Create subcontract data
      const subcontractData = {
        project: project.id,
        subcontractor: subcontractor.id,
        tradeItems: tradeItemsList,
        responsibilities: responsibilityList,
        totalValue,
        status: 'draft' as const,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateOfIssuing: contractRow['Date of Issuing'] ? new Date(contractRow['Date of Issuing']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: `Imported subcontract for ${project.name} with ${subcontractor.companyName}`,
        contractType: (contractRow['Type of contract'] as 'subcontract' | 'ADD') || 'subcontract'
      };

      await addSubcontract(subcontractData);
      successCount++;
    } catch (error) {
      errorCount++;
      errors.push(`Contract ${groupKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Show results
  if (successCount > 0) {
    toast({
      title: "Import completed",
      description: `Successfully imported ${successCount} subcontract(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`
    });
  }

  if (errors.length > 0) {
    console.error('Import errors:', errors);
    toast({
      title: "Import errors",
      description: `${errorCount} contracts failed to import. Check console for details.`,
      variant: "destructive"
    });
  }
};
