
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { PersistentFormOptions } from './types';
import { createStorageOperations, createDebouncedSave } from './storage';
import { createUrlSyncOperations } from './url-sync';
import { createFormHelpers } from './form-helpers';

export function usePersistentFormState<T extends Record<string, any>>(
  initialValues: T,
  options: PersistentFormOptions = {}
) {
  const location = useLocation();
  const {
    customKey,
    syncWithUrl = false,
    storageType = 'localStorage',
    debounceMs = 300,
    excludeFields = []
  } = options;

  // Generate storage key based on current path or custom key
  const storageKey = customKey || `form-state-${location.pathname}`;
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;

  // Create storage operations
  const { loadFromStorage, saveToStorage, clearStorage } = createStorageOperations(
    storageKey,
    storage,
    initialValues,
    excludeFields
  );

  // Create URL sync operations
  const { loadFromUrl, updateUrl, clearUrl } = createUrlSyncOperations<T>(
    syncWithUrl,
    excludeFields
  );

  // Load initial state from storage and URL
  const loadPersistedState = useCallback((): T => {
    try {
      console.log('Loading persisted state for key:', storageKey);
      
      // Start with initial values
      let persistedState = { ...initialValues };

      // Load from storage
      const storedData = loadFromStorage();
      console.log('Loaded from storage:', storedData);
      persistedState = { ...persistedState, ...storedData };

      // Load from URL if enabled
      const urlData = loadFromUrl(location.search);
      console.log('Loaded from URL:', urlData);
      persistedState = { ...persistedState, ...urlData };

      // Filter out excluded fields
      excludeFields.forEach(field => {
        if (field in persistedState) {
          persistedState[field as keyof T] = initialValues[field as keyof T];
        }
      });

      console.log('Final persisted state:', persistedState);
      return persistedState;
    } catch (error) {
      console.warn('Failed to load persisted form state:', error);
      return initialValues;
    }
  }, [initialValues, loadFromStorage, loadFromUrl, excludeFields, storageKey, location.search]);

  const [formValues, setFormValues] = useState<T>(loadPersistedState);

  // Create debounced save function
  const debouncedSave = createDebouncedSave(saveToStorage, debounceMs);

  // Generic change handler for all input types
  const handleChange = useCallback((field: keyof T, value: any) => {
    console.log('Form value changed:', field, value);
    setFormValues(prev => {
      const newValues = { ...prev, [field]: value };
      console.log('Saving new values:', newValues);
      debouncedSave(newValues);
      updateUrl(newValues, location);
      return newValues;
    });
  }, [debouncedSave, updateUrl, location]);

  // Batch update multiple fields
  const handleBatchChange = useCallback((updates: Partial<T>) => {
    setFormValues(prev => {
      const newValues = { ...prev, ...updates };
      debouncedSave(newValues);
      updateUrl(newValues, location);
      return newValues;
    });
  }, [debouncedSave, updateUrl, location]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    console.log('Resetting form to initial values');
    setFormValues(initialValues);
    clearStorage();
    clearUrl(location.pathname);
  }, [initialValues, clearStorage, clearUrl, location.pathname]);

  // Load state when location changes or component mounts
  useEffect(() => {
    console.log('Location changed, reloading persisted state');
    const persistedState = loadPersistedState();
    setFormValues(persistedState);
  }, [location.pathname, location.search]);

  // Create form helpers
  const formHelpers = createFormHelpers(formValues, handleChange, initialValues);

  return {
    formValues,
    handleChange,
    handleBatchChange,
    resetForm,
    ...formHelpers
  };
}

// Re-export types for convenience
export type { PersistentFormOptions } from './types';
