package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;
import java.util.List;

/**
 * @author duynguyen
 **/
public interface TelegramNotiService {

  void sendNotificationForNewBetAdded(String userId, List<BetHistory> betHistoryList);

  void sendNotiForBetResultUpdated(List<BetHistory> betHistoryList);

  void sendExceptionAlert(String error);
}
