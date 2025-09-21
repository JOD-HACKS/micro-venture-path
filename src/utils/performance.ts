// Performance monitoring and optimization utilities

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              
              this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart, 'ms');
              this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, 'ms');
              this.recordMetric('first_paint', navEntry.responseStart - navEntry.fetchStart, 'ms');
            }
          });
        });
        
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation timing observer not supported');
      }

      // Observe paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.recordMetric(entry.name.replace('-', '_'), entry.startTime, 'ms');
          });
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Paint timing observer not supported');
      }

      // Observe largest contentful paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('largest_contentful_paint', lastEntry.startTime, 'ms');
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported');
      }

      // Observe first input delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as PerformanceEventTiming;
            this.recordMetric('first_input_delay', fidEntry.processingStart - fidEntry.startTime, 'ms');
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer not supported');
      }
    }
  }

  recordMetric(name: string, value: number, unit: string = 'ms') {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    };
    
    this.metrics.push(metric);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendMetricToAnalytics(metric);
    } else {
      console.log(`Performance: ${name}: ${value}${unit}`);
    }
  }

  private sendMetricToAnalytics(metric: PerformanceMetric) {
    // TODO: Send to analytics service
    // analytics.track('performance_metric', metric);
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return null;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for measuring custom performance
export function measureAsync<T>(
  name: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return asyncFn().finally(() => {
    const endTime = performance.now();
    performanceMonitor.recordMetric(name, endTime - startTime, 'ms');
  });
}

export function measureSync<T>(
  name: string,
  syncFn: () => T
): T {
  const startTime = performance.now();
  
  try {
    return syncFn();
  } finally {
    const endTime = performance.now();
    performanceMonitor.recordMetric(name, endTime - startTime, 'ms');
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getAverageMetric: performanceMonitor.getAverageMetric.bind(performanceMonitor),
    measureAsync,
    measureSync
  };
}

// Web Vitals helper
export function getWebVitals(): Promise<{
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}> {
  return new Promise((resolve) => {
    const vitals = { lcp: null, fid: null, cls: null, fcp: null, ttfb: null };
    let collected = 0;
    const total = 5;

    const checkComplete = () => {
      collected++;
      if (collected >= total) {
        resolve(vitals);
      }
    };

    // Get LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
          lcpObserver.disconnect();
          checkComplete();
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        vitals.lcp = null;
        checkComplete();
      }

      // Get FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as PerformanceEventTiming;
            vitals.fid = fidEntry.processingStart - fidEntry.startTime;
          });
          fidObserver.disconnect();
          checkComplete();
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch {
        vitals.fid = null;
        checkComplete();
      }

      // Get CLS
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if ('hadRecentInput' in entry && !(entry as unknown as { hadRecentInput?: boolean }).hadRecentInput) {
              clsValue += (entry as unknown as { value: number }).value;
            }
          });
          vitals.cls = clsValue;
          checkComplete();
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch {
        vitals.cls = null;
        checkComplete();
      }

      // Get FCP
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
          });
          fcpObserver.disconnect();
          checkComplete();
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch {
        vitals.fcp = null;
        checkComplete();
      }

      // Get TTFB
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        vitals.ttfb = navigation.responseStart - navigation.fetchStart;
      }
      checkComplete();
    } else {
      resolve(vitals);
    }
  });
}

// Preload resources
export function preloadResource(href: string, as: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Prefetch resources
export function prefetchResource(href: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}