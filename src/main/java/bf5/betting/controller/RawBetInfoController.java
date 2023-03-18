package bf5.betting.controller;

import bf5.betting.entity.response.BaseResponse;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.service.RawBetService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/raw-bets")
@AllArgsConstructor
public class RawBetInfoController {

    private final RawBetService rawBetService;

    @GetMapping("")
    BaseResponse<List<GetRawBetResponse.RawBetEntity>> getAll(@RequestParam("sessionToken") String sessionToken,
                                                              @RequestParam("startDate") String startDate,
                                                              @RequestParam("endDate") String endDate) {
        return BaseResponse.success(rawBetService.getAllBet(sessionToken, startDate, endDate));
    }
}
