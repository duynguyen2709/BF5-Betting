package bf5.betting.job;

import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import bf5.betting.util.DateTimeUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
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

    @PostConstruct
    void scheduleJob() {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(this::run,
                0,
                TimeUnit.HOURS.toSeconds(2),
                TimeUnit.SECONDS);
    }

    private void run() {
        log.info("\n================================ Running scheduled auto update bet result job at {} ================================", DateTimeUtil.now());

        try {
            List<BetHistory> betHistories = rawBetService.getListBetForAutoUpdater()
                    .stream()
                    .filter(bet -> bet.getResult() != BetResult.NOT_FINISHED)
                    .collect(Collectors.toList());
            if (betHistories.isEmpty()) {
                log.info("List bet history is empty => Skipped this run");
                return;
            }

            this.betHistoryService.updateBatchBetResultFromRaw(betHistories);
        } catch (Exception ex) {
            log.error("Exception occurred when running auto update bet results job: {}", ex.getMessage(), ex);
        } finally {
            log.info("\n================================  Finish scheduled auto update bet result job at {} ================================\n", DateTimeUtil.now());
        }
    }
}
