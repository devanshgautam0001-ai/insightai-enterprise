import React from 'react';
import { useUIStore } from '../store';
import { Permission, hasPermission } from '../lib/permissions.ts';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null
}) => {
  const { userRole, isLoggedIn } = useUIStore();

  if (!isLoggedIn || !userRole) {
    return <>{fallback}</>;
  }

  const allowed = hasPermission(userRole, permission);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
