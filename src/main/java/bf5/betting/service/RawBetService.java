package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface RawBetService {
    List<BetHistory> getAllBetWithConvert(String sessionToken, String startDate, String endDate);
}
