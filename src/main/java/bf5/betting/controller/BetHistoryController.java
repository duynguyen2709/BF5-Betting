package bf5.betting.controller;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
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

    private final BetHistoryService betHistoryService;

    @GetMapping("")
    public BaseResponse<List<BetHistory>> getAll(@RequestParam(name = "playerId", required = false) String playerId,
                                                 @RequestParam(name = "date", required = false) String date) {
        List<BetHistory> betHistoryList;
        if (StringUtils.isNotBlank(playerId) && StringUtils.isNotBlank(date))
            betHistoryList = betHistoryService.getByPlayerIdAndDate(playerId, date);
        else if (StringUtils.isNotBlank(playerId))
            betHistoryList = betHistoryService.getByPlayerId(playerId);
        else
            betHistoryList = betHistoryService.getAllBetHistory();

        return BaseResponse.success(sortByBetTimeDesc(betHistoryList));
    }

    private List<BetHistory> sortByBetTimeDesc(List<BetHistory> betHistoryList) {
        return betHistoryList.stream()
                .sorted((bet1, bet2) -> Long.compare(bet2.getBetTimeMs(), bet1.getBetTimeMs()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BaseResponse<BetHistory> getById(@PathVariable("id") int betId) {
        return BaseResponse.success(betHistoryService.getByBetId(betId));
    }

    @PostMapping("")
    public BaseResponse<BetHistory> create(@RequestBody BetHistory request) {
        return BaseResponse.success(betHistoryService.createBet(request));
    }

    @PutMapping("/{betId}/result")
    public BaseResponse<BetHistory> updateResult(@PathVariable("betId") int betId, @RequestBody BetHistoryUpdateResultRequest request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateBetResult(request));
    }
}
