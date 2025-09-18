// Preload.js - Request permissions for protected environments based on user actions

// Generic permission request function
const requestPermissions = async (endpoints) => {
  try {
    // Make lightweight HEAD requests to establish permissions
    const permissionRequests = endpoints.map(async (endpoint) => {
      try {
        // Use a very lightweight request that should be allowed by CORS
        await fetch(endpoint, {
          method: 'HEAD',
          mode: 'no-cors', // This allows the request even if CORS isn't set up
          cache: 'no-store',
          referrerPolicy: 'no-referrer',
        });
      } catch (error) {
        // Silently ignore failures - we just want to establish permissions
        console.debug(`Permission request failed for ${endpoint}:`, error.message);
      }
    });

    // Wait for all permission requests to complete (or fail)
    await Promise.allSettled(permissionRequests);
    
    console.debug('Permission requests completed for:', endpoints);
    
  } catch (error) {
    console.warn('Failed to request permissions:', error);
    // Don't throw - this is just a best-effort preload
  }
};

// Preload Replicate-related endpoints after API key is provided
export const preloadReplicatePermissions = async () => {
  const replicateEndpoints = [
    'https://replicate.delivery/',
    
    // Proxy endpoints (if available)
    ...(window.REPLICATE_PROXY_URL ? [
      `${window.REPLICATE_PROXY_URL}/api/replicate`
    ] : []),
  ];

  await requestPermissions(replicateEndpoints);
};

// Preload Subscribe.dev endpoints after user signs in
export const preloadSubscribeDevPermissions = async () => {
  const subscribeDevEndpoints = [
    'https://api.subscribe.dev/v1/users/profile',
    'https://images.subscribe.dev/uploads/',
    'https://img.clerk.com',
  ];

  await requestPermissions(subscribeDevEndpoints);
};