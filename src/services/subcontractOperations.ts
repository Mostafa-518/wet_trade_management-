
import { subcontractService, subcontractTradeItemService, subcontractResponsibilityService } from '@/services';
import { Subcontract } from '@/types/subcontract';
import { 
  findTradeItemId, 
  findResponsibilityId, 
  generateContractId, 
  validateContractIdUniqueness,
  validateAddendumFormat,
  validateSubcontractFormat,
  getNextAddendumNumber
} from '@/utils/subcontract';
import { useToast } from '@/hooks/use-toast';

export const createSubcontractWithTradeItems = async (
  data: Partial<Subcontract>,
  trades: any[],
  tradeItems: any[],
  toast: ReturnType<typeof useToast>['toast'],
  responsibilities: any[] = [],
  existingContracts: Subcontract[] = [],
  projects: any[] = []
) => {
  console.log('Creating subcontract with data:', data);

  if (!data.project || !data.subcontractor) {
    const error = new Error('Project and subcontractor are required');
    console.error('Validation error:', error);
    toast({
      title: "Project & Subcontractor missing",
      description: "You must select a Project and Subcontractor.",
      variant: "destructive"
    });
    throw error;
  }

  // Generate contract ID if not provided or is temporary
  let contractId = data.contractId;
  let addendumNumber: string | undefined;
  
  if (!contractId || contractId.startsWith('SC-')) {
    if (data.contractType === 'ADD') {
      // For addendums, we need the parent contract
      if (!data.parentSubcontractId) {
        const error = new Error('Parent contract is required for addendums');
        console.error('Parent contract error:', error);
        toast({
          title: "Parent Contract Missing",
          description: "Please select a parent contract for this addendum.",
          variant: "destructive"
        });
        throw error;
      }

      // Find parent contract to get its contract_number
      const parentContract = existingContracts.find(c => c.id === data.parentSubcontractId);
      if (!parentContract) {
        const error = new Error('Parent contract not found');
        console.error('Parent contract not found:', error);
        toast({
          title: "Parent Contract Not Found",
          description: "The selected parent contract could not be found.",
          variant: "destructive"
        });
        throw error;
      }

      // Get next addendum number and generate contract ID
      const nextAddendumNumber = await getNextAddendumNumber(parentContract.contractId, existingContracts);
      contractId = `${parentContract.contractId}-ADD${nextAddendumNumber}`;
      addendumNumber = nextAddendumNumber;
      
      console.log('Generated addendum ID:', contractId, 'with addendum number:', addendumNumber);
    } else {
      // For regular subcontracts
      const project = projects.find(p => p.id === data.project);
      if (!project || !project.code) {
        const error = new Error('Project code is required for contract ID generation');
        console.error('Project code error:', error);
        toast({
          title: "Project Code Missing",
          description: "The selected project doesn't have a valid project code.",
          variant: "destructive"
        });
        throw error;
      }
      
      contractId = await generateContractId(
        'subcontract',
        project.code,
        undefined,
        existingContracts
      );
    }
    
    // Validate uniqueness
    if (!validateContractIdUniqueness(contractId, existingContracts)) {
      const error = new Error('Contract ID conflict detected');
      console.error('Contract ID conflict:', error);
      toast({
        title: "Contract ID Conflict",
        description: "Generated contract ID already exists. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Validate contract ID format
  if (data.contractType === 'ADD') {
    if (!validateAddendumFormat(contractId)) {
      const error = new Error('Invalid addendum contract ID format');
      console.error('Format validation error:', error);
      toast({
        title: "Invalid Addendum Format",
        description: "Addendum contract ID must follow format: [parent-contract-number]-ADDXX",
        variant: "destructive"
      });
      throw error;
    }
  } else {
    // For regular subcontracts
    const project = projects.find(p => p.id === data.project);
    if (project && !validateSubcontractFormat(contractId, project.code)) {
      const error = new Error('Invalid contract ID format');
      console.error('Format validation error:', error);
      toast({
        title: "Invalid Contract Format",
        description: `Contract ID must follow format: ID-${project.code}-XXXX`,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Create the subcontract payload with proper addendum number handling
  const subcontractPayload = {
    contract_number: contractId,
    project_id: data.project,
    subcontractor_id: data.subcontractor,
    status: data.status || 'draft',
    total_value: data.totalValue || 0,
    start_date: data.startDate,
    end_date: data.endDate,
    description: data.description || '',
    contract_type: data.contractType || 'subcontract',
    addendum_number: data.contractType === 'ADD' ? addendumNumber : null,
    parent_subcontract_id: data.contractType === 'ADD' ? (data.parentSubcontractId || null) : null,
    date_of_issuing: data.dateOfIssuing || null,
  };

  console.log('Supabase insert payload:', subcontractPayload);

  let createdSubcontract;
  try {
    createdSubcontract = await subcontractService.create(subcontractPayload);
    console.log('Subcontract created successfully:', createdSubcontract);
  } catch (error) {
    console.error("Error creating subcontract in Supabase:", error);
    toast({
      title: "Save Failed",
      description: `Could not save subcontract: ${error instanceof Error ? error.message : "Unknown error"}`,
      variant: "destructive"
    });
    throw error;
  }

  // Save trade items if any
  if (data.tradeItems && data.tradeItems.length > 0) {
    console.log('Processing trade items:', data.tradeItems);

    const tradeItemsPayload = data.tradeItems.map((item, index) => {
      const tradeId = trades.find(t => t.name === item.trade)?.id;
      const tradeItemId = findTradeItemId(tradeItems, tradeId || '', item.item);

      console.log(`Trade item ${index}:`, {
        tradeName: item.trade,
        tradeId,
        itemName: item.item,
        tradeItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        wastagePercentage: item.wastagePercentage ?? 0
      });

      return {
        subcontract_id: createdSubcontract.id,
        trade_item_id: tradeItemId || '',
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.total,
        wastage_percentage: item.wastagePercentage ?? 0
      };
    }).filter(item => item.trade_item_id);

    if (tradeItemsPayload.length > 0) {
      try {
        await subcontractTradeItemService.createMany(tradeItemsPayload);
        console.log('Trade items saved successfully');
      } catch (tradeItemError) {
        console.error('Error saving trade items:', tradeItemError);
        toast({
          title: "Partial Success",
          description: "Subcontract created but some trade items could not be saved.",
          variant: "destructive"
        });
      }
    }
  }

  // Save responsibilities if any
  if (data.responsibilities && data.responsibilities.length > 0) {
    console.log('Processing responsibilities:', data.responsibilities);

    const responsibilityPayload = data.responsibilities.map((responsibilityName) => {
      const responsibilityId = findResponsibilityId(responsibilities, responsibilityName);

      return {
        subcontract_id: createdSubcontract.id,
        responsibility_id: responsibilityId || '',
      };
    }).filter(item => item.responsibility_id);

    if (responsibilityPayload.length > 0) {
      try {
        await subcontractResponsibilityService.createMany(responsibilityPayload);
        console.log('Responsibilities saved successfully');
      } catch (responsibilityError) {
        console.error('Error saving responsibilities:', responsibilityError);
        toast({
          title: "Partial Success",
          description: "Subcontract created but some responsibilities could not be saved.",
          variant: "destructive"
        });
      }
    }
  }

  console.log('Subcontract creation completed successfully');
  return createdSubcontract;
};

export const updateSubcontractWithTradeItems = async (
  id: string,
  data: Partial<Subcontract>,
  trades: any[],
  tradeItems: any[],
  responsibilities: any[] = []
) => {
  console.log('Updating subcontract:', id, data);
  
  const updatePayload = {
    contract_number: data.contractId,
    project_id: data.project,
    subcontractor_id: data.subcontractor,
    status: data.status,
    total_value: data.totalValue,
    start_date: data.startDate,
    end_date: data.endDate,
    description: data.description || '',
  };

  await subcontractService.update(id, updatePayload);

  // Update trade items if provided
  if (data.tradeItems) {
    // Delete existing trade items
    await subcontractTradeItemService.deleteBySubcontractId(id);
    
    // Add new trade items
    if (data.tradeItems.length > 0) {
      const tradeItemsPayload = data.tradeItems.map(item => {
        const tradeId = trades.find(t => t.name === item.trade)?.id;
        const tradeItemId = findTradeItemId(tradeItems, tradeId || '', item.item);
        
        return {
          subcontract_id: id,
          trade_item_id: tradeItemId || '',
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.total,
          wastage_percentage: item.wastagePercentage ?? 0
        };
      }).filter(item => item.trade_item_id);

      if (tradeItemsPayload.length > 0) {
        await subcontractTradeItemService.createMany(tradeItemsPayload);
      }
    }
  }

  // Update responsibilities if provided
  if (data.responsibilities) {
    // Delete existing responsibilities
    await subcontractResponsibilityService.deleteBySubcontractId(id);
    
    // Add new responsibilities
    if (data.responsibilities.length > 0) {
      const responsibilityPayload = data.responsibilities.map(responsibilityName => {
        const responsibilityId = findResponsibilityId(responsibilities, responsibilityName);
        
        return {
          subcontract_id: id,
          responsibility_id: responsibilityId || '',
        };
      }).filter(item => item.responsibility_id);

      if (responsibilityPayload.length > 0) {
        await subcontractResponsibilityService.createMany(responsibilityPayload);
      }
    }
  }
};

export const deleteSubcontractWithTradeItems = async (id: string) => {
  // Delete responsibilities first
  await subcontractResponsibilityService.deleteBySubcontractId(id);
  // Delete trade items
  await subcontractTradeItemService.deleteBySubcontractId(id);
  // Delete the subcontract
  await subcontractService.delete(id);
};

export const deleteManySubcontractsWithTradeItems = async (ids: string[]) => {
  for (const id of ids) {
    await subcontractResponsibilityService.deleteBySubcontractId(id);
    await subcontractTradeItemService.deleteBySubcontractId(id);
    await subcontractService.delete(id);
  }
};
