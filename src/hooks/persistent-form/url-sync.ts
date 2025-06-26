
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function createUrlSyncOperations<T extends Record<string, any>>(
  syncWithUrl: boolean,
  excludeFields: string[]
) {
  const location = useLocation();

  const loadFromUrl = useCallback((): Partial<T> => {
    if (!syncWithUrl) return {};

    try {
      const urlParams = new URLSearchParams(location.search);
      const urlData: Partial<T> = {};
      
      urlParams.forEach((value, key) => {
        if (!excludeFields.includes(key)) {
          // Try to parse as JSON for complex values, fallback to string
          try {
            urlData[key as keyof T] = JSON.parse(value);
          } catch {
            urlData[key as keyof T] = value as T[keyof T];
          }
        }
      });

      return urlData;
    } catch (error) {
      console.warn('Failed to load from URL:', error);
      return {};
    }
  }, [syncWithUrl, location.search, excludeFields]);

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

  const clearUrl = useCallback(() => {
    if (!syncWithUrl) return;
    
    try {
      window.history.replaceState({}, '', location.pathname);
    } catch (error) {
      console.warn('Failed to clear URL:', error);
    }
  }, [syncWithUrl, location.pathname]);

  return {
    loadFromUrl,
    updateUrl,
    clearUrl
  };
}
