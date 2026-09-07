/**
 * Role-Based Access Control (RBAC) Module
 * Defines roles, allowed route prefixes, and permission validation utilities.
 */

export type UserRole = 'student' | 'industry' | 'institution' | 'academician';

export const USER_ROLES: readonly UserRole[] = [
  'student',
  'industry',
  'institution',
  'academician',
] as const;

export interface RoleConfig {
  label: string;
  defaultDashboard: string;
  allowedPrefixes: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  student: {
    label: 'Student',
    defaultDashboard: '/student/dashboard',
    allowedPrefixes: ['/student', '/portfolio'],
  },
  academician: {
    label: 'Academician',
    defaultDashboard: '/academician/dashboard',
    allowedPrefixes: ['/academician'],
  },
  industry: {
    label: 'Industry Partner',
    defaultDashboard: '/industry/dashboard',
    allowedPrefixes: ['/industry'],
  },
  institution: {
    label: 'Institution Admin',
    defaultDashboard: '/institution/dashboard',
    allowedPrefixes: ['/institution'],
  },
};

/**
 * Public routes that do not require authentication or specific role permission.
 */
export const PUBLIC_ROUTES: readonly string[] = [
  '/',
  '/demo',
  '/login',
  '/signup',
  '/api',
  '/portfolio',
] as const;

/**
 * Checks if a pathname matches a public route.
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

/**
 * Validates whether a given role is allowed to access a given URL path.
 */
export function isAuthorizedForRoute(role: UserRole | string, pathname: string): boolean {
  if (!role || !(role in ROLE_CONFIGS)) return false;
  
  const config = ROLE_CONFIGS[role as UserRole];
  return config.allowedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

/**
 * Returns the appropriate dashboard redirect path for a given role.
 */
export function getRedirectForRole(role: UserRole | string): string {
  if (role in ROLE_CONFIGS) {
    return ROLE_CONFIGS[role as UserRole].defaultDashboard;
  }
  return '/demo';
}
