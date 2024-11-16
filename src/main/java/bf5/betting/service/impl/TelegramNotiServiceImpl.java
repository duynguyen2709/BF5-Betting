package bf5.betting.service.impl;

import static bf5.betting.util.BetHistoryUtil.formatVnBetEvent;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetType;
import bf5.betting.constant.Constant;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.entity.jpa.Player;
import bf5.betting.entity.request.TelegramMessageRequest;
import bf5.betting.service.PlayerService;
import bf5.betting.service.TelegramNotiService;
import bf5.betting.util.JsonUtil;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.apache.hc.client5.http.fluent.Request;
import org.apache.hc.core5.http.ContentType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class TelegramNotiServiceImpl implements TelegramNotiService {

  private static final String API_URL = "https://api.telegram.org/bot6784881463:AAGc5VmQNw_BEazOuTTV7DYpPFefMb_Ieks/sendMessage";
  private final PlayerService playerService;

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
    Request httpRequest = Request.post(API_URL)
                                 .bodyString(JsonUtil.toJsonString(request), ContentType.APPLICATION_JSON);

    String rawResponse = httpRequest.execute()
                                    .returnContent()
                                    .asString();
    log.info("[{}] Send Telegram message result: {}", player.getPlayerName(), rawResponse);
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
                 isAccumulatorBet ? String.format(" `%,d VNĐ`", entry.getValue()
                                                                     .get(0)
                                                                     .getBetAmount())
                     : "")
             .append("\n");

      for (BetHistory betHistory : entry.getValue()) {
        for (BetMatchDetail detail : betHistory.getEvents()) {
          content.append("\\* ")
                 .append(isAccumulatorBet ? getTeamFaceToFace(detail) + ": " : "")
                 .append(formatVnBetEvent(detail))
                 .append(
                     !isAccumulatorBet ? String.format("  ||  `%,d VNĐ`",
                                                       betHistory.getBetAmount()) : "")
                 .append("\n");
        }
      }
      content.append("\n");
    }
    sendNotification(userId, content.toString());
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
                   isAccumulatorBet ? String.format(" %s `%,d đ`",
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
                       !isAccumulatorBet ? String.format("  || %s `%,d đ`",
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
      this.sendNotification(Constant.ADMIN_USER_ID, content.toString()
                                                           .replace("{{playerName}}", String.format("         *%s*",
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
    this.sendNotification(Constant.ADMIN_USER_ID, String.format("❗ *Đã xảy ra lỗi hệ thống* ❗\n%s", error));
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
