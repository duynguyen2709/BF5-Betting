package bf5.betting.service.impl;

import bf5.betting.config.StatisticConfig;
import bf5.betting.constant.BetResult;
import bf5.betting.constant.PaymentAction;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.PlayerAssetHistory;
import bf5.betting.entity.response.BetHistoryStatisticResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.PlayerAssetHistoryService;
import bf5.betting.service.PlayerService;
import bf5.betting.service.StatisticService;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
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
public class StatisticServiceImpl implements StatisticService {

  private final BetHistoryService betHistoryService;
  private final PlayerAssetHistoryService assetHistoryService;
  private final PlayerService playerService;
  private final StatisticConfig statisticConfig;

  private static TreeMap<String, List<PlayerAssetHistory>> groupAssetHistoryByDate(
      List<PlayerAssetHistory> assetHistories) {
    TreeMap<String, List<PlayerAssetHistory>> mapAssetByDate = new TreeMap<>();
    assetHistories.stream()
                  .sorted(Comparator.comparingLong(o -> o.getRawPaymentTime()
                                                         .getTime()))
                  .forEach(ele -> {
                    String date = DateTimeUtil.timestampMsToSystemDateString(ele.getRawPaymentTime());
                    if (!mapAssetByDate.containsKey(date)) {
                      mapAssetByDate.put(date, new ArrayList<>());
                    }
                    mapAssetByDate.get(date)
                                  .add(ele);
                  });
    return mapAssetByDate;
  }

  private static List<List<PlayerAssetHistory>> groupAssetHistoryInDateByAction(
      List<PlayerAssetHistory> assetHistoriesInDate) {
    int current = 0;
    int subListIndex = 0;
    List<List<PlayerAssetHistory>> subListByAction = new ArrayList<>();
    subListByAction.add(new ArrayList<>());

    while (current < assetHistoriesInDate.size()) {
      if (assetHistoriesInDate.get(current)
                              .getAction() == PaymentAction.CASHOUT ||
          assetHistoriesInDate.get(current)
                              .getAction() == PaymentAction.DEPOSIT) {
        if (subListByAction.get(subListIndex)
                           .size() > 0) {
          subListByAction.add(new ArrayList<>());
          subListIndex++;
        }
        subListByAction.get(subListIndex)
                       .add(assetHistoriesInDate.get(current));
        subListByAction.add(new ArrayList<>());
        subListIndex++;
      } else {
        subListByAction.get(subListIndex)
                       .add(assetHistoriesInDate.get(current));
      }
      current++;
    }

    // Remove last sublist if empty (as we added new sublist even it's last element)
    if (subListByAction.get(subListIndex)
                       .isEmpty()) {
      subListByAction.remove(subListIndex);
    }
    return subListByAction;
  }

  private static List<BetHistoryStatisticResponse.AssetByDate> buildStatisticInDateList(
      List<List<PlayerAssetHistory>> subListByAction) {
    return subListByAction
        .stream()
        .map(assetChangeInDateGroup -> {
          PlayerAssetHistory lastChangeInDateGroup = assetChangeInDateGroup.get(
              assetChangeInDateGroup.size() - 1);
          return BetHistoryStatisticResponse.AssetByDate.builder()
                                                        .paymentTime(lastChangeInDateGroup.getPaymentTime())
                                                        .action(getAssetByDateAction(assetChangeInDateGroup))
                                                        .assetBefore(assetChangeInDateGroup.get(0)
                                                                                           .getAssetBefore())
                                                        .assetAfter(lastChangeInDateGroup.getAssetAfter())
                                                        .build();
        })
        .collect(Collectors.toList());
  }

  private static PaymentAction getAssetByDateAction(
      List<PlayerAssetHistory> assetChangeInDateGroup) {
    PlayerAssetHistory lastChangeInDateGroup = assetChangeInDateGroup.get(
        assetChangeInDateGroup.size() - 1);
    if (lastChangeInDateGroup.getAction() == PaymentAction.CASHOUT ||
        lastChangeInDateGroup.getAction() == PaymentAction.DEPOSIT) {
      return lastChangeInDateGroup.getAction();
    }
    long assetBefore = assetChangeInDateGroup.get(0)
                                             .getAssetBefore();
    long assetAfter = lastChangeInDateGroup.getAssetAfter();
    return (assetBefore <= assetAfter) ? PaymentAction.BET_WIN : PaymentAction.BET_LOST;
  }

