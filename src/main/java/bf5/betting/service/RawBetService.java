package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.response.GetRawBetResponse;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface RawBetService {

    List<GetRawBetResponse.RawBetEntity> getAllBet(String sessionToken, String startDate, String endDate);
    List<BetHistory> getAllBetWithConvert(String sessionToken, String startDate, String endDate);
}
