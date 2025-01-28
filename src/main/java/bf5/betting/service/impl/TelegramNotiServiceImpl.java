package bf5.betting.service.impl;

import static bf5.betting.constant.Constant.ADMIN_USER_ID;
import static bf5.betting.util.BetHistoryUtil.formatVnBetEvent;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetType;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.entity.jpa.Player;
import bf5.betting.entity.request.TelegramMessageRequest;
import bf5.betting.service.PlayerService;
import bf5.betting.service.TelegramNotiService;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.RequestUtil;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class TelegramNotiServiceImpl implements TelegramNotiService {

  private static final String API_URL = "https://api.telegram.org/bot6784881463:AAGc5VmQNw_BEazOuTTV7DYpPFefMb_Ieks/sendMessage";
  private final PlayerService playerService;
  private final RestTemplate httpClient;
  private final RetryTemplate retryTemplate;

  @PostConstruct
  void announceStart() {
    this.sendNotification(ADMIN_USER_ID,
                          String.format("\uD83D\uDD0B *Service đã khởi chạy lúc:* `%s` ", DateTimeUtil.now()));
  }

  @TryCatchWrap
  @SneakyThrows
  private void sendNotification(String userId, String text) {
    Player player = playerService.getAllPlayer()
                                 .get(userId);
    if (player == null) {
      log.error("Player info for user {} not found", userId);
      return;
    }
    String telegramId = player.getTelegramId();
    if (StringUtils.isBlank(telegramId)) {
      log.warn("TelegramID for user {} ({}) is empty", player.getPlayerName(), userId);
      return;
    }

    TelegramMessageRequest request = TelegramMessageRequest.build(telegramId, text);
    retryTemplate.execute(retryContext -> {
      try {
        return httpClient.postForObject(API_URL, request, Object.class);
      } catch (HttpStatusCodeException ex) {
        if (ex.getStatusCode()
              .is4xxClientError()) {
          log.error("[TelegramNoti] Skipping retry due to 4xx client error: {}", RequestUtil.getDetailedMessage(ex));
          return null;
        } else {
          log.warn("[TelegramNoti] Retry request #{}, last exception: {}", retryContext.getRetryCount(),
                   RequestUtil.getDetailedMessage(ex));
          throw ex;
        }
      }
    }, retryContext -> {
      log.error("[TelegramNoti] All retry attempts failed: {}",
                RequestUtil.getDetailedMessage(retryContext.getLastThrowable()));
      return null;
    });
  }

  @Override
  @Async
  public void sendNotificationForNewBetAdded(String userId, List<BetHistory> betHistoryList) {
    int accumulatorBetIndex = 1;
    Map<String, List<BetHistory>> mapBetByType = new HashMap<>();
    for (BetHistory betHistory : betHistoryList) {
      if (betHistory.getBetType() == BetType.ACCUMULATOR) {
        mapBetByType.put(String.format("Cược xiên #%s", accumulatorBetIndex++),
                         Collections.singletonList(betHistory));
        continue;
      }

      BetMatchDetail detail = betHistory.getEvents()
                                        .get(0);
      String betKey = getTeamFaceToFace(detail);

      mapBetByType.putIfAbsent(betKey, new ArrayList<>());
      mapBetByType.get(betKey)
                  .add(betHistory);
    }

    StringBuilder content = new StringBuilder();
    content.append(String.format("*✅ Đã thêm %s phiếu cược mới*", betHistoryList.size()))
           .append("\n")
           .append("---------------------------------------------")
           .append("\n");

    for (Map.Entry<String, List<BetHistory>> entry : mapBetByType.entrySet()) {
      String teamsKey = entry.getKey();
      boolean isAccumulatorBet = isAccumulator(teamsKey);
      content.append("*")
             .append(teamsKey)
             .append("*")
             .append(":")
             .append(
                 isAccumulatorBet ? String.format(" `%,d đ` || Tỉ lệ: %.2f", entry.getValue()
                                                                                  .get(0)
                                                                                  .getBetAmount(),
                                                  entry.getValue()
                                                       .get(0)
                                                       .getRatio())
                     : "")
             .append("\n");

      for (BetHistory betHistory : entry.getValue()) {
        for (BetMatchDetail detail : betHistory.getEvents()) {
          content.append("\\* ")
                 .append(isAccumulatorBet ? getTeamFaceToFace(detail) + ": " : "")
                 .append(formatVnBetEvent(detail))
                 .append(
                     !isAccumulatorBet ? String.format("  ||  `%,dđ` || Tỉ lệ: %.2f",
                                                       betHistory.getBetAmount(), betHistory.getRatio())
                         : "")
                 .append("\n");
        }
      }
      content.append("\n");
    }
    sendNotification(userId, content.toString());

    if (!userId.equals(ADMIN_USER_ID)) {
      String newContent = String.format("%s\n=================================\n%s",
                                        playerService.getPlayerNameById(userId), content);
      sendNotification(ADMIN_USER_ID, newContent);
    }
  }

  @Override
  @Async
  public void sendNotiForBetResultUpdated(List<BetHistory> betHistoryList) {
    Map<String, Integer> accumulatorBetIndexMap = new HashMap<>();
    Map<String, Map<String, List<BetHistory>>> mapBetOfPlayerByType = new HashMap<>();

    for (BetHistory betHistory : betHistoryList) {
      mapBetOfPlayerByType.putIfAbsent(betHistory.getPlayerId(), new HashMap<>());
      accumulatorBetIndexMap.putIfAbsent(betHistory.getPlayerId(), 1);

      Map<String, List<BetHistory>> mapBetByType = mapBetOfPlayerByType.get(
          betHistory.getPlayerId());
      if (betHistory.getBetType() == BetType.ACCUMULATOR) {
        int index = accumulatorBetIndexMap.get(betHistory.getPlayerId()) + 1;
        mapBetByType.put(String.format("Cược xiên #%s", index),
                         Collections.singletonList(betHistory));
        accumulatorBetIndexMap.put(betHistory.getPlayerId(), index);
        continue;
      }

      BetMatchDetail detail = betHistory.getEvents()
                                        .get(0);
      String betKey = getTeamFaceToFace(detail);

      mapBetByType.putIfAbsent(betKey, new ArrayList<>());
      mapBetByType.get(betKey)
                  .add(betHistory);
    }

    for (Map.Entry<String, Map<String, List<BetHistory>>> playerEntry : mapBetOfPlayerByType.entrySet()) {
      StringBuilder content = new StringBuilder();
      content.append(
                 String.format("*✅ Đã cập nhật kết quả %s phiếu cược*", playerEntry.getValue()
                                                                                   .size()))
             .append("\n")
             .append("---------------------------------------------")
             .append("\n");

      content.append("{{playerName}}")
             .append("\n");

      Map<String, List<BetHistory>> mapBetByType = playerEntry.getValue();
      for (Map.Entry<String, List<BetHistory>> entry : mapBetByType.entrySet()) {
        String teamsKey = entry.getKey();
        boolean isAccumulatorBet = isAccumulator(teamsKey);
        content.append("*")
               .append(teamsKey)
               .append("*")
               .append(":")
               .append(
                   isAccumulatorBet ? String.format("%s %s  `%,dđ`",
                                                    entry.getValue()
                                                         .get(0)
                                                         .getResult()
                                                         .getSymbol(),
                                                    entry.getValue()
                                                         .get(0)
                                                         .getResult()
                                                         .getVnDescriptionText(),
                                                    Math.abs(entry.getValue()
                                                                  .get(0)
                                                                  .getActualProfit())) : "")
               .append("\n");

        for (BetHistory betHistory : entry.getValue()) {
          for (BetMatchDetail detail : betHistory.getEvents()) {
            content.append("\\* ")
                   .append(isAccumulatorBet ? getTeamFaceToFace(detail) + ": " : "")
                   .append(formatVnBetEvent(detail))
                   .append(
                       !isAccumulatorBet ? String.format("  || %s %s  `%,dđ`",
                                                         betHistory.getResult()
                                                                   .getSymbol(),
                                                         betHistory.getResult()
                                                                   .getVnDescriptionText(),
                                                         Math.abs(betHistory.getActualProfit())) : "")
                   .append("\n");
          }
        }
      }
      content.append("-----------------------------------------------\n");

      String playerId = playerEntry.getKey();
      // Send to admin
      this.sendNotification(ADMIN_USER_ID, content.toString()
                                                  .replace("{{playerName}}", String.format("                  *%s*",
                                                                                           playerService.getPlayerNameById(
                                                                                               playerId))));
      // Send to player
      this.sendNotification(playerId, content.toString()
                                             .replace("{{playerName}}", ""));
    }
  }

  @Override
  @Async
  public void sendExceptionAlert(String error) {
    this.sendNotification(ADMIN_USER_ID, String.format("❗ *Đã xảy ra lỗi hệ thống* ❗\n%s", error));
  }

  private String getTeamFaceToFace(BetMatchDetail detail) {
    StringBuilder teams = new StringBuilder(detail.getFirstTeam());
    String secondTeam = detail.getSecondTeam();
    if (StringUtils.isNotBlank(secondTeam)) {
      teams.append(" - ")
           .append(secondTeam);
    }
    return teams.toString();
  }

  private boolean isAccumulator(String name) {
    return name.startsWith("Cược xiên");
  }
}
