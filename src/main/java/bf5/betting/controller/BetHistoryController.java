package bf5.betting.controller;

import static bf5.betting.util.BetHistoryUtil.sortByStatusAndBetTimeDesc;

import bf5.betting.constant.UserAction;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.util.RequestUtil;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/bets")
@AllArgsConstructor
public class BetHistoryController {

  private final BetHistoryService betHistoryService;

  @GetMapping("/recent")
  public BaseResponse<Map<String, List<BetHistory>>> getRecentUnfinishedBets() {
    List<BetHistory> betHistoryList = this.betHistoryService.getRecentUnfinishedBets();
    Map<String, List<BetHistory>> betGroupByPlayerId = betHistoryList.stream()
                                                                     .collect(Collectors.groupingBy(
                                                                         BetHistory::getPlayerId));
    return BaseResponse.success(betGroupByPlayerId);
  }


  @GetMapping("")
  public BaseResponse<List<BetHistory>> getAll(
      @RequestParam(name = "playerId", required = false) String playerId,
      @RequestParam(name = "startDate", required = false) String startDate,
      @RequestParam(name = "endDate", required = false) String endDate,
      HttpServletRequest request) {
    try {
      List<BetHistory> betHistoryList;
      if (StringUtils.isBlank(playerId)) {
        betHistoryList = this.betHistoryService.getAllBetHistory();
      } else {
        betHistoryList = this.betHistoryService.getByPlayerIdAndDateRange(playerId, startDate,
                                                                          endDate);
      }
      return BaseResponse.success(sortByStatusAndBetTimeDesc(betHistoryList));
    } finally {
      if (StringUtils.isNotBlank(playerId)) {
        RequestUtil.logUserAction(request,
                                  UserAction.VIEW_HISTORY,
                                  Map.of("playerId", playerId, "startDate", startDate, "endDate", endDate)
                                 );
      }
    }
  }

  @PostMapping("")
  public BaseResponse<BetHistory> insert(@RequestBody BetHistory request) {
    return BaseResponse.success(betHistoryService.insertBet(request));
  }

  @PostMapping("/batch")
  public BaseResponse<List<BetHistory>> insertInBatch(@RequestBody List<BetHistory> request) {
    return BaseResponse.success(betHistoryService.insertBetInBatch(request));
  }

  @PutMapping("/{betId}/result")
  public BaseResponse<BetHistory> updateResult(@PathVariable("betId") long betId,
      @RequestBody BetHistory request) {
    request.setBetId(betId);
    return BaseResponse.success(betHistoryService.updateBetResult(request));
  }
}
