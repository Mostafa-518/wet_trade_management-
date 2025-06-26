
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
      // Start with initial values
      let persistedState = { ...initialValues };

      // Load from storage
      const storedData = loadFromStorage();
      persistedState = { ...persistedState, ...storedData };

      // Load from URL if enabled
      const urlData = loadFromUrl();
      persistedState = { ...persistedState, ...urlData };

      // Filter out excluded fields
      excludeFields.forEach(field => {
        if (field in persistedState) {
          persistedState[field as keyof T] = initialValues[field as keyof T];
        }
      });

      return persistedState;
    } catch (error) {
      console.warn('Failed to load persisted form state:', error);
      return initialValues;
    }
  }, [initialValues, loadFromStorage, loadFromUrl, excludeFields]);

  const [formValues, setFormValues] = useState<T>(loadPersistedState);

  // Create debounced save function
  const debouncedSave = createDebouncedSave(saveToStorage, debounceMs);

  // Generic change handler for all input types
  const handleChange = useCallback((field: keyof T, value: any) => {
    setFormValues(prev => {
      const newValues = { ...prev, [field]: value };
      debouncedSave(newValues);
      updateUrl(newValues);
      return newValues;
    });
  }, [debouncedSave, updateUrl]);

  // Batch update multiple fields
  const handleBatchChange = useCallback((updates: Partial<T>) => {
    setFormValues(prev => {
      const newValues = { ...prev, ...updates };
      debouncedSave(newValues);
      updateUrl(newValues);
      return newValues;
    });
  }, [debouncedSave, updateUrl]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    clearStorage();
    clearUrl();
  }, [initialValues, clearStorage, clearUrl]);

  // Load state when location changes
  useEffect(() => {
    setFormValues(loadPersistedState());
  }, [loadPersistedState]);

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
