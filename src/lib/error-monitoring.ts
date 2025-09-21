// Error Monitoring Service
// Integrates with Sentry, LogRocket, or other monitoring services

export interface ErrorContext {
  userId?: string;
  userEmail?: string;
  url?: string;
  userAgent?: string;
  timestamp?: number;
  componentStack?: string;
  additionalData?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  timing: PerformanceTiming;
  navigation: PerformanceNavigation;
  memory?: any;
}

class ErrorMonitoringService {
  private isEnabled: boolean;
  private userId: string | null = null;
  private environment: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.environment = process.env.NODE_ENV || 'development';
    
    if (this.isEnabled) {
      this.initializeErrorMonitoring();
    }
  }

  private initializeErrorMonitoring() {
    // Initialize error monitoring services
    console.log('Error monitoring initialized for:', this.environment);
    
    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        additionalData: {
          type: 'unhandledrejection',
          reason: event.reason
        }
      });
    });
  }

  setUser(userId: string, email?: string) {
    this.userId = userId;
    
    // Set user context in monitoring service
    if (this.isEnabled) {
      console.log('User context set:', { userId, email });
      // TODO: Integrate with Sentry
      // Sentry.setUser({ id: userId, email });
    }
  }

  clearUser() {
    this.userId = null;
    
    if (this.isEnabled) {
      console.log('User context cleared');
      // TODO: Clear user in monitoring service
      // Sentry.setUser(null);
    }
  }

  captureError(error: Error, context?: ErrorContext) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      userId: context?.userId || this.userId,
      userEmail: context?.userEmail,
      url: context?.url || window.location.href,
      userAgent: context?.userAgent || navigator.userAgent,
      timestamp: context?.timestamp || Date.now(),
      componentStack: context?.componentStack,
      environment: this.environment,
      ...context?.additionalData
    };

    if (this.isEnabled) {
      console.error('Error captured:', errorData);
      
      // Send to monitoring service
      this.sendToMonitoringService(errorData);
      
      // TODO: Integrate with Sentry
      // Sentry.captureException(error, {
      //   user: { id: this.userId, email: context?.userEmail },
      //   extra: context?.additionalData,
      //   tags: { environment: this.environment }
      // });
    } else {
      console.error('Development Error:', errorData);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    const logData = {
      message,
      level,
      userId: context?.userId || this.userId,
      url: context?.url || window.location.href,
      timestamp: context?.timestamp || Date.now(),
      environment: this.environment,
      ...context?.additionalData
    };

    if (this.isEnabled) {
      console.log(`Captured ${level}:`, logData);
      
      // Send to monitoring service
      this.sendToMonitoringService(logData);
      
      // TODO: Integrate with Sentry
      // Sentry.captureMessage(message, level as any);
    } else {
      console.log(`Development ${level}:`, logData);
    }
  }

  capturePerformanceMetrics() {
    if (!this.isEnabled || typeof window === 'undefined') {
      return;
    }

    const metrics: PerformanceMetrics = {
      timing: performance.timing,
      navigation: performance.navigation,
      memory: (performance as any).memory
    };

    const performanceData = {
      type: 'performance',
      metrics,
      url: window.location.href,
      timestamp: Date.now(),
      userId: this.userId,
      environment: this.environment
    };

    console.log('Performance metrics captured:', performanceData);
    this.sendToMonitoringService(performanceData);
  }

  private async sendToMonitoringService(data: any) {
    try {
      // In production, you would send this to your error monitoring service
      // For now, we'll store in local storage as a fallback
      
      const errorLog = {
        ...data,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      };

      // Store locally for debugging
      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 50 errors
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(existingLogs));

      // TODO: Send to actual monitoring service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorLog)
      // });
      
    } catch (error) {
      console.error('Failed to send error to monitoring service:', error);
    }
  }

  // Get stored error logs (for debugging)
  getStoredErrors(): any[] {
    try {
      return JSON.parse(localStorage.getItem('error_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored error logs
  clearStoredErrors() {
    localStorage.removeItem('error_logs');
  }

  // Add breadcrumb for debugging
  addBreadcrumb(message: string, category: string = 'default', data?: Record<string, unknown>) {
    const breadcrumb = {
      message,
      category,
      timestamp: Date.now(),
      data
    };

    if (this.isEnabled) {
      console.log('Breadcrumb:', breadcrumb);
      
      // TODO: Add to monitoring service
      // Sentry.addBreadcrumb(breadcrumb);
    }
  }
}

// Export singleton instance
export const errorMonitoring = new ErrorMonitoringService();

// React hook for error monitoring
export function useErrorMonitoring() {
  return {
    captureError: errorMonitoring.captureError.bind(errorMonitoring),
    captureMessage: errorMonitoring.captureMessage.bind(errorMonitoring),
    setUser: errorMonitoring.setUser.bind(errorMonitoring),
    clearUser: errorMonitoring.clearUser.bind(errorMonitoring),
    addBreadcrumb: errorMonitoring.addBreadcrumb.bind(errorMonitoring),
    capturePerformanceMetrics: errorMonitoring.capturePerformanceMetrics.bind(errorMonitoring)
  };
}