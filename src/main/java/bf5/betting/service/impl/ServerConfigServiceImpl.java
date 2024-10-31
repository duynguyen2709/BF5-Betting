package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.ServerConfigKey;
import bf5.betting.repository.ServerConfigRepository;
import bf5.betting.service.ServerConfigService;
import java.util.EnumMap;
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

  private final ServerConfigRepository serverConfigRepo;
  private EnumMap<ServerConfigKey, String> serverConfigMap;

  @PostConstruct
  private void init() {
    serverConfigMap = new EnumMap<>(ServerConfigKey.class);
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
    return serverConfigMap.get(ServerConfigKey.LAST_ACTIVE_SESSION_TOKEN);
  }

  @Override
  @Async
  @TryCatchWrap
  public void setLastActiveToken(String newToken) {
    serverConfigMap.put(ServerConfigKey.LAST_ACTIVE_SESSION_TOKEN, newToken);
    log.info("Set new active session token to {}", newToken);

    var tokenEntity = this.serverConfigRepo.getReferenceById(ServerConfigKey.LAST_ACTIVE_SESSION_TOKEN);
    tokenEntity.setConfigValue(newToken);
    this.serverConfigRepo.save(tokenEntity);
  }

  @Override
  public int getAutoUpdaterIntervalMinutes() {
    return Integer.parseInt(this.serverConfigMap.get(ServerConfigKey.AUTO_UPDATER_INTERVAL_MINUTES));
  }

  @Override
  public String getBetHistoryApiUrl() {
    return this.serverConfigMap.get(ServerConfigKey.BET_HISTORY_API_URL);
  }
}
