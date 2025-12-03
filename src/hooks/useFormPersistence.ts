import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'team_registration_draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useFormPersistence<T>(
  formData: T,
  enabled: boolean = true
) {
  // Save to localStorage
  const saveToStorage = useCallback(() => {
    if (!enabled) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: formData,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [formData, enabled]);

  // Load from localStorage
  const loadFromStorage = useCallback((): T | null => {
    if (!enabled) return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const { data, timestamp } = JSON.parse(stored);
      
      // Check if data is less than 7 days old
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > sevenDaysInMs) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load form data:', error);
      return null;
    }
  }, [enabled]);

  // Clear storage
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, []);

  // Check if draft exists
  const hasDraft = useCallback((): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(saveToStorage, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [saveToStorage, enabled]);

  // Save on window unload
  useEffect(() => {
    if (!enabled) return;

    const handleUnload = () => saveToStorage();
    window.addEventListener('beforeunload', handleUnload);
    
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [saveToStorage, enabled]);

  return {
    saveToStorage,
    loadFromStorage,
    clearStorage,
    hasDraft,
  };
}
