export function useSubcontractHelpers() {
  const getProjectName = (projectId: string) => projectId;
  const getSubcontractorName = (subcontractorId: string) => subcontractorId;
  
  return {
    getProjectName,
    getSubcontractorName
  };
}