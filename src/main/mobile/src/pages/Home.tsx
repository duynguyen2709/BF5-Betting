import MessageListItem from '../components/MessageListItem'
import React, { useState } from 'react'
import { IonButton, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/react'
import { getMessages, Message } from '@/data/messages'
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react'
import './Home.css'

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])

  useIonViewWillEnter(() => {
    const msgs = getMessages()
    setMessages(msgs)
  })

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete()
    }, 3000)
  }

  return (
    <IonPage id='home-page'>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot='fixed' onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonDatetimeButton datetime='datetime'></IonDatetimeButton>

        <IonModal keepContentsMounted={true}>
          <IonDatetime id='datetime'></IonDatetime>
        </IonModal>

        <IonButton>Default</IonButton>
        <IonButton color='secondary'>Secondary</IonButton>
        <IonButton color='tertiary'>Tertiary</IonButton>
        <IonButton color='success'>Success</IonButton>
        <IonButton color='warning'>Warning</IonButton>
        <IonButton color='danger'>Danger</IonButton>
        <IonButton color='light'>Light</IonButton>
        <IonButton color='medium'>Medium</IonButton>
        <IonButton color='dark'>Dark</IonButton>

        <IonList>
          {messages.map((m) => (
            <MessageListItem key={m.id} message={m} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Home
