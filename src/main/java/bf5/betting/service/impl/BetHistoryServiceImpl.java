package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.exception.EntityNotFoundException;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.*;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
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
    private final PlayerAssetHistoryService assetHistoryService;
    private final TelegramNotiService telegramNotiService;

    @Override
    public List<BetHistory> getRecentUnfinishedBets() {
        Date startDate = DateTimeUtil.getYesterday();
        Date afterEndDate = DateTimeUtil.getNextDate(DateTimeUtil.getDateStringFromToday(0));
        return withTeamDataWrapper(betHistoryRepository.findByResultAndDateRange(BetResult.NOT_FINISHED, startDate, afterEndDate));
    }

    @Override
    @TryCatchWrap
    public List<BetHistory> getAllBetHistory() {
        return withTeamDataWrapper(betHistoryRepository.findAll());
    }

    @Override
    @TryCatchWrap
    public List<BetHistory> getByPlayerIdAndDateRange(String playerId, String startDateStr, String endDate) {
        Date startDate = DateTimeUtil.stringToDate(startDateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
        Date afterEndDate = DateTimeUtil.getNextDate(endDate);
        return withTeamDataWrapper(betHistoryRepository.findByPlayerIdAndDateRange(playerId, startDate, afterEndDate));
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory insertBet(BetHistory request) {
        request.updateResultSettledTime();
        log.info("Process inserting bet from raw data: {}", JsonUtil.toJsonString(request));

        BetHistory betHistory = betHistoryRepository.save(request);
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        this.assetHistoryService.updateAssetFromBetHistory(request);
        this.playerService.updatePlayerProfitFromBetHistory(request);
        this.teamDataService.insertTeamDataIfNotAvailable(request);
        this.telegramNotiService.sendNotificationForNewBetAdded(request.getPlayerId(), Collections.singletonList(withTeamDataWrapper(betHistory)));
        return betHistory;
    }

    @Override
    @TryCatchWrap
    @Transactional
    public List<BetHistory> insertBetInBatch(List<BetHistory> betHistories) {
        betHistories.forEach(BetHistory::updateResultSettledTime);
        betHistories.sort(Comparator.comparing(BetHistory::getBetId));
        log.info("Process inserting batch bets from raw data: {}", JsonUtil.toJsonString(betHistories));

        List<BetHistory> newBetHistories = this.betHistoryRepository.saveAll(betHistories);
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        this.assetHistoryService.updateAssetFromBetHistoryListInBatch(betHistories);
        this.playerService.updatePlayerProfitFromListBetHistoryInBatch(betHistories);
        this.teamDataService.insertTeamDataIfNotAvailable(betHistories);
        this.telegramNotiService.sendNotificationForNewBetAdded(betHistories.get(0).getPlayerId(), withTeamDataWrapper(betHistories));
        return newBetHistories;
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory updateBetResult(BetHistory request) {
        validateBetResult(request);
        BetHistory betHistory = buildBetHistoryWithResult(request, false);

        log.info("Process updating bet: {}", JsonUtil.toJsonString(betHistory));
        betHistory = withTeamDataWrapper(betHistoryRepository.save(betHistory));
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        this.assetHistoryService.updateAssetFromBetHistory(betHistory);
        this.playerService.updatePlayerProfitFromBetHistory(betHistory);
        return betHistory;
    }

    @Override
    @TryCatchWrap
    @Transactional
    public BetHistory updateBetResultFromRaw(BetHistory request) {
        validateBetResult(request);
        BetHistory betHistory = buildBetHistoryWithResult(request, true);

        log.info("Process updating bet from raw data: {}", JsonUtil.toJsonString(betHistory));
        betHistory = withTeamDataWrapper(betHistoryRepository.save(betHistory));
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        this.assetHistoryService.updateAssetFromBetHistory(betHistory);
        this.playerService.updatePlayerProfitFromBetHistory(betHistory);
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

        log.info("Process updating batch bets from raw data: {}", JsonUtil.toJsonString(betHistories));
        betHistories = this.betHistoryRepository.saveAll(betHistories);
        // Asset Histories must be updated before Players' profit to get most recent states of assets
        this.assetHistoryService.updateAssetFromBetHistoryListInBatch(betHistories);
        this.playerService.updatePlayerProfitFromListBetHistoryInBatch(betHistories);
        return betHistories;
    }

    private BetHistory buildBetHistoryWithResult(BetHistory updateRequest, boolean isFromRaw) {
        return betHistoryRepository.findById(updateRequest.getBetId())
                .map(entity -> setFinalBetHistoryResult(updateRequest, entity, isFromRaw))
                .orElseThrow(() ->
                        EntityNotFoundException.builder()
                                .clazz(BetHistory.class)
                                .id(updateRequest.getBetId())
                                .build());
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

    private List<BetHistory> withTeamDataWrapper(List<BetHistory> betHistoryList) {
        return betHistoryList.stream().map(this::withTeamDataWrapper).collect(Collectors.toList());
    }

    private BetHistory withTeamDataWrapper(BetHistory betHistory) {
        betHistory.getEvents().forEach(event -> {
            event.setFirstTeamLogoUrl(teamDataService.getTeamLogoUrl(event.getFirstTeam()));
            event.setSecondTeamLogoUrl(teamDataService.getTeamLogoUrl(event.getSecondTeam()));

            String firstTeamVnName = teamDataService.getTeamVnName(event.getFirstTeam());
            if (StringUtils.isNotBlank(firstTeamVnName)) {
                event.setFirstTeam(firstTeamVnName);
            }

            String secondTeamVnName = teamDataService.getTeamVnName(event.getSecondTeam());
            if (StringUtils.isNotBlank(secondTeamVnName)) {
                event.setSecondTeam(secondTeamVnName);
            }
        });
        return betHistory;
    }

    private BetHistory setFinalBetHistoryResult(BetHistory updateRequestEntity, BetHistory oldEntity, boolean isFromRaw) {
        oldEntity.setResult(updateRequestEntity.getResult());
        oldEntity.updateResultSettledTime();
        oldEntity.setActualProfit(isFromRaw ? updateRequestEntity.getActualProfit() : calculateActualProfitManual(oldEntity, updateRequestEntity.getResult()));

        updateRequestEntity.getEvents().forEach(eventResult -> {
            for (BetMatchDetail match : oldEntity.getEvents()) {
                if (eventResult.getId() == match.getId()) {
                    match.setResult(eventResult.getResult());
                    match.setScore(eventResult.getScore());
                    break;
                }
            }
        });
        return oldEntity;
    }
}
