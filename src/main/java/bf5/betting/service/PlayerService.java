package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.Player;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * @author duynguyen
 **/
public interface PlayerService {

  Map<String, Player> getAllPlayer();

  Player updatePlayerData(Player player);

  Player updatePlayerProfitFromBetHistory(BetHistory betHistory);

  List<Player> updatePlayerProfitFromListBetHistoryInBatch(List<BetHistory> betHistories);

  List<Player> updatePlayerDataBatch(Collection<Player> players);

  String getPlayerNameById(String id);
}
