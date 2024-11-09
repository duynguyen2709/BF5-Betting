package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.Player;
import bf5.betting.repository.PlayerRepository;
import bf5.betting.service.PlayerService;
import bf5.betting.util.JsonUtil;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author duynguyen
 **/
@Service
@RequiredArgsConstructor
@Log4j2
public class PlayerServiceImpl implements PlayerService {

  private final PlayerRepository playerRepository;
  private Map<String, Player> playerCacheMap;

  @PostConstruct
  void init() {
    this.playerCacheMap = playerRepository.findAll()
                                          .stream()
                                          .collect(Collectors.toMap(Player::getPlayerId, Function.identity()));

    log.info("Load PlayerCache Done: {}", JsonUtil.toJsonString(this.playerCacheMap));
  }

  @Override
  public Map<String, Player> getAllPlayer() {
    return this.playerCacheMap;
  }

  @Override
  @TryCatchWrap
  @Transactional
  public Player updatePlayerData(Player player) {
    Player newPlayer = this.playerRepository.save(player);
    this.playerCacheMap.put(player.getPlayerId(), player);
    return newPlayer;
  }

  @Override
  @TryCatchWrap
  @Transactional
  public Player updatePlayerProfitFromBetHistory(BetHistory betHistory) {
    if (Objects.isNull(betHistory.getActualProfit())) {
      return null;
    }
    Player player = this.playerCacheMap.get(betHistory.getPlayerId());
    long newTotalProfit = player.getTotalProfit() + betHistory.getActualProfit();
    player.setTotalProfit(newTotalProfit);
    return this.updatePlayerData(player);
  }

  @Override
  public List<Player> updatePlayerProfitFromListBetHistoryInBatch(List<BetHistory> betHistories) {
    if (betHistories.isEmpty()) {
      return new ArrayList<>();
    }
    betHistories.forEach(betHistory -> {
      if (betHistory.getActualProfit() != null) {
        Player player = this.playerCacheMap.get(betHistory.getPlayerId());
        long newTotalProfit = player.getTotalProfit() + betHistory.getActualProfit();
        player.setTotalProfit(newTotalProfit);
        this.playerCacheMap.put(betHistory.getPlayerId(), player);
      }
    });
    return this.updatePlayerDataBatch(this.playerCacheMap.values());
  }

  @Override
  @TryCatchWrap
  @Transactional
  public List<Player> updatePlayerDataBatch(Collection<Player> players) {
    List<Player> newPlayers = this.playerRepository.saveAll(players);
    newPlayers.forEach(player -> this.playerCacheMap.put(player.getPlayerId(), player));
    return newPlayers;
  }

  @Override
  public String getPlayerNameById(String id) {
    return this.playerCacheMap.get(id)
                              .getPlayerName();
  }
}
