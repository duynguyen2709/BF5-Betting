package bf5.betting.controller;

import static bf5.betting.util.BetHistoryUtil.sortByStatusAndBetTimeDesc;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/bets/raw")
@AllArgsConstructor
@Log4j2
public class RawBetController {

  private final RawBetService rawBetService;
  private final BetHistoryService betHistoryService;

  @GetMapping("")
  BaseResponse<List<BetHistory>> getRawBetInfo(
      @RequestParam(value = "sessionToken", required = false) String sessionToken,
      @RequestParam("startDate") String startDate,
      @RequestParam("endDate") String endDate) {
    List<BetHistory> betHistories = rawBetService.getAllBetWithConvert(sessionToken, startDate,
                                                                       endDate);
    return BaseResponse.success(sortByStatusAndBetTimeDesc(betHistories));
  }

  @GetMapping("/quick")
  BaseResponse<List<BetHistory>> getQuickRawBets(
      @RequestParam(value = "sessionToken", required = false) String sessionToken) {
    List<BetHistory> betHistories = rawBetService.quickGetLast30MinutesBets(sessionToken);
    return BaseResponse.success(sortByStatusAndBetTimeDesc(betHistories));
  }

  @PutMapping("/{betId}/result")
  public BaseResponse<BetHistory> updateResultFromRaw(@PathVariable("betId") long betId,
      @RequestBody BetHistory request) {
    request.setBetId(betId);
    return BaseResponse.success(betHistoryService.updateBetResultFromRaw(request));
  }

  @PutMapping("/result/batch")
  public BaseResponse<List<BetHistory>> updateBatchResultFromRaw(
      @RequestBody List<BetHistory> request) {
    return BaseResponse.success(betHistoryService.updateBatchBetResultFromRaw(request));
  }
}
