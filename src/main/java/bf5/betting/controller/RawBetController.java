package bf5.betting.controller;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/bets/raw")
@AllArgsConstructor
public class RawBetController {
    private final RawBetService rawBetService;
    private final BetHistoryService betHistoryService;

    @GetMapping("")
    BaseResponse<List<BetHistory>> getRawBetInfo(@RequestParam(value = "sessionToken", required = false) String sessionToken,
                                                 @RequestParam("startDate") String startDate,
                                                 @RequestParam("endDate") String endDate) {
        return BaseResponse.success(rawBetService.getAllBetWithConvert(sessionToken, startDate, endDate));
    }

    @PutMapping("/{betId}/result")
    public BaseResponse<BetHistory> updateResultFromRaw(@PathVariable("betId") long betId, @RequestBody BetHistory request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateBetResultFromRaw(request));
    }

    @PutMapping("/result/batch")
    public BaseResponse<List<BetHistory>> updateBatchResultFromRaw(@RequestBody List<BetHistory> request) {
        return BaseResponse.success(betHistoryService.updateBatchBetResultFromRaw(request));
    }
}
