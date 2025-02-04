import { STORAGE_KEYS } from '@/constants'
import { useState } from 'react'
import HistoryPage from './HistoryPage/HistoryPage'
import UnlockPage from './UnlockPage/UnlockPage'

function MainPageWrapper() {
  const [unlockedUserId, setUnlockedUserId] = useState<string | null>(localStorage.getItem(STORAGE_KEYS.UNLOCK_DATA))
  const handleUnlock = (userId: string) => {
    localStorage.setItem(STORAGE_KEYS.UNLOCK_DATA, userId)
    setUnlockedUserId(userId)
  }

  if (!unlockedUserId) {
    return <UnlockPage onUnlock={handleUnlock} />
  }

  return <HistoryPage />
}

export default MainPageWrapper
