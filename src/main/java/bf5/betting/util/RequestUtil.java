package bf5.betting.util;

import bf5.betting.constant.UserAction;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * @author duynguyen
 **/
@Log4j2
public class RequestUtil {

  public static final String[] IP_HEADER_CANDIDATES = {
      "X-Original-Forwarded-For",
      "X-Forwarded-For",
      "Proxy-Client-IP",
      "WL-Proxy-Client-IP",
      "HTTP_X_FORWARDED_FOR",
      "HTTP_X_FORWARDED",
      "HTTP_X_CLUSTER_CLIENT_IP",
      "HTTP_CLIENT_IP",
      "HTTP_FORWARDED_FOR",
      "HTTP_FORWARDED",
      "HTTP_VIA",
      "REMOTE_ADDR"
  };

  public static String getRequestIpAddress(HttpServletRequest request) {
    for (String header : IP_HEADER_CANDIDATES) {
      String ipList = request.getHeader(header);
      if (ipList != null && ipList.length() != 0 && !"unknown".equalsIgnoreCase(ipList)) {
        return ipList.split(",")[0];
      }
    }
    return request.getRemoteAddr();
  }

  public static void logUserAction(HttpServletRequest request, UserAction action,
      Map<String, Object> params) {
    String ipAddress = getRequestIpAddress(request);
    String userAgent = request.getHeader(HttpHeaders.USER_AGENT);

    Map<String, Object> payload = new HashMap<>();
    payload.put("ipAddress", ipAddress);
    payload.put("userAgent", userAgent);
    payload.put("action", action);
    payload.put("actionTime", DateTimeUtil.now());
    payload.put("params", params);

    // TODO: Write this log to file or database
    log.info("\nNew User Action Recorded: {}\n", JsonUtil.toJsonString(payload));
  }
}
