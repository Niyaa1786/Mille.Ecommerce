import 'vue-router'
export {}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    layout: 'auth' | 'admin'
  }
}
