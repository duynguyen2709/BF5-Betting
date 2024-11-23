package bf5.betting.service.impl;

import static bf5.betting.constant.Constant.ERROR_MISSING_SESSION_TOKEN_PARAM;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.converter.RawBetEntityConverter;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.GetRawBetRequest;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.exception.UncheckedHttpResponseException;
import bf5.betting.service.RawBetService;
import bf5.betting.service.ServerConfigService;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.apache.hc.client5.http.HttpResponseException;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.stereotype.Service;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class RawBetServiceImpl implements RawBetService {

  private final RawBetEntityConverter entityConverter;
  private final ServerConfigService serverConfigService;
  private final CloseableHttpClient httpClient;

  private final Cache<String, List<GetRawBetResponse.RawBetEntity>> cache = Caffeine.newBuilder()
                                                                                    .expireAfterWrite(35,
                                                                                                      TimeUnit.MINUTES)
                                                                                    .build();

  private String getValidToken(String sessionToken) {
    if (StringUtils.isBlank(sessionToken)) {
      String currentSavedToken = this.serverConfigService.getLastActiveToken();
      if (StringUtils.isBlank(currentSavedToken)) {
        throw new IllegalArgumentException(ERROR_MISSING_SESSION_TOKEN_PARAM);
      } else {
        sessionToken = currentSavedToken;
      }
    }
    return sessionToken;
  }

  @SneakyThrows
  @Override
  @TryCatchWrap
  public List<BetHistory> getAllBetWithConvert(String sessionToken, String startDate,
      String endDate) {
    final String cacheKey = String.format("%s-%s", startDate, endDate);
    final String nonEmptySessionToken = getValidToken(sessionToken);
    List<GetRawBetResponse.RawBetEntity> bets = cache.get(cacheKey, s -> {
      try {
        return getFromApiByDate(nonEmptySessionToken, startDate, endDate);
      } catch (Exception ex) {
        log.error(ex);
        if (ex instanceof HttpResponseException) {
          this.serverConfigService.setLastActiveToken("");
          HttpResponseException castedException = (HttpResponseException) ex;
          throw new UncheckedHttpResponseException(castedException);
        }
        throw new RuntimeException(ex);
      }
    });
    return entityConverter.convertToPlayerBetHistory(bets);
  }

  @SneakyThrows
  @Override
  @TryCatchWrap
  public List<BetHistory> quickGetLast30MinutesBets(String sessionToken) {
    long endTime = System.currentTimeMillis();
    long startTime = endTime - TimeUnit.MINUTES.toMillis(30);

    final String cacheKey = String.format("QUICK-%s-%s", startTime, endTime);
    final String nonEmptySessionToken = getValidToken(sessionToken);
    List<GetRawBetResponse.RawBetEntity> bets = cache.get(cacheKey, s -> {
      try {
        return getFromApi(nonEmptySessionToken, startTime / 1000, endTime / 1000);
      } catch (Exception ex) {
        log.error(ex);
        if (ex instanceof HttpResponseException) {
          this.serverConfigService.setLastActiveToken("");
          HttpResponseException castedException = (HttpResponseException) ex;
          throw new UncheckedHttpResponseException(castedException);
        }
        throw new RuntimeException(ex);
      }
    });
    return entityConverter.convertToPlayerBetHistory(bets);
  }

  @Override
  public List<BetHistory> getListBetForAutoUpdater() {
    if (StringUtils.isEmpty(this.serverConfigService.getLastActiveToken())) {
      log.warn("LAST_ACTIVE_SESSION_TOKEN is empty");
      return new ArrayList<>();
    }

    try {
      String today = DateTimeUtil.getDateStringFromToday(0);
      String yesterday = DateTimeUtil.getDateStringFromToday(-1);
      List<GetRawBetResponse.RawBetEntity> bets = getFromApiByDate(this.serverConfigService.getLastActiveToken(),
                                                                   yesterday,
                                                                   today);
      return entityConverter.convertToPlayerBetHistory(bets);
    } catch (Exception ex) {
      if (ex instanceof HttpResponseException) {
        this.serverConfigService.setLastActiveToken("");
        HttpResponseException castedException = (HttpResponseException) ex;
        throw new UncheckedHttpResponseException(castedException);
      }
      throw new RuntimeException(ex);
    }
  }

  private List<GetRawBetResponse.RawBetEntity> getFromApiByDate(String sessionToken,
      String startDate, String endDate) throws IOException {
    long startTime =
        DateTimeUtil.getStartOfDateTimestamp(startDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT)
            / 1000;
    long endTime =
        DateTimeUtil.getEndOfDateTimestamp(endDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT) / 1000;
    return getFromApi(sessionToken, startTime, endTime);
  }

  private List<GetRawBetResponse.RawBetEntity> getFromApi(String sessionToken, long startTime,
      long endTime) throws IOException {
    GetRawBetRequest request = GetRawBetRequest.build(startTime, endTime);

    HttpPost httpPost = new HttpPost(this.serverConfigService.getBetHistoryApiUrl());
    StringEntity entity = new StringEntity(Objects.requireNonNull(JsonUtil.toJsonString(request)),
                                           ContentType.APPLICATION_JSON);
    httpPost.setEntity(entity);

    httpPost.setHeader("cookie", String.format(
        "is_rtl=1; lng=en; flaglng=en; typeBetNames=full; tzo=7; _ym_uid=1676720947661580605; " +
            "_ym_d=1676720947; _ga=GA1.2.1833299673.1676720948; che_g=88625477-5a54-3a01-df02-80dd5369756a; " +
            "sh.session=c308fd5b-66a9-4459-a57c-dce520bbc59f; pushfree_status=canceled; _gid=GA1.2.1300401392.1678891508; "
            +
            "fast_coupon=true; bettingView=1; right_side=right; v3frm=1; auid=Z6x1DGQVLYysdFTZA3DLAg==; completed_user_settings=true; "
            +
            "game_cols_count=2; dnb=1; _ym_isad=1; _ym_visorc=b; coefview=0; ggru=188; _grant_1679167615=ml13107; SESSION=%s; ua=39234719; "
            +
            "uhash=34ef190e01e2825148c499a80691148f; cur=VND; disallow_sport=; visit=4-4969002a8e5b53d75664aae7b87f4eac; "
            +
            "_glhf=1679167708; v3fr=1; _gat_gtag_UA_131019888_1=1", sessionToken));

    httpPost.setHeader("authority", "1x88.net");
    httpPost.setHeader("origin", "https://1x88.net");
    httpPost.setHeader("referer", "https://1x88.net/office/history");
    httpPost.setHeader("x-requested-with", "XMLHttpRequest");
    httpPost.setHeader("sec-ch-ua", "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"");
    httpPost.setHeader("sec-ch-ua-mobile", "?0");
    httpPost.setHeader("sec-ch-ua-platform", "macOS");
    httpPost.setHeader("sec-fetch-dest", "empty");
    httpPost.setHeader("sec-fetch-mode", "cors");
    httpPost.setHeader("sec-fetch-site", "same-origin");
    httpPost.setHeader("user-agent",
                       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36");

    GetRawBetResponse response = JsonUtil.fromJsonResponse(httpClient.execute(httpPost)
                                                                     .getEntity()
                                                                     .getContent(), GetRawBetResponse.class);

//    log.info("Receive raw response from 1xBet: {}, total query time: {}ms", JsonUtil.toJsonString(response),
//             (System.currentTimeMillis() - now));

    // If we can get here then current token is still active, or else it has already thrown exception
    if (response != null && !this.serverConfigService.getLastActiveToken()
                                                     .equals(sessionToken)) {
      this.serverConfigService.setLastActiveToken(sessionToken);
    }

    return response.getData()
                   .getBets();
  }
}
