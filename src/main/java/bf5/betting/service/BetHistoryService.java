package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface BetHistoryService {

    List<BetHistory> getAllBetHistory();
}
