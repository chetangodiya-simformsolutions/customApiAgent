import Config from 'react-native-config';
const appVersion = 'v1.0(1)';

/**
 * A constant freezing object that contains the app value.
 * @type {Object}
 */
export default Object.freeze({
  mobile: 'Mobile',
  isDevelopment: __DEV__,
  environment: Config.ENVIRONMENT ?? 'dev',
  sentryUrl: Config.SENTRY_URL ?? '',
  apiUrl: Config.API_URL ?? '',
  appVersion
});
