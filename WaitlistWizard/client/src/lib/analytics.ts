// Simple analytics tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // In production this would connect to a real analytics service
  console.log(`[Analytics] ${eventName}`, properties);
};
