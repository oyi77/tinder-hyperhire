import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Fix for Chrome debugger DevTools sync method error - MUST be done before any other imports/initialization
// This error occurs because React Native DevTools tries to call synchronous native methods
// which are not supported when debugging in Chrome. This is harmless and doesn't affect functionality.
if (__DEV__) {
  // Suppress DevTools sync method errors in LogBox (toast notifications)
  LogBox.ignoreLogs([
    'Calling synchronous methods on native modules',
    'getConsolePatchSettings',
    'Consider providing alternative methods to expose this method in debug mode',
    'Invariant Violation: Calling synchronous methods on native modules',
  ]);

  // Suppress console.error for DevTools sync method errors (do this early)
  if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('Calling synchronous methods on native modules') ||
         message.includes('getConsolePatchSettings') ||
         message.includes('Consider providing alternative methods to expose this method in debug mode'))
      ) {
        // This error is expected in Chrome debugger and can be safely ignored
        return;
      }
      originalError.apply(console, args);
    };
  }

  if (typeof window !== 'undefined') {
    // Set up global error handler to suppress DevTools sync method errors
    // ErrorUtils is a global in React Native (not imported)
    if (typeof ErrorUtils !== 'undefined' && ErrorUtils.setGlobalHandler) {
      const originalGlobalHandler = ErrorUtils.getGlobalHandler ? ErrorUtils.getGlobalHandler() : null;
      
      ErrorUtils.setGlobalHandler((error, isFatal) => {
        const errorMessage = error?.message || '';
        const errorStack = error?.stack || '';
        
        // Check if this is the DevTools sync method error
        if (
          errorMessage.includes('Calling synchronous methods on native modules') ||
          errorMessage.includes('getConsolePatchSettings') ||
          errorStack.includes('getConsolePatchSettings') ||
          errorMessage.includes('Consider providing alternative methods to expose this method in debug mode')
        ) {
          // Silently ignore this error - it's expected in Chrome debugger
          return;
        }
        
        // Call original handler for all other errors
        if (originalGlobalHandler) {
          originalGlobalHandler(error, isFatal);
        }
      });
    }

    // Patch MessageQueue to handle sync native calls gracefully in Chrome debugger
    try {
      const {MessageQueue} = require('react-native/Libraries/BatchedBridge/MessageQueue');
      if (MessageQueue && MessageQueue.prototype) {
        const originalCallNativeSyncHook = MessageQueue.prototype.callNativeSyncHook;
        
        MessageQueue.prototype.callNativeSyncHook = function(...args) {
          try {
            return originalCallNativeSyncHook.apply(this, args);
          } catch (error) {
            // Suppress sync native method errors in Chrome debugger
            const errorMessage = error?.message || '';
            if (
              errorMessage.includes('Calling synchronous methods on native modules') ||
              errorMessage.includes('getConsolePatchSettings')
            ) {
              // Return undefined for sync calls that fail in Chrome debugger
              return undefined;
            }
            throw error;
          }
        };
      }
    } catch (patchError) {
      // MessageQueue patch is optional - continue without it
    }
  }
}

AppRegistry.registerComponent(appName, () => App);

