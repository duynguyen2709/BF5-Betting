package bf5.betting.service.impl;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.service.AsyncService;
import bf5.betting.service.BetHistoryService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class AsyncServiceImpl implements AsyncService {

  private final BetHistoryService betHistoryService;

  @Override
  @Async
  public void updateBetResultFromTelegram(List<BetHistory> betHistoryList) {
    betHistoryService.updateBatchBetResultFromRaw(betHistoryList);
  }
}
