import './App.css'
import { Button } from '@/components/ui/button.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Button>Click me</Button>
    </QueryClientProvider>
  )
}
