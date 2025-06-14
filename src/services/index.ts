
// Export all services and types from a central location
export * from './types';
export * from './authService';
export * from './projectService';
export * from './subcontractorService';
export * from './tradeService';
export * from './tradeItemService';
export * from './subcontractTradeItemService';
export * from './responsibilityService';
export * from './subcontractService';
export * from './userProfileService';

// Export service instances for backward compatibility
export { projectService } from './projectService';
export { subcontractorService } from './subcontractorService';
export { tradeService } from './tradeService';
export { tradeItemService } from './tradeItemService';
export { subcontractTradeItemService } from './subcontractTradeItemService';
export { responsibilityService } from './responsibilityService';
export { subcontractService } from './subcontractService';
export { userProfileService } from './userProfileService';
