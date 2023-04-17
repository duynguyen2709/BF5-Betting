package bf5.betting.controller;

import bf5.betting.converter.RawBetEntityConverter;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import bf5.betting.util.JsonUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static bf5.betting.util.BetHistoryUtil.sortByStatusAndBetTimeAsc;

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
    private final RawBetEntityConverter entityConverter;
    private final BetHistoryRepository betHistoryRepository;

    @GetMapping("")
    BaseResponse<List<BetHistory>> getRawBetInfo(@RequestParam(value = "sessionToken", required = false) String sessionToken,
                                                 @RequestParam("startDate") String startDate,
                                                 @RequestParam("endDate") String endDate) {
        List<BetHistory> betHistories = rawBetService.getAllBetWithConvert(sessionToken, startDate, endDate);
        return BaseResponse.success(sortByStatusAndBetTimeAsc(betHistories));
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

    @PostMapping("/history")
    public BaseResponse rerunOldData(@RequestBody GetRawBetResponse request) {
        List<BetHistory> toBeUpdatedBetHistories = new ArrayList<>();
        List<BetHistory> rawBetHistories = entityConverter.convertToPlayerBetHistory(request.getData().getBets());

        Map<Long, BetHistory> insertedBetHistoriesMap = betHistoryService.getAllBetHistory()
                .stream()
                .collect(Collectors.toMap(BetHistory::getBetId, Function.identity()));

        // update betTime, matchTime, matchId, resultSettledTime
        for (BetHistory rawBet : rawBetHistories) {
            BetHistory betHistory = insertedBetHistoriesMap.get(rawBet.getBetId());
            if (betHistory != null) {
                betHistory.setBetTimeWithTimestamp(new Timestamp(rawBet.getBetTimeMs()));
                betHistory.setResultSettledTime(rawBet.getResultSettledTime());
                for (BetMatchDetail rawMatchDetail : rawBet.getEvents()) {
                    for (BetMatchDetail historyMatchDetail : betHistory.getEvents()) {
                        String rawKey = String.format("%s_%s_%s",
                                rawMatchDetail.getFirstTeam(),
                                rawMatchDetail.getSecondTeam(),
                                rawMatchDetail.getTournamentName());
                        String historyKey = String.format("%s_%s_%s",
                                historyMatchDetail.getFirstTeam(),
                                historyMatchDetail.getSecondTeam(),
                                historyMatchDetail.getTournamentName());
                        if (rawKey.equals(historyKey)) {
                            historyMatchDetail.setMatchId(rawMatchDetail.getMatchId());
                            historyMatchDetail.setMatchTimeWithTimestamp(rawMatchDetail.getRawMatchTime());
                            break;
                        }
                    }
                }
                toBeUpdatedBetHistories.add(betHistory);
                log.info("Update new data for BetHistory: {}", JsonUtil.toJsonString(betHistory));
            }
        }

        if (toBeUpdatedBetHistories.size() > 0) {
            betHistoryRepository.saveAll(toBeUpdatedBetHistories);
        }
        return BaseResponse.SUCCESS;
    }
}
