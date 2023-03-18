package bf5.betting.service;

import bf5.betting.entity.response.GetRawBetResponse;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface RawBetService {

    List<GetRawBetResponse.RawBetEntity> getAllBet(String sessionToken, String dateFrom, String dateTo);
}