  @Override
  public List<BetHistoryStatisticResponse.AssetByDate> statisticAssetByDate(
      List<PlayerAssetHistory> assetHistories) {
    if (assetHistories.isEmpty()) {
      return new ArrayList<>();
    }

    List<BetHistoryStatisticResponse.AssetByDate> statisticList = new ArrayList<>();
        /*
        This map contains all PlayerAssetHistory entity grouped by date key
         */
    TreeMap<String, List<PlayerAssetHistory>> mapAssetByDate = groupAssetHistoryByDate(
        assetHistories);

    mapAssetByDate.forEach((date, assetHistoriesInDate) -> {
            /*
            This list contains sublist of assetHistory in single date grouped by paymentAction
            Ex: WIN (A) - LOST (B) - CASHOUT (C) - WIN (D) - CASHOUT (E) - LOST [F] - LOST [G]
            => After construction, this list will contains:
            [ [A,B], [C], [D], [E], [F,G] ]
             */
      List<List<PlayerAssetHistory>> subListByAction = groupAssetHistoryInDateByAction(
          assetHistoriesInDate);
            /*
            This list contains last element flattened of above list that is converted to AssetByDate entity
            Ex: [ [A,B], [C], [D], [E], [F,G] ] => [ B, C, D, E, G]
             */
      List<BetHistoryStatisticResponse.AssetByDate> statisticInDateList = buildStatisticInDateList(
          subListByAction);
      statisticList.addAll(statisticInDateList);
    });

    return statisticList;
  }

  @Override
  @Transactional
  public void runStatisticForDateRange(String startDateStr, String endDateStr) {
    Map<String, PlayerAssetHistory> nearestAssetHistories = this.assetHistoryService.getNearestAssetHistoryForPlayers(
        startDateStr);
    Set<String> playerIds = this.playerService.getAllPlayer()
                                              .keySet();
    Map<String, Long> playerAssetMap = new HashMap<>();

    playerIds.forEach(playerId -> {
      if (nearestAssetHistories.containsKey(playerId)) {
        playerAssetMap.put(playerId, nearestAssetHistories.get(playerId)
                                                          .getAssetAfter());
      } else {
        log.warn("\nCan not find nearest asset history for player {} on date {}", playerId,
                 startDateStr);
        playerAssetMap.put(playerId,
                           statisticConfig.getPlayerBaseAsset()
                                          .getOrDefault(playerId, 0L));
      }
    });

    playerIds.forEach(playerId -> {
      List<PlayerAssetHistory> assetHistories = this.assetHistoryService.getByPlayerIdAndDateRange(
          playerId, startDateStr, endDateStr);
      List<BetHistory> betHistories = this.betHistoryService.getByPlayerIdAndDateRange(playerId,
                                                                                       startDateStr, endDateStr)
                                                            .stream()
                                                            .filter(
                                                                bet -> bet.getResult() != BetResult.NOT_FINISHED
                                                                    && bet.getResult() != BetResult.DRAW)
                                                            .sorted(
                                                                Comparator.comparingLong(o -> o.getResultSettledTime()
                                                                                               .getTime()))
                                                            .collect(Collectors.toList());

      for (BetHistory bet : betHistories) {
        PlayerAssetHistory assetHistory = PlayerAssetHistory.builder()
                                                            .playerId(bet.getPlayerId())
                                                            .betId(bet.getBetId())
                                                            .paymentTime(bet.getResultSettledTime())
                                                            .action(bet.getActualProfit() > 0 ? PaymentAction.BET_WIN
                                                                        : PaymentAction.BET_LOST)
                                                            .amount(bet.getActualProfit())
                                                            .assetBefore(0)
                                                            .assetAfter(0)
                                                            .build();
        assetHistories.add(assetHistory);
      }

      assetHistories.sort(Comparator.comparingLong(o -> o.getRawPaymentTime()
                                                         .getTime()));

      for (int i = 0; i < assetHistories.size(); i++) {
        PlayerAssetHistory current = assetHistories.get(i);
        if (current.getAction() == PaymentAction.BET_LOST
            || current.getAction() == PaymentAction.BET_WIN) {
          if (i == 0) {
            current.setAssetBefore(playerAssetMap.get(playerId));
            current.setAssetAfter(current.getAssetBefore() + current.getAmount());
          } else {
            current.setAssetBefore(assetHistories.get(i - 1)
                                                 .getAssetAfter());
            current.setAssetAfter(current.getAssetBefore() + current.getAmount());
          }
        }
      }

      log.info("Process inserting batch asset histories: {}",
               JsonUtil.toJsonString(assetHistories));
      this.assetHistoryService.insertBatch(assetHistories);
    });
  }
}
