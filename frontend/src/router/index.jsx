import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/Navigation/AppShell';
import { ProtectedRoute, PublicRoute } from './guards';

import { LandingPage } from '@/pages/landing/LandingPage';
import { HomePage } from '@/Home/HomePage';
import { GeneratePage } from '@/pages/generate/GeneratePage';
import { DocumentsPage } from '@/pages/documents/DocumentsPage';
import { DocumentDetailPage } from '@/pages/documents/DocumentDetailPage';
import { TemplatesPage } from '@/pages/templates/TemplatesPage';
import { OrganizationPage } from '@/pages/organization/OrganizationPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { BatchPage } from '@/pages/batch/BatchPage';
import { VerifyPage } from '@/pages/verify/VerifyPage';
import { LoginPage } from '@/Login/loginPage';
import { RegisterPage } from '@/Register/registerPage';
import { AgentStudioPage } from '@/pages/agents/AgentStudioPage';
import { WorkflowBuilderPage } from '@/pages/workflows/WorkflowBuilderPage';



const router = createBrowserRouter([
  // Always Public - Verification
  {
    path: '/verify/:verificationId',
    element: <VerifyPage />,
  },

  // Public Landing Page (always accessible)
  {
    path: '/',
    element: <LandingPage />,
  },

  // Auth Routes (Only accessible when NOT logged in)
  {
    element: <PublicRoute />,
    children: [
      { path: '/auth/login', element: <LoginPage /> },
      { path: '/auth/register', element: <RegisterPage /> },
    ],
  },

  // Protected App Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <HomePage /> },
          { path: '/agents', element: <AgentStudioPage /> },
          { path: '/workflows', element: <WorkflowBuilderPage /> },

          {
            path: '/generate',
            element: <ProtectedRoute requiredPermission="generate:docs" />,
            children: [{ index: true, element: <GeneratePage /> }],
          },

          {
            path: '/documents',
            element: <ProtectedRoute requiredPermission="view:docs" />,
            children: [
              { index: true, element: <DocumentsPage /> },
              { path: ':documentId', element: <DocumentDetailPage /> },
            ],
          },

          {
            path: '/templates',
            element: <ProtectedRoute requiredPermission="manage:templates" />,
            children: [{ index: true, element: <TemplatesPage /> }],
          },

          { path: '/batch', element: <BatchPage /> },

          {
            path: '/organization',
            element: <ProtectedRoute requiredPermission="manage:org" />,
            children: [{ index: true, element: <OrganizationPage /> }],
          },

          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}