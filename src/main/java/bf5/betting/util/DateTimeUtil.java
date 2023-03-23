package bf5.betting.util;

import lombok.extern.log4j.Log4j2;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Objects;

/**
 * @author duynguyen
 */
@Log4j2
public class DateTimeUtil {

    public static final String SYSTEM_DATE_ONLY_FORMAT = "yyyy-MM-dd";
    public static final String READABLE_DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm";
    private static final SimpleDateFormat DATE_TIME_FORMATTER = new SimpleDateFormat(READABLE_DATE_TIME_FORMAT);

    public static String now() {
        return timestampToString(new Timestamp(System.currentTimeMillis()));
    }

    public static String timestampToString(Timestamp timestamp) {
        if (Objects.isNull(timestamp))
            return null;
        return DATE_TIME_FORMATTER.format(timestamp);
    }

    public static Timestamp stringToTimestamp(String timestampStr) {
        return stringToTimestamp(timestampStr, READABLE_DATE_TIME_FORMAT);
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

    public static long getStartOfDateTimestamp(String dateStr, String format) {
        LocalDate localDate = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(format));
        LocalDateTime startOfDay = localDate.atStartOfDay();
        return Timestamp.valueOf(startOfDay).getTime();
    }

    public static long getEndOfDateTimestamp(String dateStr, String format) {
        LocalDate localDate = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(format));
        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);
        return Timestamp.valueOf(endOfDay).getTime();
    }
}
