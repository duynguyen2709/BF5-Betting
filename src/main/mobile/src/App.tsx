import { IonApp, setupIonicReact } from '@ionic/react'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Theme variables */
import './theme/variables.css'
import React from 'react'
import Router from '@/Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { API_STALE_TIME } from '@/common/Constant'

setupIonicReact()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: API_STALE_TIME,
      gcTime: API_STALE_TIME,
    },
  },
})

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <Router />
    </IonApp>
  </QueryClientProvider>
)

export default App
