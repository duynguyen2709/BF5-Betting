package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.jpa.BetHistory;
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
}
