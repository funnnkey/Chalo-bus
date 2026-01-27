import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

export class AnalyticsService {
  static trackBusSearch(fromStop: string, toStop: string, city: string) {
    logEvent(analytics, 'bus_search', {
      from_stop: fromStop,
      to_stop: toStop,
      city: city,
      search_type: 'local_bus',
    });
  }

  static trackRouteSelection(routeNumber: string, city: string) {
    logEvent(analytics, 'route_selected', {
      route_number: routeNumber,
      city: city,
    });
  }

  static trackNotificationSet(stopName: string, routeNumber: string) {
    logEvent(analytics, 'notification_set', {
      stop_name: stopName,
      route_number: routeNumber,
    });
  }

  static trackAppOpen() {
    logEvent(analytics, 'app_open');
  }

  static trackError(error: string, screen: string) {
    logEvent(analytics, 'app_error', {
      error_message: error,
      screen_name: screen,
    });
  }
}