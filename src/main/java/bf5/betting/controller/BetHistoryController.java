package bf5.betting.controller;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.BetHistoryService;
import lombok.AllArgsConstructor;
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
    public List<BetHistory> getAll() {
        return betHistoryService.getAllBetHistory();
    }

    @PutMapping("/{id}/result")
    public BaseResponse<BetHistory> updateResult(@PathVariable("id") int betId, @RequestBody BetHistoryUpdateResultRequest request) {
        request.setBetId(betId);
        return BaseResponse.success(betHistoryService.updateResult(request));
    }
}
