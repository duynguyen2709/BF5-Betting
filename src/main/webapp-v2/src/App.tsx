import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Spin } from 'antd';
import viVN from 'antd/locale/vi_VN';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';
import { usePlayerQuery } from '@/hooks/usePlayerQuery';
import MainLayout from '@/layout/MainLayout';
import MainPageWrapper from '@/pages/MainPageWrapper';
import colorPalette from '@/utils/colorPalette';

const NotFound = lazy(() => import('@/pages/NotFoundPage/NotFound'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spin size="large" className="global-spinner" />}>
    <Component />
  </Suspense>
);

const DEFAULT_STALE_TIME = 3 * 60 * 1000;
const DEFAULT_GC_TIME = 5 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attempt: number) => {
        const delay = [2000, 4000][attempt - 1] || 2000;
        return delay;
      },
      refetchOnWindowFocus: false,
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_GC_TIME,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPageWrapper />,
  },
  {
    path: '/admin',
    element: withSuspense(AdminPage),
  },
  {
    path: '*',
    element: withSuspense(NotFound),
  },
]);

function AppInitializer() {
  usePlayerQuery();
  return null;
}

function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          locale={viVN}
          theme={{
            token: {
              colorPrimary: colorPalette.primary.main,
              colorPrimaryHover: colorPalette.primary.light,
              colorPrimaryActive: colorPalette.primary.dark,
              borderRadius: 6,
              colorSuccess: colorPalette.semantic.success.main,
              colorWarning: colorPalette.semantic.warning.main,
              colorError: colorPalette.semantic.error.main,
              colorInfo: colorPalette.semantic.info.main,
            },
          }}
        >
          <AppInitializer />
          <MainLayout>
            <RouterProvider router={router} />
          </MainLayout>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
