package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.Player;
import bf5.betting.entity.jpa.TeamData;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.exception.EntityNotFoundException;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.PlayerService;
import bf5.betting.service.TeamDataService;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class BetHistoryServiceImpl implements BetHistoryService {
    private final BetHistoryRepository betHistoryRepository;
    private final TeamDataService teamDataService;
    private final PlayerService playerService;

    @Override
    @TryCatchWrap
    public List<BetHistory> getAllBetHistory() {
        return withTeamDataWrapper(betHistoryRepository.findAll());
    }

    @Override
    @TryCatchWrap
    public List<BetHistory> getByPlayerId(String playerId) {
        return withTeamDataWrapper(betHistoryRepository.findByPlayerId(playerId));
    }

    @Override
    public List<BetHistory> getByPlayerIdAndDateRange(String playerId, String startDateStr, String endDateStr) {
        Date startDate = DateTimeUtil.stringToDate(startDateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
        Date endDate = DateTimeUtil.stringToDate(endDateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
        return withTeamDataWrapper(betHistoryRepository.findByPlayerIdAndDateRange(playerId, startDate, endDate));
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory createBet(BetHistory entity) {
        BetHistory result = betHistoryRepository.save(entity);
        updatePlayerProfit(entity);
        insertTeamDataIfNotAvailable(entity);
        return result;
    }

    private void insertTeamDataIfNotAvailable(BetHistory entity) {
        if (Objects.isNull(teamDataService.getTeamLogoUrl(entity.getFirstTeam()))) {
            teamDataService.insert(new TeamData(entity.getFirstTeam(), entity.getFirstTeamLogoUrl()));
        }
        if (Objects.isNull(teamDataService.getTeamLogoUrl(entity.getSecondTeam()))) {
            teamDataService.insert(new TeamData(entity.getSecondTeam(), entity.getSecondTeamLogoUrl()));
        }
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory updateBetResult(BetHistoryUpdateResultRequest request) {
        BetResult betResult = validateBetResult(request);
        return betHistoryRepository.findById(request.getBetId())
                .map(entity -> withTeamDataWrapper(updateProfit(entity, betResult)))
                .orElseThrow(() ->
                        EntityNotFoundException.builder()
                                .clazz(BetHistory.class)
                                .id(request.getBetId())
                                .build());
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory updateBetResultFromRaw(BetHistoryUpdateResultRequest request) {
        BetResult betResult = validateBetResult(request);
        return betHistoryRepository.findById(request.getBetId())
                .map(entity -> {
                    entity.setResult(betResult);
                    entity.setScore(request.getScore());
                    entity.setActualProfit(request.getActualProfit());
                    BetHistory result = withTeamDataWrapper(betHistoryRepository.save(entity));
                    updatePlayerProfit(result);
                    return result;
                })
                .orElseThrow(() ->
                        EntityNotFoundException.builder()
                                .clazz(BetHistory.class)
                                .id(request.getBetId())
                                .build());
    }

    @Override
    @TryCatchWrap
    @Transactional
    public List<BetHistory> updateBatchBetResultFromRaw(List<BetHistoryUpdateResultRequest> request) {
        List<BetHistory> betHistories = new ArrayList<>();
        for (BetHistoryUpdateResultRequest updateRequest : request) {
            BetResult betResult = validateBetResult(updateRequest);
            BetHistory betHistory = betHistoryRepository.findById(updateRequest.getBetId())
                    .map(entity -> {
                        entity.setResult(betResult);
                        entity.setScore(updateRequest.getScore());
                        entity.setActualProfit(updateRequest.getActualProfit());
                        return entity;
                    })
                    .orElseThrow(() ->
                            EntityNotFoundException.builder()
                                    .clazz(BetHistory.class)
                                    .id(updateRequest.getBetId())
                                    .build());
            betHistories.add(betHistory);
        }

        log.info("Process update batch bets from raw data: {}", JsonUtil.toJsonString(betHistories));
        betHistories = this.betHistoryRepository.saveAll(betHistories);
        updatePlayersProfitInBatch(betHistories);
        return betHistories;
    }

    private void updatePlayersProfitInBatch(List<BetHistory> betHistories) {
        Map<String, Player> allPlayers = this.playerService.getAllPlayer();
        betHistories.forEach(betHistory -> {
            Player player = allPlayers.get(betHistory.getPlayerId());
            long newTotalProfit = player.getTotalProfit() + betHistory.getActualProfit();
            player.setTotalProfit(newTotalProfit);
            allPlayers.put(betHistory.getPlayerId(), player);
        });
        this.playerService.updatePlayerDataBatch(allPlayers.values());
    }

    private BetResult validateBetResult(BetHistoryUpdateResultRequest request) {
        BetResult betResult = BetResult.fromValue(request.getResult());
        if (betResult == BetResult.NOT_FINISHED) {
            throw new IllegalArgumentException("Result NOT_FINISHED Invalid");
        }
        return betResult;
    }

    private BetHistory updateProfit(BetHistory betHistoryEntity, BetResult betResult) {
        long actualProfit = 0;
        switch (betResult) {
            case WIN:
                actualProfit = betHistoryEntity.getPotentialProfit();
                break;
            case HALF_WIN:
                actualProfit = betHistoryEntity.getPotentialProfit() / 2;
                break;
            case LOST:
                actualProfit = betHistoryEntity.getBetAmount() * (-1);
                break;
            case HALF_LOST:
                actualProfit = (betHistoryEntity.getBetAmount() * (-1)) / 2;
                break;
        }

        betHistoryEntity.setActualProfit(actualProfit);
        betHistoryEntity.setResult(betResult);
        BetHistory newBetHistory = betHistoryRepository.save(betHistoryEntity);

        updatePlayerProfit(newBetHistory);
        return newBetHistory;
    }

    private void updatePlayerProfit(BetHistory newBetHistory) {
        if (Objects.isNull(newBetHistory.getActualProfit())) {
            return;
        }
        Player player = playerService.getAllPlayer().get(newBetHistory.getPlayerId());
        long newTotalProfit = player.getTotalProfit() + newBetHistory.getActualProfit();
        player.setTotalProfit(newTotalProfit);
        playerService.updatePlayerData(player);
    }

    private List<BetHistory> withTeamDataWrapper(List<BetHistory> betHistoryList) {
        return betHistoryList.stream().map(this::withTeamDataWrapper).collect(Collectors.toList());
    }

    private BetHistory withTeamDataWrapper(BetHistory betHistory) {
        betHistory.setFirstTeamLogoUrl(teamDataService.getTeamLogoUrl(betHistory.getFirstTeam()));
        betHistory.setSecondTeamLogoUrl(teamDataService.getTeamLogoUrl(betHistory.getSecondTeam()));
        return betHistory;
    }
}
