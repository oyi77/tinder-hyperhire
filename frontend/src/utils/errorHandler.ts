import {AxiosError} from 'axios';

/**
 * Detects if an error is a SQL/database related error
 */
const isDatabaseError = (error: any): boolean => {
  const errorMessage = (
    error?.response?.data?.message ||
    error?.message ||
    error?.response?.data?.error ||
    JSON.stringify(error?.response?.data || {})
  ).toLowerCase();

  const databaseKeywords = [
    'sql',
    'database',
    'query exception',
    'connection refused',
    'connection timeout',
    'table doesn\'t exist',
    'column doesn\'t exist',
    'syntax error',
    'integrity constraint',
    'foreign key',
    'primary key',
    'unique constraint',
    'pdo exception',
    'mysqli',
    'sqlstate',
    'access denied',
    'unknown database',
    'table',
    'column',
    'constraint',
    'integrity',
  ];

  return databaseKeywords.some(keyword => errorMessage.includes(keyword));
};

/**
 * Detects if an error is a network/connection error
 */
const isNetworkError = (error: any): boolean => {
  return (
    error?.code === 'ECONNABORTED' ||
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('timeout') ||
    !error?.response
  );
};

/**
 * Gets user-friendly error message from error object
 */
export const getErrorMessage = (error: any): string => {
  // Network/Connection errors
  if (isNetworkError(error)) {
    if (error?.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }
    return 'Network error. Please check your connection and ensure the backend is running.';
  }

  // Database/SQL errors - wrap with maintenance message
  if (isDatabaseError(error)) {
    return 'There is maintenance on backend, try again later';
  }

  // Validation errors (422)
  if (error?.response?.status === 422) {
    const validationMessage = error?.response?.data?.message;
    if (validationMessage && !isDatabaseError({message: validationMessage})) {
      return validationMessage;
    }
    return 'Invalid input. Please check your data and try again.';
  }

  // Unauthorized errors (401)
  if (error?.response?.status === 401) {
    return 'Invalid credentials. Please check your email and password.';
  }

  // Forbidden errors (403)
  if (error?.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  // Not found errors (404)
  if (error?.response?.status === 404) {
    return 'The requested resource was not found.';
  }

  // Server errors (500+)
  if (error?.response?.status >= 500) {
    return 'There is maintenance on backend, try again later';
  }

  // Try to get message from response
  if (error?.response?.data?.message) {
    const message = error.response.data.message;
    // Double check it's not a database error
    if (!isDatabaseError({message})) {
      return message;
    }
    return 'There is maintenance on backend, try again later';
  }

  // Fallback to error message
  if (error?.message) {
    // Check if it's a database error
    if (isDatabaseError({message: error.message})) {
      return 'There is maintenance on backend, try again later';
    }
    return error.message;
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Transforms axios error to have user-friendly message
 */
export const transformError = (error: any): AxiosError => {
  const message = getErrorMessage(error);
  
  // Create a new error object with the transformed message
  const transformedError = error as AxiosError;
  
  // Override the message in response data if it exists
  if (transformedError.response?.data) {
    transformedError.response.data = {
      ...transformedError.response.data,
      message,
    };
  }
  
  // Override the error message
  if (transformedError.message) {
    transformedError.message = message;
  }
  
  return transformedError;
};

