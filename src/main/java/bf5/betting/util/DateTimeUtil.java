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
    private static final SimpleDateFormat FRIENDLY_DATE_TIME_FORMATTER = new SimpleDateFormat(READABLE_DATE_TIME_FORMAT);
    private static final SimpleDateFormat SYSTEM_DATE_ONLY_FORMATTER = new SimpleDateFormat(SYSTEM_DATE_ONLY_FORMAT);
    private static final long ONE_DAY_MILLI_SECONDS = 24 * 60 * 60 * 1000;

    public static String now() {
        return timestampToReadableString(new Timestamp(System.currentTimeMillis()));
    }

    public static String timestampToReadableString(Timestamp timestamp) {
        if (Objects.isNull(timestamp))
            return null;
        return FRIENDLY_DATE_TIME_FORMATTER.format(timestamp);
    }

    public static String timestampMsToSystemDateString(Timestamp timestamp) {
        if (Objects.isNull(timestamp))
            return null;
        return SYSTEM_DATE_ONLY_FORMATTER.format(timestamp);
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

    public static Date getNextDate(String dateStr) {
        Date date = stringToDate(dateStr, SYSTEM_DATE_ONLY_FORMAT);
        long nextDayMilliSeconds = date.getTime() + ONE_DAY_MILLI_SECONDS;
        return new Date(nextDayMilliSeconds);
    }

    public static Date getYesterday() {
        Date today = new Date(System.currentTimeMillis());
        long yesterdayMs = today.getTime() - ONE_DAY_MILLI_SECONDS;
        return new Date(yesterdayMs);
    }

    public static String getDateStringFromToday(int plusDays) {
        long current = System.currentTimeMillis();
        long plusTime = current + plusDays * ONE_DAY_MILLI_SECONDS;
        return SYSTEM_DATE_ONLY_FORMATTER.format(new Timestamp(plusTime));
    }
}
