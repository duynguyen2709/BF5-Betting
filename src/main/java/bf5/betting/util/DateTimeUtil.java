package bf5.betting.util;

import lombok.extern.log4j.Log4j2;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

/**
 * @author duynguyen
 */
@Log4j2
public class DateTimeUtil {

    public static final String MYSQL_DATE_ONLY_FORMAT = "yyyy-MM-dd";

    private static final SimpleDateFormat dateTimeFormatter = new SimpleDateFormat("dd/MM/yyyy HH:mm");

    public static String now() {
        return timestampToString(new Timestamp(System.currentTimeMillis()));
    }

    public static String timestampToString(Timestamp timestamp) {
        if (Objects.isNull(timestamp))
            return null;
        return dateTimeFormatter.format(timestamp);
    }

    public static Timestamp stringToTimestamp(String timestampStr) {
        return stringToTimestamp(timestampStr, "dd/MM/yyyy HH:mm");
    }

    public static Date stringToDate(String dateStr, String format) {
        try {
            SimpleDateFormat dateTimeFormatter = new SimpleDateFormat(format);
            return dateTimeFormatter.parse(dateStr);
        } catch (Exception ex) {
            log.error("[stringToDate] raw = {}, format = {}, ex = {}", dateStr, format, ex.getMessage(), ex);
            return null;
        }
    }

    public static Timestamp stringToTimestamp(String timestampStr, String format) {
        try {
            SimpleDateFormat dateTimeFormatter = new SimpleDateFormat(format);
            Date parsedDate = dateTimeFormatter.parse(timestampStr);
            return new Timestamp(parsedDate.getTime());
        } catch (Exception ex) {
            log.error("[stringToTimestamp] raw = {}, format = {}, ex = {}", timestampStr, format, ex.getMessage(), ex);
            return null;
        }
    }

}
