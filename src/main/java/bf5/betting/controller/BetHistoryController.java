package bf5.betting.controller;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.service.BetHistoryService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
