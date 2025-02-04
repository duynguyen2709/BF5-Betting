import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import AppRoutes from '@/containers/Routes.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    }
  }
})

const overrideTheme = {
  token: {
    colorPrimary: '#00b96b',
    borderRadius: 8,
    colorBgContainer: '#f6ffed'
  }
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={overrideTheme}>
        <AppRoutes />
      </ConfigProvider>
    </QueryClientProvider>
  )
}
