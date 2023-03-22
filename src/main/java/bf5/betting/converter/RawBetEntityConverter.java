package bf5.betting.converter;

import bf5.betting.constant.BetResult;
import bf5.betting.constant.RawBetStatus;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.util.BetUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
@Component
@AllArgsConstructor
public class RawBetEntityConverter {
    private static final String TEAM_AVATAR_FORMAT_URL = "https://v2l.cdnsfree.com/sfiles/logo_teams/%s";

    private final BetHistoryService betHistoryService;

    public List<BetHistory> convertToPlayerBetHistory(List<GetRawBetResponse.RawBetEntity> bets) {
        Map<Long, BetHistory> allBetHistories = betHistoryService.getAllBetHistory()
                .stream()
                .collect(Collectors.toMap(BetHistory::getId, Function.identity()));

        return bets.stream()
                .map(bet -> {
                    GetRawBetResponse.RawBetEvent event = bet.getEvents().get(0);
                    boolean isFinished = bet.getStatus() != 1;
                    BetHistory rawBet = new BetHistory();
                    rawBet.setId(bet.getId());
                    rawBet.setBetTimeWithTimestamp(new Timestamp(bet.getDate() * 1000));
                    rawBet.setBetAmount(bet.getSum());
                    rawBet.setRatio(event.getCoef());
                    rawBet.setPotentialProfit((long) (bet.getSum() * event.getCoef()) - bet.getSum());
                    rawBet.setScore(isFinished ? event.getScore() : null);
                    rawBet.setEvent(BetUtil.parseEvent(event.getEventTypeTitle()));
                    rawBet.setMatchTimeWithTimestamp(new Timestamp(event.getGameStartDate() * 1000));
                    rawBet.setTournamentName(event.getChampName());
                    rawBet.setFirstHalfOnly(event.getPeriodName().equals("1 Half") ? true : null);
                    rawBet.setFirstTeam(event.getOpp1Name());
                    rawBet.setFirstTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp1Images().get(0)));
                    rawBet.setSecondTeam(event.getOpp2Name());
                    rawBet.setSecondTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp2Images().get(0)));
                    rawBet.setActualProfit(calculateActualProfit(bet));
                    rawBet.setResult(calculateBetResult(bet));
                    if (allBetHistories.containsKey(bet.getId())) {
                        BetHistory insertedHistory = allBetHistories.get(bet.getId());
                        rawBet.setPlayerId(insertedHistory.getPlayerId());
                        rawBet.setRawStatus(RawBetStatus.INSERTED.name());

                        if (insertedHistory.getActualProfit() != null) {
                            rawBet.setRawStatus(RawBetStatus.SETTLED.name());
                        } else if (event.getIsFinished()) {
                            rawBet.setRawStatus(RawBetStatus.RESULT_READY_TO_BE_UPDATED.name());
                        }
                    } else {
                        rawBet.setRawStatus(RawBetStatus.NEW.name());
                    }
                    return rawBet;
                })
                .collect(Collectors.toList());
    }

    private Long calculateActualProfit(GetRawBetResponse.RawBetEntity bet) {
        boolean isNotFinished = bet.getStatus() == 1;
        if (isNotFinished)
            return null;

        boolean isFullLost = bet.getStatus() == 2;
        if (isFullLost)
            return (-1) * bet.getSum();

        return bet.getWinSum() - bet.getSum();
    }

    private BetResult calculateBetResult(GetRawBetResponse.RawBetEntity bet) {
        GetRawBetResponse.RawBetEvent event = bet.getEvents().get(0);
        boolean isNotFinished = bet.getStatus() == 1;
        if (isNotFinished)
            return BetResult.NOT_FINISHED;

        boolean isFullLost = bet.getStatus() == 2;
        if (isFullLost)
            return BetResult.LOST;

        boolean isHalfLost = bet.getCoef() == 0.5 || bet.getSum() > bet.getWinSum();
        if (isHalfLost)
            return BetResult.HALF_LOST;

        boolean isDraw = bet.getCoef() == 1 || bet.getSum() == bet.getWinSum();
        if (isDraw)
            return BetResult.DRAW;

        boolean isFullWin = bet.getStatus() == 4 && bet.getCoef() == event.getCoef();
        if (isFullWin)
            return BetResult.WIN;

        boolean isHalfWin = bet.getStatus() == 4 && bet.getCoef() < event.getCoef() && bet.getCoef() > 1;
        if (isHalfWin)
            return BetResult.HALF_WIN;

        return BetResult.NOT_FINISHED;
    }
}
