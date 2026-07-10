'use client';

import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

/**
 * Drop-in replacement for useState that also persists the value
 * to localStorage under the given key.
 *
 * @example
 *   const [notes, setNotes] = useLocalStorage<Note[]>('devos_notes', []);
 */
export function useLocalStorage<T>(key: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => loadFromStorage(key, fallback));

  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
