package bf5.betting.controller;

import bf5.betting.constant.UserAction;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.PlayerAssetHistory;
import bf5.betting.entity.request.AddPlayerAssetHistoryRequest;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.entity.response.BetHistoryStatisticResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.PlayerAssetHistoryService;
import bf5.betting.service.StatisticService;
import bf5.betting.util.RequestUtil;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/statistics")
@AllArgsConstructor
public class StatisticController {

  private final PlayerAssetHistoryService assetHistoryService;
  private final BetHistoryService betHistoryService;
  private final StatisticService statisticService;

  @GetMapping("")
  public BaseResponse<List<PlayerAssetHistory>> getAll() {
    List<PlayerAssetHistory> assetHistories = assetHistoryService.getAll();
    assetHistories.sort((o1, o2) -> {
      long firstPaymentTime = o1.getRawPaymentTime()
                                .getTime();
      long secondPaymentTime = o2.getRawPaymentTime()
                                 .getTime();
      if (firstPaymentTime != secondPaymentTime) {
        return Long.compare(secondPaymentTime, firstPaymentTime);
      }
      return Integer.compare(o2.getId(), o1.getId());
    });
    return BaseResponse.success(assetHistories);
  }

  @GetMapping("/detail")
  public BaseResponse<BetHistoryStatisticResponse> getDetailedStatistics(
      @RequestParam(name = "playerId") String playerId,
      @RequestParam(name = "startDate") String startDate,
      @RequestParam(name = "endDate") String endDate,
      HttpServletRequest request) {
    try {
      List<BetHistory> betHistories = this.betHistoryService.getByPlayerIdAndDateRange(playerId,
                                                                                       startDate, endDate);
      List<PlayerAssetHistory> assetHistories = this.assetHistoryService.getByPlayerIdAndDateRange(
          playerId, startDate, endDate);
      List<BetHistoryStatisticResponse.AssetByDate> assetByDateList = this.statisticService.statisticAssetByDate(
          assetHistories);

      BetHistoryStatisticResponse response = BetHistoryStatisticResponse.builder()
                                                                        .playerId(playerId)
                                                                        .startDate(startDate)
                                                                        .endDate(endDate)
                                                                        .betHistoryList(betHistories)
                                                                        .assetByDateList(assetByDateList)
                                                                        .build();
      return BaseResponse.success(response);
    } finally {
      RequestUtil.logUserAction(request,
                                UserAction.VIEW_STATISTIC,
                                Map.of("playerId", playerId, "startDate", startDate, "endDate", endDate)
                               );
    }
  }

  @PostMapping("")
  public BaseResponse statisticByDateRange(@RequestParam(name = "startDate") String startDate,
      @RequestParam(name = "endDate") String endDate,
      @RequestParam(name = "action") String action) {
    if ("delete".equalsIgnoreCase(action)) {
      this.assetHistoryService.deleteByDateRange(startDate, endDate);
    } else if ("statistic".equalsIgnoreCase(action)) {
      this.statisticService.runStatisticForDateRange(startDate, endDate);
    }
    return BaseResponse.SUCCESS;
  }

  @PostMapping("/asset")
  public BaseResponse<PlayerAssetHistory> insert(
      @RequestBody AddPlayerAssetHistoryRequest request) {
    return BaseResponse.success(assetHistoryService.insertPaymentHistory(request));
  }
}
