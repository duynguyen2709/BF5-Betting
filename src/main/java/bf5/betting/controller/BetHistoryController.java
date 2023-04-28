package bf5.betting.controller;

import bf5.betting.constant.UserAction;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.util.RequestUtil;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import static bf5.betting.util.BetHistoryUtil.sortByStatusAndBetTimeDesc;

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
                                                 @RequestParam(name = "endDate", required = false) String endDate,
                                                 HttpServletRequest request) {
        try {
            List<BetHistory> betHistoryList;
            if (StringUtils.isBlank(playerId)) {
                betHistoryList = this.betHistoryService.getAllBetHistory();
            } else {
                betHistoryList = this.betHistoryService.getByPlayerIdAndDateRange(playerId, startDate, endDate);
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
    public BaseResponse<BetHistory> updateResult(@PathVariable("betId") long betId, @RequestBody BetHistory request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateBetResult(request));
    }
}
