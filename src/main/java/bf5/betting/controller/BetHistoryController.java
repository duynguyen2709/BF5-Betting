package bf5.betting.controller;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/bets")
@AllArgsConstructor
public class BetHistoryController {
    private final RawBetService rawBetService;
    private final BetHistoryService betHistoryService;

    @GetMapping("")
    public BaseResponse<List<BetHistory>> getAll(@RequestParam(name = "playerId", required = false) String playerId,
                                                 @RequestParam(name = "startDate", required = false) String startDate,
                                                 @RequestParam(name = "endDate", required = false) String endDate) {
        if (StringUtils.isNotBlank(startDate) && StringUtils.isBlank(endDate)) {
            endDate = startDate;
        } else if (StringUtils.isNotBlank(endDate) && StringUtils.isBlank(startDate)) {
            startDate = endDate;
        }

        List<BetHistory> betHistoryList;
        if (StringUtils.isNotBlank(playerId) && StringUtils.isNotBlank(startDate)) {
            betHistoryList = betHistoryService.getByPlayerIdAndDateRange(playerId, startDate, endDate);
        } else if (StringUtils.isNotBlank(playerId)) {
            // date empty, only userId available
            betHistoryList = betHistoryService.getByPlayerId(playerId);
        } else {
            // no parameter passed, used for history page
            betHistoryList = betHistoryService.getAllBetHistory();
        }
        return BaseResponse.success(sortByBetTimeDesc(betHistoryList));
    }

    private List<BetHistory> sortByBetTimeDesc(List<BetHistory> betHistoryList) {
        return betHistoryList.stream()
                .sorted((bet1, bet2) -> {
                    if (bet2.getBetTimeMs() != bet1.getBetTimeMs()) {
                        return Long.compare(bet2.getBetTimeMs(), bet1.getBetTimeMs());
                    }
                    return Long.compare(bet2.getId(), bet1.getId());
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/raw")
    BaseResponse<List<BetHistory>> getRawBetInfo(@RequestParam("sessionToken") String sessionToken,
                                                 @RequestParam("startDate") String startDate,
                                                 @RequestParam("endDate") String endDate) {
        return BaseResponse.success(rawBetService.getAllBetWithConvert(sessionToken, startDate, endDate));
    }

    @PostMapping("")
    public BaseResponse<BetHistory> create(@RequestBody BetHistory request) {
        return BaseResponse.success(betHistoryService.createBet(request));
    }

    @PutMapping("/{betId}/result")
    public BaseResponse<BetHistory> updateResult(@PathVariable("betId") long betId, @RequestBody BetHistoryUpdateResultRequest request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateBetResult(request));
    }

    @PutMapping("/raw/{betId}/result")
    public BaseResponse<BetHistory> updateResultFromRaw(@PathVariable("betId") long betId, @RequestBody BetHistoryUpdateResultRequest request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateBetResultFromRaw(request));
    }
}
