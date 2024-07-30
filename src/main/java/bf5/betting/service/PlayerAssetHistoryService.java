package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.PlayerAssetHistory;
import bf5.betting.entity.request.AddPlayerAssetHistoryRequest;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * @author duynguyen
 **/
public interface PlayerAssetHistoryService {
    List<PlayerAssetHistory> insertBatch(Collection<PlayerAssetHistory> list);

    PlayerAssetHistory updateAssetFromBetHistory(BetHistory betHistory);

    List<PlayerAssetHistory> updateAssetFromBetHistoryListInBatch(List<BetHistory> betHistories);

    List<PlayerAssetHistory> getAll();

    List<PlayerAssetHistory> getByPlayerIdAndDateRange(String playerId, String startDateStr, String endDateStr);

    Map<String, PlayerAssetHistory> getNearestAssetHistoryForPlayers(String date);

    void deleteByDateRange(String startDateStr, String endDateStr);

    PlayerAssetHistory insertPaymentHistory(AddPlayerAssetHistoryRequest request);
}
