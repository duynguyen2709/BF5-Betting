package bf5.betting.util;


import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

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

    public static List<BetHistory> sortByStatusAndBetTimeAsc(List<BetHistory> betHistoryList) {
        List<BetHistory> unfinishedBets = new ArrayList<>();
        List<BetHistory> finishedBets = new ArrayList<>();
        betHistoryList.forEach(betHistory -> {
            if (betHistory.getResult() == BetResult.NOT_FINISHED) {
                unfinishedBets.add(betHistory);
            } else {
                finishedBets.add(betHistory);
            }
        });

        unfinishedBets.sort(Comparator.comparingLong(BetHistory::getBetTimeMs));
        finishedBets.sort(Comparator.comparingLong(BetHistory::getBetTimeMs));

        List<BetHistory> result = new ArrayList<>(unfinishedBets);
        result.addAll(finishedBets);
        return result;
    }

}
