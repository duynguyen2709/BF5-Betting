package bf5.betting.bot;

import static bf5.betting.util.BetHistoryUtil.formatVnBetEvent;

import bf5.betting.constant.BetType;
import bf5.betting.constant.Constant;
import bf5.betting.constant.RawBetStatus;
import bf5.betting.constant.TelegramCommand;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.entity.jpa.Player;
import bf5.betting.service.AsyncService;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.PlayerService;
import bf5.betting.service.RawBetService;
import bf5.betting.service.ServerConfigService;
import bf5.betting.util.DateTimeUtil;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.AnswerCallbackQuery;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageReplyMarkup;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

/**
 * @author duynguyen
 **/
@Component
@Log4j2
public class TelegramBot extends TelegramLongPollingBot {

  private static final String RECENT_BETS_CACHE_KEY = "RECENT-BETS";
  private final Cache<String, List<BetHistory>> betHistoryCache = Caffeine.newBuilder()
                                                                          .expireAfterWrite(5, TimeUnit.MINUTES)
                                                                          .build();
  @Autowired
  private RawBetService rawBetService;
  @Autowired
  private PlayerService playerService;
  @Autowired
  private BetHistoryService betHistoryService;
  @Autowired
  private AsyncService asyncService;
  @Autowired
  private ServerConfigService serverConfigService;
  private Integer MESSAGE_ID_CACHE;
  private Long CHAT_ID_CACHE;


  public TelegramBot() {
    super("6784881463:AAGc5VmQNw_BEazOuTTV7DYpPFefMb_Ieks");
  }

  @Override
  public String getBotUsername() {
    return "bf5_betting_bot";
  }

