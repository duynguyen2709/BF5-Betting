package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface BetHistoryService {

    List<BetHistory> getAllBetHistory();
    BetHistory updateResult(BetHistoryUpdateResultRequest request);
}
