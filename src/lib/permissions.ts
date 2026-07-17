import { Role } from './roles.ts';

export enum Permission {
  // Views/Navigation
  VIEW_DASHBOARD = 'view:dashboard',
  VIEW_WORKSPACE = 'view:workspace',
  VIEW_PROJECTS = 'view:projects',
  VIEW_REPORTS = 'view:reports',
  VIEW_PREDICTIONS = 'view:predictions',
  VIEW_COPILOT = 'view:copilot',
  VIEW_SETTINGS = 'view:settings',
  VIEW_USER_MANAGEMENT = 'view:user_management',
  VIEW_ANALYTICS_CONFIG = 'view:analytics_config',

  // Actions
  CREATE_PROJECT = 'create:project',
  DELETE_PROJECT = 'delete:project',
  UPLOAD_DATASET = 'upload:dataset',
  MANAGE_DATASET = 'manage:dataset',
  TRAIN_MODEL = 'train:model',
  FEATURE_ENGINEERING = 'manage:feature_engineering',
  RUN_PIPELINES = 'run:pipelines',
  MANAGE_USERS = 'manage:users',
  DELETE_USERS = 'delete:users',
  MANAGE_ROLES = 'manage:roles',
  MANAGE_ORGANIZATIONS = 'manage:organizations',
  MANAGE_ADMINS = 'manage:admins',
  MANAGE_BILLING = 'manage:billing',
  
  // Database/System
  ACCESS_FIRESTORE = 'access:firestore',
  ACCESS_POSTGRESQL = 'access:postgresql',
  ACCESS_STORAGE = 'access:storage',
  ACCESS_FIREBASE = 'access:firebase',
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.OWNER]: Object.values(Permission), // Full Access
  
  [Role.ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_WORKSPACE,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_PREDICTIONS,
    Permission.VIEW_COPILOT,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_USER_MANAGEMENT,
    Permission.VIEW_ANALYTICS_CONFIG,
    Permission.CREATE_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.UPLOAD_DATASET,
    Permission.MANAGE_DATASET,
    Permission.TRAIN_MODEL,
    Permission.FEATURE_ENGINEERING,
    Permission.RUN_PIPELINES,
    Permission.MANAGE_USERS,
    Permission.DELETE_USERS,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_ORGANIZATIONS,
    Permission.MANAGE_ADMINS,
    Permission.ACCESS_FIRESTORE,
    Permission.ACCESS_POSTGRESQL,
    Permission.ACCESS_STORAGE,
    Permission.ACCESS_FIREBASE,
    // Excludes MANAGE_BILLING
  ],
  
  [Role.MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_WORKSPACE,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_PREDICTIONS,
    Permission.VIEW_COPILOT,
    Permission.CREATE_PROJECT,
    Permission.UPLOAD_DATASET,
    Permission.MANAGE_DATASET,
    Permission.TRAIN_MODEL,
    Permission.RUN_PIPELINES,
    Permission.MANAGE_USERS,
    // Excludes: settings, analytics config, user management, billing, delete project, delete organization, delete users, etc.
  ],
  
  [Role.ANALYST]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_WORKSPACE,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_PREDICTIONS,
    Permission.VIEW_COPILOT,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_ANALYTICS_CONFIG,
    Permission.CREATE_PROJECT,
    Permission.UPLOAD_DATASET,
    Permission.MANAGE_DATASET,
    Permission.TRAIN_MODEL,
    Permission.FEATURE_ENGINEERING,
    Permission.RUN_PIPELINES,
    Permission.ACCESS_FIRESTORE,
    Permission.ACCESS_POSTGRESQL,
    Permission.ACCESS_STORAGE,
  ],
  
  [Role.USER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_WORKSPACE,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_PREDICTIONS,
    Permission.VIEW_COPILOT,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_ANALYTICS_CONFIG,
    Permission.CREATE_PROJECT,
    Permission.UPLOAD_DATASET,
    Permission.MANAGE_DATASET,
    Permission.TRAIN_MODEL,
    Permission.FEATURE_ENGINEERING,
    Permission.RUN_PIPELINES,
    Permission.ACCESS_FIRESTORE,
    Permission.ACCESS_POSTGRESQL,
    Permission.ACCESS_STORAGE,
  ]
};

export function hasPermission(userRole: string, permission: Permission): boolean {
  const currentRole = userRole as Role;
  const permissions = ROLE_PERMISSIONS[currentRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}
