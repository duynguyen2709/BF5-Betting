import "antd/dist/reset.css";
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import { lazy, Suspense } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import MainPageWrapper from '@/pages/MainPageWrapper'
import { Spin } from 'antd'
import MainLayout from './layout/MainLayout'
import colorPalette from "./utils/colorPalette";

const NotFound = lazy(() => import('@/pages/NotFoundPage/NotFound'))

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spin size='large' className='global-spinner' />}>
    <Component />
  </Suspense>
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000
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
          <MainLayout>
          <RouterProvider router={router} />
          </MainLayout>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
