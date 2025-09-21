// Analytics utilities for tracking user interactions

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
  timestamp?: number;
}

interface PageViewEvent {
  page: string;
  title?: string;
  referrer?: string;
  userId?: string;
}

class Analytics {
  private isEnabled: boolean;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.sessionId = this.generateSessionId();
    
    // Initialize analytics services
    if (this.isEnabled) {
      this.initializeServices();
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private initializeServices() {
    // TODO: Initialize real analytics services
    // Example: Google Analytics, Mixpanel, PostHog, etc.
    console.log('Analytics initialized');
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.log('Analytics Event:', event);
      return;
    }

    const enrichedEvent = {
      ...event,
      userId: event.userId || this.userId,
      sessionId: this.sessionId,
      timestamp: event.timestamp || Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Send to analytics service
    this.sendEvent(enrichedEvent);
  }

  page(event: PageViewEvent) {
    if (!this.isEnabled) {
      console.log('Page View:', event);
      return;
    }

    const pageEvent = {
      name: 'page_view',
      properties: {
        page: event.page,
        title: event.title || document.title,
        referrer: event.referrer || document.referrer,
        url: window.location.href,
      },
      userId: event.userId || this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    this.sendEvent(pageEvent);
  }

  private async sendEvent(event: Record<string, unknown>) {
    try {
      // TODO: Replace with actual analytics endpoint
      console.log('Sending analytics event:', event);
      
      // Example: Send to your analytics API
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Common event tracking methods
  trackProjectView(projectId: string, projectTitle: string) {
    this.track({
      name: 'project_viewed',
      properties: {
        project_id: projectId,
        project_title: projectTitle,
      },
    });
  }

  trackApplicationStart(projectId: string) {
    this.track({
      name: 'application_started',
      properties: {
        project_id: projectId,
      },
    });
  }

  trackApplicationSubmit(projectId: string, method: 'web' | 'sms' | 'offline') {
    this.track({
      name: 'application_submitted',
      properties: {
        project_id: projectId,
        submission_method: method,
      },
    });
  }

  trackSearch(query: string, resultsCount: number) {
    this.track({
      name: 'search_performed',
      properties: {
        query,
        results_count: resultsCount,
      },
    });
  }

  trackSignup(method: 'email' | 'google' | 'github', userRole: string) {
    this.track({
      name: 'user_signed_up',
      properties: {
        signup_method: method,
        user_role: userRole,
      },
    });
  }

  trackLogin(method: 'email' | 'google' | 'github') {
    this.track({
      name: 'user_logged_in',
      properties: {
        login_method: method,
      },
    });
  }

  trackFeatureUsage(feature: string, action: string) {
    this.track({
      name: 'feature_used',
      properties: {
        feature,
        action,
      },
    });
  }

  trackError(error: string, context?: Record<string, unknown>) {
    this.track({
      name: 'error_occurred',
      properties: {
        error_message: error,
        ...context,
      },
    });
  }

  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track({
      name: 'performance_metric',
      properties: {
        metric,
        value,
        unit,
      },
    });
  }

  // A/B testing support
  trackExperiment(experimentName: string, variant: string) {
    this.track({
      name: 'experiment_viewed',
      properties: {
        experiment: experimentName,
        variant,
      },
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    page: analytics.page.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    trackProjectView: analytics.trackProjectView.bind(analytics),
    trackApplicationStart: analytics.trackApplicationStart.bind(analytics),
    trackApplicationSubmit: analytics.trackApplicationSubmit.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackSignup: analytics.trackSignup.bind(analytics),
    trackLogin: analytics.trackLogin.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackExperiment: analytics.trackExperiment.bind(analytics),
  };
}