package bf5.betting.util;


import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.response.GetRawBetResponse;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
public class BetHistoryUtil {

    public static String parseEvent(String rawEvent) {
        if (rawEvent.equals("W1")) {
            return "Handicap 1 (-0.5)";
        }
        if (rawEvent.equals("W2")) {
            return "Handicap 2 (-0.5)";
        }
        if (rawEvent.equals("1X")) {
            return "Handicap 1 (0.5)";
        }
        if (rawEvent.equals("2X")) {
            return "Handicap 2 (0.5)";
        }
        return rawEvent;
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

        Comparator<BetHistory> betTimeDescComparator = (o1, o2) -> Long.compare(o2.getBetTimeMs(), o1.getBetTimeMs());
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
        long resultSettledTime = sortedEvents.size() > 0 ?
                (sortedEvents.get(0).getCalculationDate() * 1000) : System.currentTimeMillis();
        return new Timestamp(resultSettledTime);
    }
}
