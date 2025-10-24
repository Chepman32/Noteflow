/**
 * Analytics Service
 * Track user behavior and errors
 */

import * as Sentry from '@sentry/react-native';

export enum AnalyticsEvent {
  // App Events
  AppOpened = 'app_opened',
  AppClosed = 'app_closed',

  // Notebook Events
  NotebookCreated = 'notebook_created',
  NotebookOpened = 'notebook_opened',
  NotebookDeleted = 'notebook_deleted',

  // Page Events
  PageCreated = 'page_created',
  PageOpened = 'page_opened',
  PageDeleted = 'page_deleted',
  PageExported = 'page_exported',

  // Drawing Events
  StrokeDrawn = 'stroke_drawn',
  ShapeRecognized = 'shape_recognized',
  TextAdded = 'text_added',
  ImageAdded = 'image_added',

  // Tool Events
  ToolChanged = 'tool_changed',
  ColorChanged = 'color_changed',

  // Premium Events
  PremiumViewed = 'premium_viewed',
  PurchaseInitiated = 'purchase_initiated',
  PurchaseCompleted = 'purchase_completed',
  PurchaseFailed = 'purchase_failed',

  // Search Events
  SearchPerformed = 'search_performed',

  // Settings Events
  ThemeChanged = 'theme_changed',
  SettingsChanged = 'settings_changed',
}

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

export class AnalyticsService {
  private static isInitialized = false;

  /**
   * Initialize analytics
   */
  static initialize(): void {
    if (this.isInitialized) return;

    // Initialize Sentry
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      environment: __DEV__ ? 'development' : 'production',
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      tracesSampleRate: 1.0,
    });

    this.isInitialized = true;
  }

  /**
   * Track event
   */
  static trackEvent(
    event: AnalyticsEvent,
    properties?: AnalyticsProperties,
  ): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    // Log to console in development
    if (__DEV__) {
      console.log('[Analytics]', event, properties);
    }

    // Track with Sentry breadcrumb
    Sentry.addBreadcrumb({
      category: 'user_action',
      message: event,
      level: 'info',
      data: properties,
    });

    // Would also send to Amplitude or other analytics service
  }

  /**
   * Track screen view
   */
  static trackScreenView(screenName: string): void {
    this.trackEvent(AnalyticsEvent.AppOpened, {screen: screenName});

    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Screen: ${screenName}`,
      level: 'info',
    });
  }

  /**
   * Track error
   */
  static trackError(error: Error, context?: AnalyticsProperties): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    console.error('[Error]', error, context);

    Sentry.captureException(error, {
      extra: context,
    });
  }

  /**
   * Set user properties
   */
  static setUserProperties(properties: AnalyticsProperties): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    Sentry.setUser({
      id: properties.userId as string,
      ...properties,
    });
  }

  /**
   * Track timing
   */
  static trackTiming(
    category: string,
    variable: string,
    time: number,
  ): void {
    this.trackEvent(AnalyticsEvent.AppOpened, {
      category,
      variable,
      time,
    });
  }

  /**
   * Clear user data (for privacy)
   */
  static clearUserData(): void {
    Sentry.setUser(null);
  }
}
