import React from 'react';
import { useUIStore } from '../store';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Pages
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { Datasets } from '../pages/datasets/Datasets';
import { Eda } from '../pages/eda/Eda';
import { Models } from '../pages/models/Models';
import { Reports } from '../pages/reports/Reports';
import { Settings } from '../pages/settings/Settings';
import { AICopilot } from '../pages/copilot/AICopilot';
import { DashboardBuilder } from '../pages/dashboardbuilder/DashboardBuilder';
import { WorkspacePage } from '../pages/workspace/WorkspacePage';
import { ProjectPage } from '../pages/project/ProjectPage';

// ETL Pages
import { ETLDashboard } from '../pages/etl/ETLDashboard';
import { PipelineBuilder } from '../pages/etl/PipelineBuilder';
import { DataCleaning } from '../pages/etl/DataCleaning';
import { FeatureEngineering } from '../pages/etl/FeatureEngineering';

// Auth & Admin Protection Pages
import { AccessDenied } from '../pages/auth/AccessDenied';
import { UserManagement } from '../pages/auth/UserManagement';
import { AnalyticsConfig } from '../pages/auth/AnalyticsConfig';
import { PendingApprovalScreen } from '../pages/auth/PendingApproval';

export const AppRouter: React.FC = () => {
  const { currentView, isLoggedIn, userRole, userStatus, userApproved, userActive } = useUIStore();

  const isViewAllowed = (view: string) => {
    if (userRole === 'OWNER' || userRole === 'SUPER_ADMIN') {
      return true;
    }
    if (userRole === 'ADMIN') {
      return true;
    }

    // Only Billing, User Management, Role Management, Owner Settings, Firebase Configuration, System Configuration remain restricted.
    // user-management represents User & Role management, so it is restricted.
    const restrictedViews = ['user-management'];
    if (restrictedViews.includes(view)) {
      return false;
    }

    if (userRole === 'ANALYST') {
      return true;
    }

    if (userRole === 'USER') {
      const allowedViews = [
        'landing',
        'login',
        'register',
        'forgot-password',
        'dashboard',
        'predictions',
        'reports',
        'dashboardbuilder'
      ];
      return allowedViews.includes(view);
    }

    return true;
  };

  const renderView = () => {
    // Intercept and force pending approval screen for non-approved users
    if (isLoggedIn) {
      if (userStatus !== 'APPROVED' || !userApproved || !userActive) {
        return <PendingApprovalScreen />;
      }
    }

    // If the view is restricted and user is not an ADMIN, display AccessDenied page inside AppLayout
    if (!isViewAllowed(currentView)) {
      return (
        <AppLayout>
          <AccessDenied />
        </AppLayout>
      );
    }

    switch (currentView) {
      case 'landing':
      case 'login':
        return (
          <AuthLayout>
            <Login />
          </AuthLayout>
        );
      case 'register':
        return (
          <AuthLayout>
            <Register />
          </AuthLayout>
        );
      case 'forgot-password':
        return (
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        );
      case 'workspace':
        return (
          <AppLayout>
            <WorkspacePage />
          </AppLayout>
        );
      case 'create-project':
        return (
          <AppLayout>
            <ProjectPage />
          </AppLayout>
        );
      case 'dashboard':
        return (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        );
      case 'datasets':
        return (
          <AppLayout>
            <Datasets />
          </AppLayout>
        );
      case 'etl-dashboard':
        return (
          <AppLayout>
            <ETLDashboard />
          </AppLayout>
        );
      case 'pipeline-builder':
        return (
          <AppLayout>
            <PipelineBuilder />
          </AppLayout>
        );
      case 'data-cleaning':
        return (
          <AppLayout>
            <DataCleaning />
          </AppLayout>
        );
      case 'feature-engineering':
        return (
          <AppLayout>
            <FeatureEngineering />
          </AppLayout>
        );
      case 'eda':
        return (
          <AppLayout>
            <Eda />
          </AppLayout>
        );
      case 'train-model':
      case 'evaluate-model':
      case 'predictions':
      case 'models':
        return (
          <AppLayout>
            <Models />
          </AppLayout>
        );
      case 'reports':
        return (
          <AppLayout>
            <Reports />
          </AppLayout>
        );
      case 'copilot':
        return (
          <AppLayout>
            <AICopilot />
          </AppLayout>
        );
      case 'settings':
        return (
          <AppLayout>
            <Settings />
          </AppLayout>
        );
      case 'user-management':
        return (
          <AppLayout>
            <UserManagement />
          </AppLayout>
        );
      case 'analytics-config':
        return (
          <AppLayout>
            <AnalyticsConfig />
          </AppLayout>
        );
      case 'dashboardbuilder':
        return (
          <AppLayout>
            <DashboardBuilder />
          </AppLayout>
        );
      default:
        if (isLoggedIn) {
          return (
            <AppLayout>
              <Dashboard />
            </AppLayout>
          );
        }
        return (
          <AuthLayout>
            <Login />
          </AuthLayout>
        );
    }
  };

  return <>{renderView()}</>;
};
