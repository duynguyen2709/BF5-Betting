package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetResult;
import bf5.betting.constant.PaymentAction;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.Player;
import bf5.betting.entity.jpa.PlayerAssetHistory;
import bf5.betting.entity.request.AddPlayerAssetHistoryRequest;
import bf5.betting.repository.PlayerAssetHistoryRepository;
import bf5.betting.service.PlayerAssetHistoryService;
import bf5.betting.service.PlayerService;
import bf5.betting.util.DateTimeUtil;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class PlayerAssetHistoryServiceImpl implements PlayerAssetHistoryService {

  private final PlayerAssetHistoryRepository repository;
  private final PlayerService playerService;

  @Override
  @TryCatchWrap
  @Transactional
  public List<PlayerAssetHistory> insertBatch(Collection<PlayerAssetHistory> list) {
    return this.repository.saveAll(list);
  }

  @Override
  @TryCatchWrap
  @Transactional
  public PlayerAssetHistory updateAssetFromBetHistory(BetHistory betHistory) {
    if (betHistory.getResult() == BetResult.NOT_FINISHED
        || betHistory.getResult() == BetResult.DRAW) {
      return null;
    }

    Map<String, Player> playerAsset = this.playerService.getAllPlayer();
    long assetAfter =
        playerAsset.get(betHistory.getPlayerId())
                   .getTotalProfit() + betHistory.getActualProfit();
    PlayerAssetHistory assetHistory = PlayerAssetHistory.builder()
                                                        .playerId(betHistory.getPlayerId())
                                                        .betId(betHistory.getBetId())
                                                        .paymentTime(betHistory.getResultSettledTime())
                                                        .action(betHistory.getActualProfit() > 0 ? PaymentAction.BET_WIN
                                                                    : PaymentAction.BET_LOST)
                                                        .amount(betHistory.getActualProfit())
                                                        .assetBefore(playerAsset.get(betHistory.getPlayerId())
                                                                                .getTotalProfit())
                                                        .assetAfter(assetAfter)
                                                        .build();

    return this.repository.save(assetHistory);
  }

  @Override
  @TryCatchWrap
  @Transactional
  public List<PlayerAssetHistory> updateAssetFromBetHistoryListInBatch(
      List<BetHistory> betHistories) {
    List<BetHistory> finishedBets = betHistories.stream()
                                                .filter(
                                                    bet -> bet.getResult() != BetResult.NOT_FINISHED
                                                        && bet.getResult() != BetResult.DRAW)
                                                .collect(Collectors.toList());
    if (finishedBets.isEmpty()) {
      return new ArrayList<>();
    }

    finishedBets.sort(Comparator.comparingLong(o -> o.getResultSettledTime()
                                                     .getTime()));
    List<PlayerAssetHistory> assetHistories = new ArrayList<>();
    Map<String, Long> playerAsset = this.playerService.getAllPlayer()
                                                      .values()
                                                      .stream()
                                                      .collect(Collectors.toMap(Player::getPlayerId,
                                                                                Player::getTotalProfit));

    for (BetHistory bet : finishedBets) {
      long assetAfter = playerAsset.get(bet.getPlayerId()) + bet.getActualProfit();
      PlayerAssetHistory assetHistory = PlayerAssetHistory.builder()
                                                          .playerId(bet.getPlayerId())
                                                          .betId(bet.getBetId())
                                                          .paymentTime(bet.getResultSettledTime())
                                                          .action(bet.getActualProfit() > 0 ? PaymentAction.BET_WIN
                                                                      : PaymentAction.BET_LOST)
                                                          .amount(bet.getActualProfit())
                                                          .assetBefore(playerAsset.get(bet.getPlayerId()))
                                                          .assetAfter(assetAfter)
                                                          .build();
      assetHistories.add(assetHistory);

      playerAsset.put(bet.getPlayerId(), assetAfter);
    }

    return this.repository.saveAll(assetHistories);
  }

  @Override
  public List<PlayerAssetHistory> getAll() {
    return this.repository.findAll();
  }

  @Override
  public List<PlayerAssetHistory> getByPlayerIdAndDateRange(String playerId, String startDateStr,
      String endDateStr) {
    Date startDate = DateTimeUtil.stringToDate(startDateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
    Date afterEndDate = DateTimeUtil.getNextDate(endDateStr);
    return this.repository.findByPlayerIdAndDateRange(playerId, startDate, afterEndDate);
  }

  @Override
  public Map<String, PlayerAssetHistory> getNearestAssetHistoryForPlayers(String dateStr) {
    Date date = DateTimeUtil.stringToDate(dateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
    return this.repository.findNearestToDateRangeGroupByPlayerId(date)
                          .stream()
                          .collect(Collectors.toMap(PlayerAssetHistory::getPlayerId, Function.identity()));
  }

  @Override
  @Transactional
  public void deleteByDateRange(String startDateStr, String endDateStr) {
    Date startDate = DateTimeUtil.stringToDate(startDateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
    Date afterEndDate = DateTimeUtil.getNextDate(endDateStr);
    Set<String> playerIds = playerService.getAllPlayer()
                                         .keySet();
    List<PlayerAssetHistory> assetHistories = playerIds.stream()
                                                       .map(id -> this.repository.findByPlayerIdAndDateRange(id,
                                                                                                             startDate,
                                                                                                             afterEndDate))
                                                       .flatMap(List::stream)
                                                       .collect(Collectors.toList());
    this.repository.deleteAllInBatch(assetHistories);
  }

  @Override
  @TryCatchWrap
  @Transactional
  public PlayerAssetHistory insertPaymentHistory(AddPlayerAssetHistoryRequest request) {
    Map<String, Player> playerCacheMap = this.playerService.getAllPlayer();
    String playerId = request.getPlayerId();
    long actualAmount =
        request.getAction()
               .equals(PaymentAction.CASHOUT.name()) ? -request.getAmount()
            : request.getAmount();
    long assetBefore = playerCacheMap.get(playerId)
                                     .getTotalProfit();
    long assetAfter = assetBefore + actualAmount;

    Player player = playerCacheMap.get(playerId);
    player.setTotalProfit(assetAfter);
    playerService.updatePlayerData(player);

    PlayerAssetHistory assetHistory = PlayerAssetHistory.builder()
                                                        .playerId(playerId)
                                                        .paymentTime(new Timestamp(System.currentTimeMillis()))
                                                        .action(PaymentAction.valueOf(request.getAction()))
                                                        .paymentMethod(request.getPaymentMethod())
                                                        .amount(actualAmount)
                                                        .assetBefore(assetBefore)
                                                        .assetAfter(assetAfter)
                                                        .build();
    return this.repository.save(assetHistory);
  }
}
