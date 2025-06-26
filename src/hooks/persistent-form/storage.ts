
import { PersistentFormOptions } from './types';

export function createStorageOperations<T extends Record<string, any>>(
  storageKey: string,
  storage: Storage,
  initialValues: T,
  excludeFields: string[]
) {
  const loadFromStorage = (): Partial<T> => {
    try {
      console.log('Loading from storage with key:', storageKey);
      const storedData = storage.getItem(storageKey);
      if (storedData) {
        const parsed = JSON.parse(storedData) as Record<string, any>;
        console.log('Parsed storage data:', parsed);
        
        // Only return non-empty values
        const filteredData: Partial<T> = {};
        Object.entries(parsed).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            filteredData[key as keyof T] = value as T[keyof T];
          }
        });
        
        return filteredData;
      }
      console.log('No data found in storage');
    } catch (error) {
      console.warn('Failed to load from storage:', error);
    }
    return {};
  };

  const saveToStorage = (values: T): void => {
    try {
      // Filter out excluded fields and empty values before saving
      const valuesToSave: Partial<T> = {};
      
      Object.entries(values).forEach(([key, value]) => {
        if (!excludeFields.includes(key) && value !== null && value !== undefined && value !== '') {
          valuesToSave[key as keyof T] = value;
        }
      });
      
      console.log('Saving to storage:', storageKey, valuesToSave);
      storage.setItem(storageKey, JSON.stringify(valuesToSave));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  };

  const clearStorage = (): void => {
    try {
      console.log('Clearing storage for key:', storageKey);
      storage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  };

  return {
    loadFromStorage,
    saveToStorage,
    clearStorage
  };
}

export function createDebouncedSave<T extends Record<string, any>>(
  saveFunction: (values: T) => void,
  debounceMs: number
) {
  let timeoutId: NodeJS.Timeout;
  
  return (values: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      saveFunction(values);
    }, debounceMs);
  };
}
