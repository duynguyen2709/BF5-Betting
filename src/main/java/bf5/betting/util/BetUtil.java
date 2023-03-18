package bf5.betting.util;


/**
 * @author duynguyen
 **/
public class BetUtil {

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
}
