package bf5.betting.converter;

import bf5.betting.constant.BetResult;
import bf5.betting.constant.BetType;
import bf5.betting.constant.RawBetStatus;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.util.BetHistoryUtil;
import bf5.betting.util.JsonUtil;
import bf5.betting.util.SubsetUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
@Component
@AllArgsConstructor
@Log4j2
public class RawBetEntityConverter {
    private static final String TEAM_AVATAR_FORMAT_URL = "https://v2l.cdnsfree.com/sfiles/logo_teams/%s";

    private final BetHistoryService betHistoryService;

    public List<BetHistory> convertToPlayerBetHistory(List<GetRawBetResponse.RawBetEntity> bets) {
        if (bets == null || bets.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> betIds = bets.stream().map(GetRawBetResponse.RawBetEntity::getId).collect(Collectors.toList());
        Map<Long, BetHistory> insertedBetHistories = betHistoryService.getByBetIds(betIds)
                .stream()
                .collect(Collectors.toMap(BetHistory::getBetId, Function.identity()));

        return bets.stream()
                .map(bet -> {
                    try {
                        BetHistory rawBet = new BetHistory();
                        rawBet.setBetId(bet.getId());
                        rawBet.setBetType(BetType.fromRawValue(bet.getTypeTitle()));
                        rawBet.setMetadata(getBetMetadata(bet));
                        rawBet.setBetTimeWithTimestamp(new Timestamp(bet.getDate() * 1000));
                        rawBet.setBetAmount(bet.getSum());
                        double ratio = calculateRatio(bet);
                        rawBet.setRatio(ratio);
                        rawBet.setPotentialProfit((long) (bet.getSum() * ratio) - bet.getSum());
                        rawBet.setActualProfit(calculateActualProfit(bet));
                        rawBet.setResult(calculateBetHistoryResult(bet));
                        if (rawBet.getResult() != BetResult.NOT_FINISHED) {
                            rawBet.setResultSettledTime(BetHistoryUtil.getLatestResultSettledTime(bet.getEvents()));
                        }
                        List<BetMatchDetail> matchDetails = extractMatchDetails(bet.getEvents(), bet.getId());
                        rawBet.setEvents(matchDetails);
                        if (insertedBetHistories.containsKey(bet.getId())) {
                            BetHistory insertedHistory = insertedBetHistories.get(bet.getId());
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
                    } catch (Exception ex) {
                        log.error("[convertToPlayerBetHistory] RawBet: {}, exception: {}",
                                JsonUtil.toJsonString(bet), ex.getMessage(), ex);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private Map<String, Object> getBetMetadata(GetRawBetResponse.RawBetEntity bet) {
        Map<String, Object> metadata = new HashMap<>();
        if (StringUtils.isNotBlank(bet.getFormattedSystemType())) {
            metadata.put("combination", bet.getFormattedSystemType());
        }
        return metadata;
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
            String key1 = String.format("%s_%s_%s_%s",
                    match1.getMatchTime(),
                    match1.getFirstTeam(),
                    match1.getSecondTeam(),
                    match1.getTournamentName());
            String key2 = String.format("%s_%s_%s_%s",
                    match2.getMatchTime(),
                    match2.getFirstTeam(),
                    match2.getSecondTeam(),
                    match2.getTournamentName());
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
                    matchDetail.setMatchId(event.getGameId());
                    matchDetail.setMatchTimeWithTimestamp(new Timestamp(event.getGameStartDate() * 1000));
                    matchDetail.setFirstTeam(event.getOpp1Name());
                    matchDetail.setSecondTeam(event.getOpp2Name());
                    if (event.getOpp1Images() != null && !event.getOpp1Images().isEmpty())
                        matchDetail.setFirstTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp1Images().get(0)));
                    if (event.getOpp2Images() != null && !event.getOpp2Images().isEmpty())
                        matchDetail.setSecondTeamLogoUrl(String.format(TEAM_AVATAR_FORMAT_URL, event.getOpp2Images().get(0)));
                    matchDetail.setTournamentName(event.getChampName());
                    matchDetail.setEvent(BetHistoryUtil.parseEventDetail(event));
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

        if (bet.getWinSum() != null)
            return bet.getWinSum() - bet.getSum();

        if (bet.getOutSum() != null)
            return bet.getOutSum() - bet.getSum();

        return bet.getSum();
    }

    private BetResult calculateBetHistoryResult(GetRawBetResponse.RawBetEntity bet) {
        boolean isNotFinished = bet.getStatus() == 1;
        if (isNotFinished)
            return BetResult.NOT_FINISHED;

        // TODO: Handle bet sold
        boolean isFullLost = bet.getStatus() == 2 || bet.getStatus() == 8; // status = 8 => bet sold
        if (isFullLost)
            return BetResult.LOST;

        BetType betType = BetType.fromRawValue(bet.getTypeTitle());
        switch (betType) {
            case SINGLE:
                return BetResult.fromRawBetResult(bet.getEvents().get(0).getResultType());
            case ACCUMULATOR:
                if (bet.getStatus() == 4)
                    return BetResult.WIN;
                break;
            case SYSTEM:
            case LUCKY:
                if (bet.getStatus() == 4) {
                    if (bet.getWinSum() > bet.getSum())
                        return BetResult.WIN;
                    else
                        return BetResult.LOST;
                }
                break;
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
        List<Double> ratioList = bet.getEvents().stream()
                .map(GetRawBetResponse.RawBetEvent::getCoef)
                .collect(Collectors.toList());
        BetType betType = BetType.fromRawValue(bet.getTypeTitle());
        switch (betType) {
            case SINGLE:
                return bet.getEvents().get(0).getCoef();
            case ACCUMULATOR:
                return bet.getCoef();
            case LUCKY:
                List<List<Double>> ratioSubsets = SubsetUtil.generateAllSubsets(ratioList);
                double sumRatio = ratioSubsets.stream()
                        .mapToDouble(subset -> subset.stream()
                                .reduce(1.0, (ratio1, ratio2) -> ratio1 * ratio2))
                        .sum();
                return (double) Math.round((sumRatio / ratioSubsets.size()) * 100000d) / 100000d;
            case SYSTEM:
                int combination = Integer.parseInt(bet.getFormattedSystemType().split("/")[0]);
                List<List<Double>> ratioSubsetsOfCombination = SubsetUtil.generateSubsetOfSize(ratioList, combination);
                double sumRatioOfCombinations = ratioSubsetsOfCombination.stream()
                        .mapToDouble(subset -> subset.stream()
                                .reduce(1.0, (ratio1, ratio2) -> ratio1 * ratio2))
                        .sum();
                return (double) Math.round((sumRatioOfCombinations / ratioSubsetsOfCombination.size()) * 100000d) / 100000d;
            default:
                return 1.0;
        }
    }
}
