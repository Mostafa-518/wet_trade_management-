export function useSubcontractHelpers(projects: any[] = [], subcontractors: any[] = []) {
  const getProjectName = (projectId: string) => projectId;
  const getSubcontractorName = (subcontractorId: string) => subcontractorId;
  
  return {
    getProjectName,
    getSubcontractorName
  };
}