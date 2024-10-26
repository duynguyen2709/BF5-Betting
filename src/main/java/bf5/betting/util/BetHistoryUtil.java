package bf5.betting.util;


import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.BetMatchDetail;
import bf5.betting.entity.response.GetRawBetResponse;
import org.apache.commons.lang3.StringUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
public class BetHistoryUtil {

  public static String formatVnBetEvent(BetMatchDetail detail) {
    String event = detail.getEvent();
    boolean firstHalfOnly = Boolean.TRUE.equals(detail.getFirstHalfOnly());

    String parsedEvent = event
        .replaceAll("Handicap 1", detail.getFirstTeam())
        .replaceAll("Team 1", detail.getFirstTeam())
        .replaceAll("Handicap 2", detail.getSecondTeam())
        .replaceAll("Team 2", detail.getSecondTeam())
        .replaceAll("W1", detail.getFirstTeam() + " (-0.5)")
        .replaceAll("W2", detail.getSecondTeam() + " (-0.5)")
        .replaceAll("1X", detail.getFirstTeam() + " (+0.5)")
        .replaceAll("2X", detail.getSecondTeam() + " (+0.5)")
        .replaceAll("To Win", "Thắng")
        .replaceAll("Not To Lose", "(+0.5)")
        .replaceAll("Total Over", "Tài")
        .replaceAll("Total >", "Tài")
        .replaceAll("Total Under", "Xỉu")
        .replaceAll("Total <", "Xỉu")
        .replaceAll(" - Yes", "")
        .replaceAll(" And ", " & ")
        .replaceAll("Both Teams To Score", "Cả 2 Đội Cùng Ghi Bàn")
        .replaceAll("Corners:", "Phạt Góc:");
    String firstHalfText = firstHalfOnly ? "Hiệp 1: " : "";
    return firstHalfText + parsedEvent;
  }

  public static String parseEventDetail(GetRawBetResponse.RawBetEvent event) {
    String rawEvent = event.getEventTypeTitle();
    if (StringUtils.isNotBlank(event.getGameTypeTitle())) {
      rawEvent = String.format("%s: %s", event.getGameTypeTitle(), rawEvent);
    }

    return rawEvent
        .replace("W1", "Handicap 1 (-0.5)")
        .replace("W2", "Handicap 2 (-0.5)")
        .replace("1X", "Handicap 1 (0.5)")
        .replace("2X", "Handicap 2 (0.5)");
  }

  public static List<BetHistory> sortByStatusAndBetTimeDesc(List<BetHistory> betHistoryList) {
    List<BetHistory> unfinishedBets = new ArrayList<>();
    List<BetHistory> finishedBets = new ArrayList<>();
    betHistoryList.forEach(betHistory -> {
      if (betHistory.getResult() == BetResult.NOT_FINISHED) {
        unfinishedBets.add(betHistory);
      } else {
        finishedBets.add(betHistory);
      }
    });

    Comparator<BetHistory> betTimeDescComparator = (o1, o2) -> Long.compare(o2.getBetTimeMs(),
        o1.getBetTimeMs());
    unfinishedBets.sort(betTimeDescComparator);
    finishedBets.sort(betTimeDescComparator);

    List<BetHistory> result = new ArrayList<>(unfinishedBets);
    result.addAll(finishedBets);
    return result;
  }

  public static Timestamp getLatestResultSettledTime(List<GetRawBetResponse.RawBetEvent> events) {
    List<GetRawBetResponse.RawBetEvent> sortedEvents = events.stream()
        .filter(event -> event.getCalculationDate() != null)
        .sorted((o1, o2) -> Long.compare(o2.getCalculationDate(), o1.getCalculationDate()))
        .collect(Collectors.toList());
    long resultSettledTime = !sortedEvents.isEmpty() ?
        (sortedEvents.get(0).getCalculationDate() * 1000) : System.currentTimeMillis();
    return new Timestamp(resultSettledTime);
  }
}