  @Override
  public void onUpdateReceived(Update update) {
    if (update.hasCallbackQuery()) {
      String playerId = update.getCallbackQuery()
                              .getData();
      long chatId = update.getCallbackQuery()
                          .getMessage()
                          .getChatId();

      Player player = playerService.getAllPlayer()
                                   .get(playerId);
      if (player == null) {
        log.error("Callback playerId invalid: {}", playerId);
        return;
      }

      List<BetHistory> betHistoryList = betHistoryCache.getIfPresent(RECENT_BETS_CACHE_KEY);
      if (betHistoryList == null || betHistoryList.isEmpty()) {
        log.error("Cached bet history list is empty");
        return;
      }

      String resultMessage;
      try {
        betHistoryList.forEach(e -> e.setPlayerId(playerId));
        betHistoryService.insertBetInBatch(betHistoryList);
        betHistoryCache.invalidate(RECENT_BETS_CACHE_KEY);
        resultMessage = String.format("*Đã thêm %s phiếu cược cho %s thành công*",
                                      betHistoryList.size(), player.getPlayerName());
      } catch (Exception e) {
        log.error(e);
        resultMessage = "*Đã có lỗi khi thêm danh sách cược*\n" + e.getMessage();
      }

      try {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(resultMessage);
        message.setParseMode("Markdown");
        execute(message);

        AnswerCallbackQuery answerCall = new AnswerCallbackQuery();
        answerCall.setCallbackQueryId(update.getCallbackQuery()
                                            .getId());
        answerCall.setShowAlert(false);
        execute(answerCall);

        EditMessageReplyMarkup editMessageReplyMarkup = new EditMessageReplyMarkup();
        editMessageReplyMarkup.setChatId(CHAT_ID_CACHE);
        editMessageReplyMarkup.setMessageId(MESSAGE_ID_CACHE);
        editMessageReplyMarkup.setReplyMarkup(null);
        execute(editMessageReplyMarkup);

        CHAT_ID_CACHE = null;
        MESSAGE_ID_CACHE = null;
      } catch (TelegramApiException e) {
        log.error(e);
      }
    } else if (update.hasMessage() && update.getMessage()
                                            .hasText()) {
      Long fromUserId = update.getMessage()
                              .getFrom()
                              .getId();
      if (fromUserId != Constant.ADMIN_TELEGRAM_ID) {
        log.warn("[TelegramBot] Received message from unknown user with id {}, username {}", fromUserId,
                 update.getMessage()
                       .getFrom()
                       .getUserName());
        return;
      }

      String messageText = update.getMessage()
                                 .getText();
      log.info("[TelegramBot] Received message: {}", messageText);

      long chatId = update.getMessage()
                          .getChatId();

      String replyMessageText = "";
      boolean shouldDisplayActions = false;
      if (messageText.equals(TelegramCommand.QUICK_ADD.getCommand())) {
        try {
          SendMessage processingMessage = new SendMessage();
          processingMessage.setChatId(chatId);
          processingMessage.setText("*Đang lấy danh sách phiếu cược gần đây*...");
          processingMessage.setParseMode("Markdown");
          execute(processingMessage);

          List<BetHistory> rawBets = rawBetService.quickGetLast30MinutesBets(serverConfigService.getLastActiveToken());
          Set<Long> insertBetIds = this.betHistoryService.getByBetIds(rawBets.stream()
                                                                             .map(BetHistory::getBetId)
                                                                             .collect(Collectors.toList()))
                                                         .stream()
                                                         .map(BetHistory::getBetId)
                                                         .collect(Collectors.toSet());
          List<BetHistory> betHistories = rawBets.stream()
                                                 .filter(bet -> !insertBetIds.contains(bet.getBetId()))
                                                 .collect(Collectors.toList());
          if (betHistories.isEmpty()) {
            replyMessageText = "*Không có phiếu cược mới cần thêm*";
          } else {
            betHistoryCache.put(RECENT_BETS_CACHE_KEY, betHistories);
            replyMessageText = formatRecentBetsContent(betHistories);
            shouldDisplayActions = true;
          }
        } catch (Exception e) {
          replyMessageText = e.getMessage();
        }
      } else if (messageText.equals(TelegramCommand.TOKEN.getCommand())) {
        replyMessageText = serverConfigService.getLastActiveToken();
        if (replyMessageText.isEmpty()) {
          replyMessageText = "*Token rỗng*";
        }
      } else if (messageText.startsWith(TelegramCommand.QUICK_UPDATE.getCommand())) {
        String[] parts = messageText.split(" ");
        int day = Optional.ofNullable(parts.length > 1 ? parts[1] : null)
                          .map(part -> {
                            try {
                              return Integer.parseInt(part);
                            } catch (NumberFormatException e) {
                              return null;
                            }
                          })
                          .orElse(1);

        String today = DateTimeUtil.getDateStringFromToday(0);
        String yesterday = DateTimeUtil.getDateStringFromToday(-1 * day);
        List<BetHistory> betHistories = rawBetService.getAllBetWithConvert(
            serverConfigService.getLastActiveToken(), yesterday, today);
        List<BetHistory> betToBeUpdated = betHistories.stream()
                                                      .filter(ele -> ele.getRawStatus()
                                                                        .equals(
                                                                            RawBetStatus.RESULT_READY_TO_BE_UPDATED.name()))
                                                      .collect(Collectors.toList());
        if (betToBeUpdated.isEmpty()) {
          replyMessageText = "*Không có cược cần cập nhật*";
        } else {
          // Running this async so it does not affect current reply flow of Telegram
          asyncService.updateBetResultFromTelegram(betToBeUpdated);
          replyMessageText = String.format("*Đang cập nhật kết quả cho %d phiếu cược...*",
                                           betToBeUpdated.size());
        }
      } else if (messageText.startsWith(TelegramCommand.SET_TOKEN.getCommand())) {
        String[] parts = messageText.split(" ");
        if (parts.length < 2) {
          replyMessageText = "*Vui lòng nhập token*";
        } else {
          String token = parts[1];
          serverConfigService.setLastActiveToken(token);
          replyMessageText = "*Đã cập nhật token mới*";
        }
      }

      if (replyMessageText.isEmpty()) {
        replyMessageText = "*Nội dung phản hồi rỗng*";
      }

      try {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(replyMessageText);
        message.setParseMode("Markdown");

        if (shouldDisplayActions) {
          var buttons = playerService.getAllPlayer()
                                     .values()
                                     .stream()
                                     .map(player ->
                                              List.of(InlineKeyboardButton.builder()
                                                                          .text(player.getPlayerName())
                                                                          .callbackData(player.getPlayerId())
                                                                          .build())
                                         )
                                     .collect(Collectors.toList());
          message.setReplyMarkup(new InlineKeyboardMarkup(buttons));
        }
        Message result = execute(message);
        if (result != null) {
          MESSAGE_ID_CACHE = result.getMessageId();
          CHAT_ID_CACHE = result.getChatId();
        }

      } catch (TelegramApiException e) {
        String detailMessage = StringUtils.substringBefore(e.getMessage(), "; nested exception is");
        log.error("[TelegramBot] Error happened: {}", detailMessage);
      }
    }
  }

  private String formatRecentBetsContent(List<BetHistory> betHistoryList) {
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
    content.append(String.format("*✅ Danh sách %s phiếu cược mới*", betHistoryList.size()))
           .append("\n")
           .append("-----------------------------------------------")
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
                                                       entry.getValue()
                                                            .get(0)
                                                            .getBetAmount()) : "")
                 .append("\n");
        }
      }
    }
    return content.toString();
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
