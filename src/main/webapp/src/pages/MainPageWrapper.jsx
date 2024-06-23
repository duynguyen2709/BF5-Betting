import { UNLOCK_DATA_KEY } from "../common/Constant";
import UnlockPage from "./UnlockPage";
import HistoryPage from "./HistoryPage";
import { useState } from "react";

export default function MainPageWrapper() {
  const [unlockedUserId, setUnlockedUserId] = useState(
    localStorage.getItem(UNLOCK_DATA_KEY)
  );

  if (!unlockedUserId) {
    return <UnlockPage onUnlock={setUnlockedUserId} />;
  }
  return <HistoryPage />;
}
