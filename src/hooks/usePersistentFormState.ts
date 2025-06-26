
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface PersistentFormOptions {
  // Use a custom key instead of auto-generating from path
  customKey?: string;
  // Whether to sync with URL query parameters
  syncWithUrl?: boolean;
  // Storage type to use
  storageType?: 'localStorage' | 'sessionStorage';
  // Debounce delay for saving (ms)
  debounceMs?: number;
  // Fields to exclude from persistence
  excludeFields?: string[];
}

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

  // Load initial state from storage and URL
  const loadPersistedState = useCallback((): T => {
    try {
      // Start with initial values
      let persistedState = { ...initialValues };

      // Load from storage
      const storedData = storage.getItem(storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        persistedState = { ...persistedState, ...parsedData };
      }

      // Load from URL if enabled
      if (syncWithUrl) {
        const urlParams = new URLSearchParams(location.search);
        urlParams.forEach((value, key) => {
          if (key in initialValues && !excludeFields.includes(key)) {
            // Try to parse as JSON for complex values, fallback to string
            try {
              persistedState[key as keyof T] = JSON.parse(value);
            } catch {
              persistedState[key as keyof T] = value as T[keyof T];
            }
          }
        });
      }

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
  }, [initialValues, storageKey, storage, syncWithUrl, location.search, excludeFields]);

  const [formValues, setFormValues] = useState<T>(loadPersistedState);

  // Debounced save function
  const saveToStorage = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (values: T) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          try {
            // Filter out excluded fields before saving
            const valuesToSave = { ...values };
            excludeFields.forEach(field => {
              delete valuesToSave[field as keyof T];
            });
            
            storage.setItem(storageKey, JSON.stringify(valuesToSave));
          } catch (error) {
            console.warn('Failed to save form state:', error);
          }
        }, debounceMs);
      };
    })(),
    [storageKey, storage, debounceMs, excludeFields]
  );

  // Update URL if sync is enabled
  const updateUrl = useCallback((values: T) => {
    if (!syncWithUrl) return;

    try {
      const searchParams = new URLSearchParams(location.search);
      
      Object.entries(values).forEach(([key, value]) => {
        if (!excludeFields.includes(key) && value !== undefined && value !== null && value !== '') {
          // Convert complex values to JSON strings
          const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          searchParams.set(key, stringValue);
        } else {
          searchParams.delete(key);
        }
      });

      const newSearch = searchParams.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      
      // Only update if URL actually changed
      if (newUrl !== `${location.pathname}${location.search}`) {
        window.history.replaceState({}, '', newUrl);
      }
    } catch (error) {
      console.warn('Failed to update URL:', error);
    }
  }, [syncWithUrl, location, excludeFields]);

  // Generic change handler for all input types
  const handleChange = useCallback((field: keyof T, value: any) => {
    setFormValues(prev => {
      const newValues = { ...prev, [field]: value };
      saveToStorage(newValues);
      updateUrl(newValues);
      return newValues;
    });
  }, [saveToStorage, updateUrl]);

  // Batch update multiple fields
  const handleBatchChange = useCallback((updates: Partial<T>) => {
    setFormValues(prev => {
      const newValues = { ...prev, ...updates };
      saveToStorage(newValues);
      updateUrl(newValues);
      return newValues;
    });
  }, [saveToStorage, updateUrl]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    try {
      storage.removeItem(storageKey);
      if (syncWithUrl) {
        window.history.replaceState({}, '', location.pathname);
      }
    } catch (error) {
      console.warn('Failed to reset form state:', error);
    }
  }, [initialValues, storage, storageKey, syncWithUrl, location.pathname]);

  // Clear specific field
  const clearField = useCallback((field: keyof T) => {
    handleChange(field, initialValues[field]);
  }, [handleChange, initialValues]);

  // Load state when location changes
  useEffect(() => {
    setFormValues(loadPersistedState());
  }, [loadPersistedState]);

  return {
    formValues,
    handleChange,
    handleBatchChange,
    resetForm,
    clearField,
    // Utility functions for common input patterns
    getInputProps: (field: keyof T) => ({
      value: String(formValues[field] || ''),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleChange(field, e.target.value)
    }),
    getSelectProps: (field: keyof T) => ({
      value: String(formValues[field] || ''),
      onValueChange: (value: string) => handleChange(field, value)
    }),
    getCheckboxProps: (field: keyof T) => ({
      checked: Boolean(formValues[field]),
      onCheckedChange: (checked: boolean) => handleChange(field, checked)
    }),
    getSwitchProps: (field: keyof T) => ({
      checked: Boolean(formValues[field]),
      onCheckedChange: (checked: boolean) => handleChange(field, checked)
    })
  };
}
