export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  USER = 'USER'
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.OWNER]: 5,
  [Role.ADMIN]: 4,
  [Role.MANAGER]: 3,
  [Role.ANALYST]: 2,
  [Role.USER]: 1,
};

export function hasRole(userRole: string, requiredRole: Role | Role[]): boolean {
  const currentRole = userRole as Role;
  if (!ROLE_HIERARCHY[currentRole]) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.some(r => ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[r]);
  }
  return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[requiredRole];
}
