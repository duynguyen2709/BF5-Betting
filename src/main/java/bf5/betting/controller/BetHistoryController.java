package bf5.betting.controller;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

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
                                                 @RequestParam(name = "date", required = false) String date) {
        if (StringUtils.isNotBlank(playerId) &&
                StringUtils.isNotBlank(date))
            return BaseResponse.success(betHistoryService.getByPlayerIdAndDate(playerId, date));

        if (StringUtils.isNotBlank(playerId))
            return BaseResponse.success(betHistoryService.getByPlayerId(playerId));

        return BaseResponse.success(betHistoryService.getAllBetHistory());
    }

    @GetMapping("/{id}")
    public BaseResponse<BetHistory> getById(@PathVariable("id") int betId) {
        return BaseResponse.success(betHistoryService.getByBetId(betId));
    }

    @PutMapping("/{id}/result")
    public BaseResponse<BetHistory> updateResult(@PathVariable("id") int betId, @RequestBody BetHistoryUpdateResultRequest request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateBetResult(request));
    }
}
