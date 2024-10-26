package bf5.betting.util;

import lombok.extern.log4j.Log4j2;

/**
 * @author duynguyen
 */
@Log4j2
public class NumberUtil {

  public static long getLongValue(Object obj) {
    try {
      String val = String.valueOf(obj);
      return Long.parseLong(val);
    } catch (Exception ex) {
      log.error("[getLongValue] obj = {}, ex", obj, ex);
      return 0L;
    }
  }
}
