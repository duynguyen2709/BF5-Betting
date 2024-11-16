package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.jpa.ServerConfig;
import bf5.betting.repository.ServerConfigRepository;
import bf5.betting.service.ServerConfigService;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


/**
 * @author duynguyen
 **/
@Service
@Log4j2
@RequiredArgsConstructor
public class ServerConfigServiceImpl implements ServerConfigService {

  enum ServerConfigKey {
    AUTO_UPDATER_INTERVAL_MINUTES,
    BET_HISTORY_API_URL,
    LAST_ACTIVE_SESSION_TOKEN,
  }

  private final ServerConfigRepository serverConfigRepo;
  private Map<String, String> serverConfigMap;

  @PostConstruct
  private void init() {
    serverConfigMap = new HashMap<>();
    serverConfigRepo.findAll()
                    .forEach(serverConfig -> {
                      serverConfigMap.put(serverConfig.getConfigKey(), serverConfig.getConfigValue());
                    });
    log.info("\n======================================== Server Configs ========================================\n{}\n",
             serverConfigMap.entrySet()
                            .stream()
                            .map(entry -> entry.getKey() + " -> " + entry.getValue())
                            .collect(Collectors.joining("\n"))
            );
  }

  @Override
  public String getLastActiveToken() {
    return serverConfigMap.get(ServerConfigKey.LAST_ACTIVE_SESSION_TOKEN.name());
  }

  @Override
  @TryCatchWrap
  @Async
  public void setLastActiveToken(String newToken) {
    serverConfigMap.put(ServerConfigKey.LAST_ACTIVE_SESSION_TOKEN.name(), newToken);
    log.info("Set new active session token to {}", newToken);

    ServerConfig tokenEntity = ServerConfig.builder()
                                           .configKey(ServerConfigKey.LAST_ACTIVE_SESSION_TOKEN.name())
                                           .configValue(newToken)
                                           .build();
    this.serverConfigRepo.save(tokenEntity);
  }

  @Override
  public int getAutoUpdaterIntervalMinutes() {
    return Integer.parseInt(this.serverConfigMap.get(ServerConfigKey.AUTO_UPDATER_INTERVAL_MINUTES.name()));
  }

  @Override
  public String getBetHistoryApiUrl() {
    return this.serverConfigMap.get(ServerConfigKey.BET_HISTORY_API_URL.name());
  }
}
