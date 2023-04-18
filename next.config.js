module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          // Add any additional objects that might be causing issues
          // For example: "fs": false
          "window": false,
        };
      }
      return config;
    },
  };
  