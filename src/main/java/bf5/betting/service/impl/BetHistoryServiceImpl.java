package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.exception.EntityNotFoundException;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.TeamDataService;
import bf5.betting.util.DateTimeUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
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
    public List<BetHistory> getByPlayerIdAndDate(String playerId, String dateStr) {
        Date date = DateTimeUtil.stringToDate(dateStr, DateTimeUtil.MYSQL_DATE_ONLY_FORMAT);
        return withTeamDataWrapper(betHistoryRepository.findByPlayerIdAndBetTime(playerId, date));
    }

    @Override
    public BetHistory createBet(BetHistory entity) {
        entity.setResult(BetResult.NOT_FINISHED);
        entity.setBetTime(DateTimeUtil.currentTimestamp());
        entity.setPotentialProfit((long) (entity.getBetAmount() * entity.getRatio()));
        return withTeamDataWrapper(betHistoryRepository.save(entity));
    }

    @Override
    public BetHistory getByBetId(int betId) {
        return betHistoryRepository.findById(betId)
                .map(this::withTeamDataWrapper)
                .orElseThrow(() ->
                        EntityNotFoundException.builder()
                                .clazz(BetHistory.class)
                                .id(betId)
                                .build());
    }

    @Override
    @TryCatchWrap
    public BetHistory updateBetResult(BetHistoryUpdateResultRequest request) {
        return betHistoryRepository.findById(request.getBetId())
                .map(entity -> withTeamDataWrapper(updateProfit(entity, request.getResult())))
                .orElseThrow(() ->
                        EntityNotFoundException.builder()
                                .clazz(BetHistory.class)
                                .id(request.getBetId())
                                .build());
    }

    private BetHistory updateProfit(BetHistory betHistoryEntity, String result) {
        BetResult betResult = BetResult.fromValue(result);
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
        return betHistoryRepository.save(betHistoryEntity);
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
