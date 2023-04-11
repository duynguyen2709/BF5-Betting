package bf5.betting.converter;

import bf5.betting.constant.BetResult;
import bf5.betting.constant.BetType;
import bf5.betting.constant.RawBetStatus;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.util.BetHistoryUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
                        } else if (bet.getStatus() != 1 && isAllEventsFinished(bet.getEvents())) {
                            rawBet.setRawStatus(RawBetStatus.RESULT_READY_TO_BE_UPDATED.name());
                        }

                        setMatchDetailKeyId(insertedHistory, rawBet);

                    } else {
                        rawBet.setRawStatus(RawBetStatus.NEW.name());
                    }
                    return rawBet;
                })
                .collect(Collectors.toList());
    }

    private boolean isAllEventsFinished(List<GetRawBetResponse.RawBetEvent> events) {
        // In Accumulator bets, the final result may available BEFORE some other bets have finished
        // We should wait for all bets to be finished before updating final result
        for (GetRawBetResponse.RawBetEvent event : events) {
            if (Objects.isNull(event.getIsFinished()) || !event.getIsFinished()) {
                return false;
            }
        }
        return true;
    }

    private void setMatchDetailKeyId(BetHistory insertedHistory, BetHistory rawBet) {
        Comparator<BetMatchDetail> comparator = (match1, match2) -> {
            String key1 = String.format("%s_%s_%s_%s_%s",
                    match1.getMatchTime(),
                    match1.getFirstTeam(),
                    match1.getSecondTeam(),
                    match1.getTournamentName(),
                    match1.getEvent());
            String key2 = String.format("%s_%s_%s_%s_%s",
                    match2.getMatchTime(),
                    match2.getFirstTeam(),
                    match2.getSecondTeam(),
                    match2.getTournamentName(),
                    match2.getEvent());
            return key1.compareTo(key2);
        };

        insertedHistory.getEvents().sort(comparator);
        rawBet.getEvents().sort(comparator);

        for (int i = 0; i < insertedHistory.getEvents().size(); i++) {
            rawBet.getEvents().get(i).setId(insertedHistory.getEvents().get(i).getId());
        }
    }

    private List<BetMatchDetail> extractMatchDetails(List<GetRawBetResponse.RawBetEvent> events, long betId) {
        return events.stream()
                .map(event -> {
                    BetMatchDetail matchDetail = new BetMatchDetail();
                    matchDetail.setBetId(betId);
                    matchDetail.setMatchTimeWithTimestamp(new Timestamp(event.getGameStartDate() * 1000));
                    matchDetail.setFirstTeam(event.getOpp1Name());
                    matchDetail.setSecondTeam(event.getOpp2Name());
                    if (event.getOpp1Images() != null && event.getOpp1Images().size() > 0)
                        matchDetail.setFirstTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp1Images().get(0)));
                    if (event.getOpp2Images() != null && event.getOpp2Images().size() > 0)
                        matchDetail.setSecondTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp2Images().get(0)));
                    matchDetail.setTournamentName(event.getChampName());
                    matchDetail.setEvent(BetHistoryUtil.parseEvent(event.getEventTypeTitle()));
                    matchDetail.setFirstHalfOnly(event.getPeriodName().equals("1 Half") ? true : null);
                    matchDetail.setScore(event.getScore());
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
