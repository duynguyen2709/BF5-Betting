import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button, ConfigProvider } from 'antd'

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

const apiUrl = import.meta.env.VITE_API_URL

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '#00b96b',
            borderRadius: 8,

            // Alias Token
            colorBgContainer: '#f6ffed'
          }
        }}
      >
        <Button type='primary'>Button</Button>
        <p>API URL: {apiUrl}</p>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
