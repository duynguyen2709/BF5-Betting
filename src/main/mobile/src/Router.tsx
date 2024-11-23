import { IonRouterOutlet } from '@ionic/react'
import { Redirect, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import ViewMessage from '@/pages/ViewMessage'
import { IonReactRouter } from '@ionic/react-router'
import React from 'react'

export default function Router() {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path='/' exact={true}>
          <Redirect to='/home' />
        </Route>
        <Route path='/home' exact={true}>
          <Home />
        </Route>
        <Route path='/admin'>
          <ViewMessage />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}
