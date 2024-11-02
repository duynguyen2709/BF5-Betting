package bf5.betting.service;

import bf5.betting.entity.jpa.PlayerAssetHistory;
import bf5.betting.entity.response.BetHistoryStatisticResponse;
import java.util.List;

/**
 * @author duynguyen
 **/
public interface StatisticService {

  List<BetHistoryStatisticResponse.AssetByDate> statisticAssetByDate(
      List<PlayerAssetHistory> assetHistories);

  void runStatisticForDateRange(String startDateStr, String endDateStr);
}
