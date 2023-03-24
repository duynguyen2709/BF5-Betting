package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface BetHistoryService {
    List<BetHistory> getAllBetHistory();
    List<BetHistory> getByPlayerId(String playerId);
    List<BetHistory> getByPlayerIdAndDateRange(String playerId, String startDate, String endDate);
    BetHistory createBet(BetHistory entity);
    BetHistory updateBetResult(BetHistoryUpdateResultRequest request);
    BetHistory updateBetResultFromRaw(BetHistoryUpdateResultRequest request);
    List<BetHistory> updateBatchBetResultFromRaw(List<BetHistoryUpdateResultRequest> request);
}
