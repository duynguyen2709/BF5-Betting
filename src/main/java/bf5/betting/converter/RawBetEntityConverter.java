package bf5.betting.converter;

import bf5.betting.constant.BetResult;
import bf5.betting.constant.BetType;
import bf5.betting.constant.RawBetStatus;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
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
                .collect(Collectors.toMap(BetHistory::getBetId, Function.identity()));

        return bets.stream()
                .map(bet -> {
                    BetHistory rawBet = new BetHistory();
                    rawBet.setBetId(bet.getId());
                    rawBet.setBetType(BetType.fromValue(bet.getTypeTitle()));
                    rawBet.setBetTimeWithTimestamp(new Timestamp(bet.getDate() * 1000));
                    rawBet.setBetAmount(bet.getSum());
                    double ratio = calculateRatio(bet);
                    rawBet.setRatio(ratio);
                    rawBet.setPotentialProfit((long) (bet.getSum() * ratio) - bet.getSum());
                    rawBet.setActualProfit(calculateActualProfit(bet));
                    rawBet.setResult(calculateBetHistoryResult(bet));
                    List<BetMatchDetail> matchDetails = extractMatchDetails(bet.getEvents(), bet.getId());
                    rawBet.setEvents(matchDetails);
                    if (allBetHistories.containsKey(bet.getId())) {
                        BetHistory insertedHistory = allBetHistories.get(bet.getId());
                        rawBet.setPlayerId(insertedHistory.getPlayerId());
                        rawBet.setRawStatus(RawBetStatus.INSERTED.name());

                        if (insertedHistory.getActualProfit() != null) {
                            rawBet.setRawStatus(RawBetStatus.SETTLED.name());
                        } else if (bet.getStatus() != 1) {
                            rawBet.setRawStatus(RawBetStatus.RESULT_READY_TO_BE_UPDATED.name());
                        }
                    } else {
                        rawBet.setRawStatus(RawBetStatus.NEW.name());
                    }
                    return rawBet;
                })
                .collect(Collectors.toList());
    }

    private List<BetMatchDetail> extractMatchDetails(List<GetRawBetResponse.RawBetEvent> events, long betId) {
        return events.stream()
                .map(event -> {
                    BetMatchDetail matchDetail = new BetMatchDetail();
                    matchDetail.setBetId(betId);
                    matchDetail.setMatchTimeWithTimestamp(new Timestamp(event.getGameStartDate() * 1000));
                    matchDetail.setFirstTeam(event.getOpp1Name());
                    matchDetail.setFirstTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp1Images().get(0)));
                    matchDetail.setSecondTeam(event.getOpp2Name());
                    matchDetail.setSecondTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp2Images().get(0)));
                    matchDetail.setTournamentName(event.getChampName());
                    matchDetail.setEvent(BetUtil.parseEvent(event.getEventTypeTitle()));
                    matchDetail.setFirstHalfOnly(event.getPeriodName().equals("1 Half") ? true : null);
                    matchDetail.setScore(event.getIsFinished() ? event.getScore() : null);
                    matchDetail.setRatio(event.getCoef());
                    matchDetail.setResult(calculateBetMatchDetailResult(event));
                    return matchDetail;
                }).collect(Collectors.toList());
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

    private BetResult calculateBetHistoryResult(GetRawBetResponse.RawBetEntity bet) {
        boolean isNotFinished = bet.getStatus() == 1;
        if (isNotFinished)
            return BetResult.NOT_FINISHED;

        boolean isFullLost = bet.getStatus() == 2;
        if (isFullLost)
            return BetResult.LOST;

        boolean isSingleBet = bet.getTypeTitle().equalsIgnoreCase(BetType.SINGLE.name());
        if (isSingleBet) {
            return BetResult.fromRawBetResult(bet.getEvents().get(0).getResultType());
        } else {
            if (bet.getStatus() == 4)
                return BetResult.WIN;
        }

        return BetResult.NOT_FINISHED;
    }

    private BetResult calculateBetMatchDetailResult(GetRawBetResponse.RawBetEvent event) {
        if (!event.getIsFinished()) {
            return BetResult.NOT_FINISHED;
        }
        return BetResult.fromRawBetResult(event.getResultType());
    }

    private double calculateRatio(GetRawBetResponse.RawBetEntity bet) {
        boolean isSingleBet = bet.getTypeTitle().equalsIgnoreCase(BetType.SINGLE.name());
        if (isSingleBet) {
            return bet.getEvents().get(0).getCoef();
        }
        return bet.getCoef();
    }
}
