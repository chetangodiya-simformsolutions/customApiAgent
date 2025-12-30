import type { ApiResponse } from 'apisauce';
import * as Sentry from '@sentry/react-native';
import { isEmpty, isEqual } from 'lodash';
import { AppConst, Strings } from '../constants';
import type { UserResponse } from '../types';

/**
 * Initializes the Sentry client with the Sentry URL, the environment, and whether or not we're in debug mode..
 * @param {string} dsn - The DSN for the Sentry server.
 * @param {string} environment - The environment of the application.
 * @param {boolean} debug - Whether or not to enable debug mode.
 * @returns None
 */
if (!AppConst.isDevelopment && !isEmpty(AppConst.sentryUrl) && !isEqual(AppConst.sentryUrl, 'NA')) {
  Sentry.init({
    dsn: AppConst.sentryUrl,
    environment: AppConst.environment,
    debug: AppConst.isDevelopment,
    beforeSend: (event, hint) => {
      const error = hint.originalException;

      // Ignore specific error messages
      const ignoredErrors = [
        // Add any other error messages you want to ignore here
        'Network request failed'
      ];

      // @ts-expect-error - We're modifying the event sending process
      if (error && ignoredErrors.some((err) => error.message?.includes(err))) {
        return null; // Prevent this error from being reported
      }
      return event;
    }
  });
}

/**
 * Captures API errors and logs them to Sentry with custom details.
 * @param {string} endpoint - The API endpoint that was called.
 * @param {ApiResponse<any> | null} response - The response object from the API call.
 * @param {unknown} error - The error message or object that was encountered.
 * @returns None
 */
export function sentryCaptureAPIException(
  endpoint: string | undefined,
  response: ApiResponse<any> | null,
  error: unknown
): void {
  if (!AppConst.isDevelopment) {
    const errorMessage: string =
      typeof error === 'string'
        ? error
        : error instanceof Error
        ? error?.message
        : Strings.APIError.unexpectedError;

    const customError: Error = new Error(errorMessage);
    customError.name = endpoint ? `${Strings.APIError.error}: ${endpoint}` : Strings.APIError.error;

    Sentry.captureException(customError, {
      extra: {
        endpoint,
        response,
        errorMessage,
        status: response?.status,
        ErrorResponse: response?.data
        }
    });
  }
}

/**
 * Captures a message to Sentry.
 * It takes in an event name, a request object, and an error object, and then it sends all of that data
 * to Sentry
 * @param {string} eventName - the name of the event to capture
 * @param {object | null} request - he request object that was sent
 * @param {object | null} error - The error object that was thrown
 * @returns None
 */
export function sentryCaptureMessage(
  eventName: string,
  request: object | null,
  error: object | null
): void {
  if (!AppConst.isDevelopment) {
    Sentry.withScope((scope) => {
      scope.setExtra(eventName, {
        Request: JSON.stringify(request ?? {}),
        Error: JSON.stringify(error ?? {})
      });
      Sentry.captureMessage(eventName);
    });
  } 
}

/**
 * Captures an exception in Sentry.
 * If we're in development mode, log the error to the console, otherwise send it to Sentry
 * @param {Error} error - the error to capture
 * @returns None
 */
export function sentryCaptureException(error: Error): void {
  if (!AppConst.isDevelopment) Sentry.captureException(error);
}

/**
 * Sets the user information for Sentry.
 * @param {UserResponse} user - the user information to set for Sentry.
 * @returns None
 */
export function loginSentry(user: UserResponse): void {
  Sentry.setUser({
    id: String(user.id),
    displayName: user.displayName,
    realName: user.displayName,
    email: user.email,
    phone: user.phone
  });
}
