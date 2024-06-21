package bf5.betting.job;

import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.repository.BetHistoryRepository;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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

    private final Cache<Long, Boolean> updatedBetsCache = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.DAYS)
            .build();


    @PostConstruct
    void scheduleJob() {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(this::run,
                0,
                TimeUnit.MINUTES.toSeconds(15),
                TimeUnit.SECONDS);
    }

    private void run() {
        log.info("\n\n======================================== Running scheduled auto update bet result job at {} ========================================", DateTimeUtil.now());

        try {
            // Get list raw bets that finished
            List<BetHistory> rawBetHistoryList = rawBetService.getListBetForAutoUpdater()
                    .stream()
                    .filter(this::isRawBetFinishedAndNotProcessed)
                    .collect(Collectors.toList());
            if (rawBetHistoryList.isEmpty()) {
                log.info("List bet history is empty => Skipped this run");
                return;
            }

            List<BetHistory> toBeUpdatedBetHistories = filterUnfinishedBetsInDatabase(rawBetHistoryList);
            if (toBeUpdatedBetHistories.isEmpty()) {
                log.info("List bet history to be updated is empty => Skipped this run");
                return;
            }

            this.betHistoryService.updateBatchBetResultFromRaw(toBeUpdatedBetHistories);

            updateCache(toBeUpdatedBetHistories);
        } catch (Exception ex) {
            log.error("Exception occurred when running auto update bet results job: {}", ex.getMessage(), ex);
        } finally {
            log.info("\n========================================  Finish scheduled auto update bet result job at {} ========================================\n", DateTimeUtil.now());
        }
    }

    private List<BetHistory> filterUnfinishedBetsInDatabase(List<BetHistory> rawBetList) {
        // Collect betIds of above list
        Set<Long> betIds = rawBetList.stream().map(BetHistory::getBetId).collect(Collectors.toSet());
        log.info("List raw betId had final result: {}, size {}", JsonUtil.toJsonString(betIds), betIds.size());

        // Filter out finished bets in database (updated bets)
        Set<Long> unfinishedBetsInDatabase = this.betHistoryRepository.findAllById(betIds)
                .stream()
                .filter(bet -> bet.getResult() == BetResult.NOT_FINISHED)
                .map(BetHistory::getBetId)
                .collect(Collectors.toSet());
        log.info("List unfinished betId in database: {}, size {}", JsonUtil.toJsonString(unfinishedBetsInDatabase), unfinishedBetsInDatabase.size());

        // List contains only unfinished bets in database that need to update result
        rawBetList = rawBetList.stream()
                .filter(bet -> unfinishedBetsInDatabase.contains(bet.getBetId()))
                .collect(Collectors.toList());
        return rawBetList;
    }

    private boolean isRawBetFinishedAndNotProcessed(BetHistory rawBet) {
        return (rawBet.getResult() != BetResult.NOT_FINISHED && Objects.isNull(updatedBetsCache.getIfPresent(rawBet.getBetId())));
    }

    private void updateCache(List<BetHistory> betHistories) {
        betHistories.forEach(bet -> {
            updatedBetsCache.put(bet.getBetId(), true);
            log.info("Add betId {} into updated cache", bet.getBetId());
        });
    }
}
