import ErrorBoundary from '@/components/ErrorBoundary';
import MainPageWrapper from '@/pages/MainPageWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Spin } from 'antd';
import "antd/dist/reset.css";
import viVN from 'antd/locale/vi_VN';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import colorPalette from "./utils/colorPalette";
import { usePlayerQuery } from './hooks/usePlayerQuery';

const NotFound = lazy(() => import('@/pages/NotFoundPage/NotFound'))

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spin size='large' className='global-spinner' />}>
    <Component />
  </Suspense>
)

const DEFAULT_STALE_TIME = 3 * 60 * 1000;
const DEFAULT_GC_TIME = 5 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_GC_TIME
    }
  }
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPageWrapper />
  },
  {
    path: '*',
    element: withSuspense(NotFound)
  }
])

const AppInitializer = () => {
  usePlayerQuery()
  return null
}

function App(): JSX.Element {  
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
          borderRadius: 8,
          colorBgContainer: colorPalette.background.default,
          colorSuccess: colorPalette.semantic.success.main,
          colorWarning: colorPalette.semantic.warning.main,
          colorError: colorPalette.semantic.error.main,
          colorInfo: colorPalette.semantic.info.main,
        
            }
          }}
        >
          <AppInitializer />
          <MainLayout>
          <RouterProvider router={router} />
          </MainLayout>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
