"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from 'react';

// Utility for memoizing expensive computations
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T {
  return useCallback(callback, deps);
}

// Utility for debouncing expensive operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Utility for lazy loading images
export function useLazyImage(src: string, threshold = 0.1) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError('Failed to load image');
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, error };
}

// Utility for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 100) { // Log slow renders
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
}

// Utility for optimizing list rendering
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

// Utility for caching expensive computations
export function useCache<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string
) {
  const cache = useRef<Map<string, ReturnType<T>>>(new Map());

  const cachedFn = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator(...args);

    if (cache.current.has(key)) {
      return cache.current.get(key)!;
    }

    const result = fn(...args);
    cache.current.set(key, result);
    return result;
  }, [fn, keyGenerator]);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      cache.current.clear();
    };
  }, []);

  return cachedFn;
}