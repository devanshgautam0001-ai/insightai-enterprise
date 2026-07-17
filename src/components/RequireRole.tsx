import React from 'react';
import { useUIStore } from '../store';
import { Role, hasRole } from '../lib/roles.ts';

interface RequireRoleProps {
  role: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  children,
  fallback = null
}) => {
  const { userRole, isLoggedIn } = useUIStore();

  if (!isLoggedIn || !userRole) {
    return <>{fallback}</>;
  }

  const allowed = hasRole(userRole, role);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
