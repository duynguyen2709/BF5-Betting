package bf5.betting.controller;

import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/bets")
@AllArgsConstructor
public class BetHistoryController {
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
        return BaseResponse.success(sortByStatusAndBetTimeDesc(betHistoryList));
    }

    private List<BetHistory> sortByStatusAndBetTimeDesc(List<BetHistory> betHistoryList) {
        List<BetHistory> unfinishedBets = new ArrayList<>();
        List<BetHistory> finishedBets = new ArrayList<>();
        betHistoryList.forEach(betHistory -> {
            if (betHistory.getResult() == BetResult.NOT_FINISHED) {
                unfinishedBets.add(betHistory);
            } else {
                finishedBets.add(betHistory);
            }
        });

        Comparator<BetHistory> betHistoryComparator = (bet1, bet2) -> {
            if (bet2.getBetTimeMs() != bet1.getBetTimeMs()) {
                return Long.compare(bet2.getBetTimeMs(), bet1.getBetTimeMs());
            }
            return Long.compare(bet2.getBetId(), bet1.getBetId());
        };

        unfinishedBets.sort(betHistoryComparator);
        finishedBets.sort(betHistoryComparator);

        List<BetHistory> result = new ArrayList<>(unfinishedBets);
        result.addAll(finishedBets);
        return result;
    }

    @PostMapping("")
    public BaseResponse<BetHistory> create(@RequestBody BetHistory request) {
        return BaseResponse.success(betHistoryService.createBet(request));
    }

    @PutMapping("/{betId}/result")
    public BaseResponse<BetHistory> updateResult(@PathVariable("betId") long betId, @RequestBody BetHistory request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateBetResult(request));
    }
}
