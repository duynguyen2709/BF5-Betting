package bf5.betting.service;

import bf5.betting.entity.jpa.PlayerAssetHistory;

import java.util.Collection;
import java.util.List;

/**
 * @author duynguyen
 **/
public interface PlayerAssetHistoryService {
    PlayerAssetHistory insert(PlayerAssetHistory data);

    List<PlayerAssetHistory> insertBatch(Collection<PlayerAssetHistory> list);

    List<PlayerAssetHistory> getAll();

    List<PlayerAssetHistory> getByPlayerIdAndDateRange(String playerId, String startDateStr, String endDateStr);
}
