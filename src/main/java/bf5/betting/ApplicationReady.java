package bf5.betting;

import bf5.betting.service.ServerConfigService;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.stereotype.Component;
//

/// **
// * @author duynguyen
// */
@AllArgsConstructor
@Log4j2
@Component
public class ApplicationReady {

  private final ConfigurableEnvironment configurableEnvironment;

  private final ServerConfigService serverConfigService;

  @EventListener(ApplicationReadyEvent.class)
  public void init() {
    showConfiguration();
  }

  private void showConfiguration() {
    log.info("##################### Show Configuration #####################");
    List<MapPropertySource> propertySources = new ArrayList<>();
    configurableEnvironment.getPropertySources()
                           .forEach((it) -> {
                             if (it instanceof MapPropertySource && it.getName()
                                                                      .contains("application.yaml")) {
                               propertySources.add((MapPropertySource) it);
                             }
                           });

    propertySources.stream()
                   .map((propertySource) ->
                            ((Map) propertySource.getSource()).keySet())
                   .flatMap(Collection::stream)
                   .distinct()
                   .sorted()
                   .forEach((key) -> {
                     try {
                       log.info(key + "=" + configurableEnvironment.getProperty(String.valueOf(key)));
                     } catch (Exception var3) {
                       log.warn("{} -> {}", key, var3.getMessage());
                     }
                   });
    log.info("##################### End show Configuration #####################");

    log.info("Current token: {}", serverConfigService.getLastActiveToken());
    ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    // Schedule the task to run after 10 seconds
    scheduler.schedule(() -> {
      log.info("Running task after 10 seconds delay");
      serverConfigService.setLastActiveToken("123");
      // Put the code you want to execute here
    }, 10, TimeUnit.SECONDS);
    // Schedule the task to run after 10 seconds

    scheduler.schedule(() -> {
      log.info("Running task after 20 seconds delay");
      log.info("Current token: {}", serverConfigService.getLastActiveToken());
      // Put the code you want to execute here
    }, 20, TimeUnit.SECONDS);

    // Optionally, shutdown the scheduler if you don't need it anymore
//    scheduler.shutdown();
  }

}
