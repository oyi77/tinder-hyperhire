const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // Block debugger worker files from being resolved
    blockList: [
      /.*[\/\\]debugger-ui[\/\\]debuggerWorker\..*$/,
      /.*debuggerWorker.*/,
    ],
    // Custom resolver to handle debugger worker files gracefully
    resolveRequest: (context, moduleName, platform) => {
      // If trying to resolve debugger worker, return empty module
      if (
        moduleName && 
        typeof moduleName === 'string' && 
        (moduleName.includes('debuggerWorker') || moduleName.includes('debugger-ui'))
      ) {
        return {
          type: 'empty',
        };
      }
      // Use default resolver for everything else
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);

