package bf5.betting.job;

import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.exception.UncheckedHttpResponseException;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import bf5.betting.service.ServerConfigService;
import bf5.betting.service.TelegramNotiService;
import bf5.betting.util.DateTimeUtil;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

/**
 * @author duynguyen
 **/
@Log4j2
@Service
@AllArgsConstructor
public class AutoUpdateBetResultCronJob {

  private final RawBetService rawBetService;
  private final BetHistoryService betHistoryService;
  private final BetHistoryRepository betHistoryRepository;
  private final TelegramNotiService telegramNotiService;
  private final ServerConfigService serverConfigService;

  private final Cache<Long, Boolean> processedBetCache = Caffeine.newBuilder()
                                                                 .expireAfterWrite(2,
                                                                                   TimeUnit.DAYS)
                                                                 .build();

  @PostConstruct
  void scheduleJob() {
    ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    int interval = this.serverConfigService.getAutoUpdaterIntervalMinutes();
    scheduler.scheduleAtFixedRate(this::run,
                                  0,
                                  TimeUnit.MINUTES.toSeconds(interval),
                                  TimeUnit.SECONDS);
  }

  private void run() {
    log.info(
        "\n======================================== Running scheduled auto update bet result job at {} ========================================",
        DateTimeUtil.now());

    try {
      // Get list raw bets that finished
      List<BetHistory> rawBetsReadyForUpdate = rawBetService.getListBetForAutoUpdater()
                                                            .stream()
                                                            .filter(bet -> bet.getResult() != BetResult.NOT_FINISHED
                                                                && Objects.isNull(processedBetCache.getIfPresent(
                                                                bet.getBetId())))
                                                            .collect(Collectors.toList());
      if (rawBetsReadyForUpdate.isEmpty()) {
        log.info("List raw bets ready for update is empty => Skipped this run");
        return;
      }

      List<BetHistory> toBeUpdatedBetHistories = filterUnfinishedBetsInDatabase(rawBetsReadyForUpdate);
      if (toBeUpdatedBetHistories.isEmpty()) {
        log.info("List raw bet history to be updated is empty => Skipped this run");
        return;
      }

      this.betHistoryService.updateBatchBetResultFromRaw(toBeUpdatedBetHistories);

      toBeUpdatedBetHistories.forEach(betHistory -> {
        processedBetCache.put(betHistory.getBetId(), true);
      });
    } catch (UncheckedHttpResponseException tokenExpiredEx) {
      telegramNotiService.sendExceptionAlert("Token Expired at " + DateTimeUtil.now());
      throw tokenExpiredEx;
    } catch (Exception ex) {
      log.error("Exception occurred when running auto update bet results job: {}", ex.getMessage(),
                ex);
    } finally {
      log.info(
          "\n========================================  Finish scheduled auto update bet result job at {} ========================================\n",
          DateTimeUtil.now());
    }
  }

  private List<BetHistory> filterUnfinishedBetsInDatabase(List<BetHistory> rawBetList) {
    // Collect betIds of above list
    Set<Long> rawBetIds = rawBetList.stream()
                                    .map(BetHistory::getBetId)
                                    .collect(Collectors.toSet());
    // Filter out finished bets in database (updated bets)
    Set<Long> unfinishedBetsInDatabase = this.betHistoryRepository.findAllById(rawBetIds)
                                                                  .stream()
                                                                  .filter(
                                                                      bet -> bet.getResult() == BetResult.NOT_FINISHED)
                                                                  .map(BetHistory::getBetId)
                                                                  .collect(Collectors.toSet());
    // List contains only unfinished bets in database that need to update result
    return rawBetList.stream()
                     .filter(bet -> unfinishedBetsInDatabase.contains(bet.getBetId()))
                     .collect(Collectors.toList());
  }

}
