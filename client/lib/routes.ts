/**
 * Centralized route path table for React Router.
 * Add a new entry here whenever a new route is wired up in App.tsx.
 */
export const ROUTES = {
  HOME: "/",
  ADMIN: "/admin",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
