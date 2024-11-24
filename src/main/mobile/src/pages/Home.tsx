import React, { useEffect, useState } from 'react'
import { IonContent, IonPage } from '@ionic/react'
import './Home.css'
import UserMainPage from '@/pages/UserMainPage'
import ionicStorage from '@/store/ionicStorage'
import { UNLOCK_DATA_KEY } from '@/common/Constant'
import UnlockPage from '@/pages/UnlockPage'

const Home: React.FC = () => {
  const [unlockedUserId, setUnlockedUserId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const userId = await ionicStorage.get(UNLOCK_DATA_KEY)
      setUnlockedUserId(userId)
    })()
  }, [])

  const handleUnlock = async (userId: string) => {
    await ionicStorage.set(UNLOCK_DATA_KEY, userId)
    setUnlockedUserId(userId)
  }
  return (
    <IonPage id='home-page'>
      <IonContent fullscreen>
        {unlockedUserId ? <UserMainPage /> : <UnlockPage onUnlockSuccess={handleUnlock} />}
      </IonContent>
    </IonPage>
  )
}

export default Home
