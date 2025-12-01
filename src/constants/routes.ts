export const ROUTES = {
  HOME: '/',
  TEAPOT_DEMO: '/teapot-demo',
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = typeof ROUTES[RouteKey]
