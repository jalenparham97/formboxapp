/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes = ["/api/webhooks/stripe", "/success", "/error"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes = ["/auth/login"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";
/**
 * The prefix for API job routes
 * Routes that start with this prefix are used for qstash/upstash job processing
 */
export const apiJobsPrefix = "/api/jobs";

/**
 * The prefix for TRPC routes
 * Routes that start with this prefix are used for TRPC purposes
 */
export const trpcPrefix = "/api/trpc";
