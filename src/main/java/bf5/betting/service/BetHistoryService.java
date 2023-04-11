package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface BetHistoryService {
    List<BetHistory> getAllBetHistory();

    List<BetHistory> getByPlayerIdAndDateRange(String playerId, String startDate, String endDate);

    BetHistory insertBet(BetHistory entity);

    List<BetHistory> insertBetInBatch(List<BetHistory> request);

    BetHistory updateBetResult(BetHistory request);

    BetHistory updateBetResultFromRaw(BetHistory request);

    List<BetHistory> updateBatchBetResultFromRaw(List<BetHistory> request);
}
