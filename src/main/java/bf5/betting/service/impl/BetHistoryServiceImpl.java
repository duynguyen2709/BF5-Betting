package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.BetHistoryUpdateResultRequest;
import bf5.betting.exception.EntityNotFoundException;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.BetHistoryService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class BetHistoryServiceImpl implements BetHistoryService {

    private final BetHistoryRepository betHistoryRepository;

    @Override
    @TryCatchWrap
    public List<BetHistory> getAllBetHistory() {
        return betHistoryRepository.findAll();
    }

    @Override
    @TryCatchWrap
    public BetHistory updateResult(BetHistoryUpdateResultRequest request) {
        return betHistoryRepository.findById(request.getBetId())
                .map(entity -> updateProfit(entity, request.getResult()))
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
}
