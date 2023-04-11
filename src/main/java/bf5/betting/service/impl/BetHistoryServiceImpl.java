package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetResult;
import bf5.betting.constant.PaymentAction;
import bf5.betting.entity.jpa.*;
import bf5.betting.exception.EntityNotFoundException;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.PlayerAssetHistoryService;
import bf5.betting.service.PlayerService;
import bf5.betting.service.TeamDataService;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
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
    private final PlayerAssetHistoryService assetHistoryService;

    @Override
    @TryCatchWrap
    public List<BetHistory> getAllBetHistory() {
        return withTeamDataWrapper(betHistoryRepository.findAll());
    }

    @Override
    public List<BetHistory> getByPlayerIdAndDateRange(String playerId, String startDateStr, String endDate) {
        Date startDate = DateTimeUtil.stringToDate(startDateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
        Date afterEndDate = DateTimeUtil.getNextDate(endDate);
        return withTeamDataWrapper(betHistoryRepository.findByPlayerIdAndDateRange(playerId, startDate, afterEndDate));
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory insertBet(BetHistory entity) {
        updateResultSettledTime(entity);
        log.info("Process insert bet from raw data: {}", JsonUtil.toJsonString(entity));

        BetHistory betHistory = betHistoryRepository.save(entity);
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        updateAssetHistory(betHistory);
        updatePlayerProfit(entity);
        insertTeamDataIfNotAvailable(entity);
        return betHistory;
    }

    @Override
    @TryCatchWrap
    @Transactional
    public List<BetHistory> insertBetInBatch(List<BetHistory> request) {
        request.forEach(this::updateResultSettledTime);
        log.info("Process insert batch bets from raw data: {}", JsonUtil.toJsonString(request));

        List<BetHistory> betHistories = this.betHistoryRepository.saveAll(request);
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        updateAssetHistoryInBatch(betHistories);
        updatePlayersProfitInBatch(request);
        insertTeamDataIfNotAvailable(request);
        return betHistories;
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory updateBetResult(BetHistory request) {
        validateBetResult(request);
        BetHistory betHistory = buildBetHistoryWithResult(request, false);

        log.info("Process update bet: {}", JsonUtil.toJsonString(betHistory));
        betHistory = withTeamDataWrapper(betHistoryRepository.save(betHistory));
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        updateAssetHistory(betHistory);
        updatePlayerProfit(betHistory);
        return betHistory;
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory updateBetResultFromRaw(BetHistory request) {
        validateBetResult(request);
        BetHistory betHistory = buildBetHistoryWithResult(request, true);

        log.info("Process update bet from raw data: {}", JsonUtil.toJsonString(betHistory));
        betHistory = withTeamDataWrapper(betHistoryRepository.save(betHistory));
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        updateAssetHistory(betHistory);
        updatePlayerProfit(betHistory);
        return betHistory;
    }

    @Override
    @TryCatchWrap
    @Transactional
    public List<BetHistory> updateBatchBetResultFromRaw(List<BetHistory> request) {
        List<BetHistory> betHistories = new ArrayList<>();
        for (BetHistory updateRequest : request) {
            validateBetResult(updateRequest);
            BetHistory betHistory = buildBetHistoryWithResult(updateRequest, true);
            betHistories.add(betHistory);
        }

        log.info("Process update batch bets from raw data: {}", JsonUtil.toJsonString(betHistories));
        betHistories = this.betHistoryRepository.saveAll(betHistories);
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        updateAssetHistoryInBatch(betHistories);
        updatePlayersProfitInBatch(betHistories);
        return betHistories;
    }

    private void updateAssetHistoryInBatch(List<BetHistory> betHistories) {
        List<BetHistory> finishedBets = betHistories.stream()
                .filter(bet -> bet.getResult() != BetResult.NOT_FINISHED && bet.getResult() != BetResult.DRAW)
                .collect(Collectors.toList());
        if (finishedBets.isEmpty()) {
            return;
        }

        finishedBets.sort(Comparator.comparingLong(o -> o.getResultSettledTime().getTime()));
        List<PlayerAssetHistory> assetHistories = new ArrayList<>();
        Map<String, Long> playerAsset = this.playerService.getAllPlayer()
                .values()
                .stream()
                .collect(Collectors.toMap(Player::getPlayerId, Player::getTotalProfit));

        for (BetHistory bet : finishedBets) {
            long assetAfter = playerAsset.get(bet.getPlayerId()) + bet.getActualProfit();
            PlayerAssetHistory assetHistory = PlayerAssetHistory.builder()
                    .playerId(bet.getPlayerId())
                    .betId(bet.getBetId())
                    .paymentTime(bet.getResultSettledTime())
                    .action(bet.getActualProfit() > 0 ? PaymentAction.BET_WIN : PaymentAction.BET_LOST)
                    .amount(bet.getActualProfit())
                    .assetBefore(playerAsset.get(bet.getPlayerId()))
                    .assetAfter(assetAfter)
                    .build();
            assetHistories.add(assetHistory);

            playerAsset.put(bet.getPlayerId(), assetAfter);
        }

        this.assetHistoryService.insertBatch(assetHistories);
    }

    private void updateAssetHistory(BetHistory betHistory) {
        if (betHistory.getResult() == BetResult.NOT_FINISHED || betHistory.getResult() == BetResult.DRAW) {
            return;
        }

        Map<String, Player> playerAsset = this.playerService.getAllPlayer();
        long assetAfter = playerAsset.get(betHistory.getPlayerId()).getTotalProfit() + betHistory.getActualProfit();
        PlayerAssetHistory assetHistory = PlayerAssetHistory.builder()
                .playerId(betHistory.getPlayerId())
                .betId(betHistory.getBetId())
                .paymentTime(betHistory.getResultSettledTime())
                .action(betHistory.getActualProfit() > 0 ? PaymentAction.BET_WIN : PaymentAction.BET_LOST)
                .amount(betHistory.getActualProfit())
                .assetBefore(playerAsset.get(betHistory.getPlayerId()).getTotalProfit())
                .assetAfter(assetAfter)
                .build();

        this.assetHistoryService.insert(assetHistory);
    }

    private BetHistory buildBetHistoryWithResult(BetHistory updateRequest, boolean isFromRaw) {
        return betHistoryRepository.findById(updateRequest.getBetId())
                .map(entity -> setFinalBetHistoryResultFromRaw(updateRequest, entity, isFromRaw))
                .orElseThrow(() ->
                        EntityNotFoundException.builder()
                                .clazz(BetHistory.class)
                                .id(updateRequest.getBetId())
                                .build());
    }

    private void insertTeamDataIfNotAvailable(BetHistory entity) {
        Map<String, TeamData> newTeamData = new HashMap<>();
        addTeamDataIfNotAvailable(newTeamData, entity);
        if (newTeamData.size() > 0) {
            teamDataService.insertBatch(newTeamData.values());
        }
    }

    private void insertTeamDataIfNotAvailable(List<BetHistory> betHistories) {
        Map<String, TeamData> newTeamData = new HashMap<>();
        betHistories.forEach(bet -> addTeamDataIfNotAvailable(newTeamData, bet));
        if (newTeamData.size() > 0) {
            teamDataService.insertBatch(newTeamData.values());
        }
    }

    private void addTeamDataIfNotAvailable(Map<String, TeamData> newTeamData, BetHistory bet) {
        bet.getEvents().forEach(event -> {
            if (Objects.isNull(teamDataService.getTeamLogoUrl(event.getFirstTeam()))) {
                newTeamData.put(event.getFirstTeam(), new TeamData(event.getFirstTeam(), event.getFirstTeamLogoUrl()));
            }
            if (Objects.isNull(teamDataService.getTeamLogoUrl(event.getSecondTeam()))) {
                newTeamData.put(event.getSecondTeam(), new TeamData(event.getSecondTeam(), event.getSecondTeamLogoUrl()));
            }
        });
    }

    private void updatePlayersProfitInBatch(List<BetHistory> betHistories) {
        Map<String, Player> allPlayers = this.playerService.getAllPlayer();
        betHistories.forEach(betHistory -> {
            if (betHistory.getActualProfit() != null) {
                Player player = allPlayers.get(betHistory.getPlayerId());
                long newTotalProfit = player.getTotalProfit() + betHistory.getActualProfit();
                player.setTotalProfit(newTotalProfit);
                allPlayers.put(betHistory.getPlayerId(), player);
            }
        });
        this.playerService.updatePlayerDataBatch(allPlayers.values());
    }

    private void validateBetResult(BetHistory request) {
        if (request.getResult() == BetResult.NOT_FINISHED) {
            throw new IllegalArgumentException("Result NOT_FINISHED Invalid");
        }
        for (BetMatchDetail event : request.getEvents()) {
            if (event.getResult() == BetResult.NOT_FINISHED) {
                throw new IllegalArgumentException("Result NOT_FINISHED Invalid");
            }
        }
    }

    private long calculateActualProfitManual(BetHistory betHistoryEntity, BetResult betResult) {
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
        return actualProfit;
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
        betHistory.getEvents().forEach(event -> {
            event.setFirstTeamLogoUrl(teamDataService.getTeamLogoUrl(event.getFirstTeam()));
            event.setSecondTeamLogoUrl(teamDataService.getTeamLogoUrl(event.getSecondTeam()));
        });
        return betHistory;
    }

    private void updateResultSettledTime(BetHistory bet) {
        if (bet.getResult() != BetResult.NOT_FINISHED) {
            bet.setResultSettledTime(new Timestamp(System.currentTimeMillis()));
        }
    }

    private BetHistory setFinalBetHistoryResultFromRaw(BetHistory request, BetHistory entity, boolean isFromRaw) {
        entity.setResult(request.getResult());
        updateResultSettledTime(entity);
        entity.setActualProfit(isFromRaw ? request.getActualProfit() : calculateActualProfitManual(entity, request.getResult()));

        request.getEvents().forEach(eventResult -> {
            for (BetMatchDetail match : entity.getEvents()) {
                if (eventResult.getId() == match.getId()) {
                    match.setResult(eventResult.getResult());
                    match.setScore(eventResult.getScore());
                    break;
                }
            }
        });
        return entity;
    }
}
