package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.request.GetRawBetRequest;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.service.RawBetService;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.hc.client5.http.fluent.Request;
import org.apache.hc.core5.http.ContentType;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class RawBetServiceImpl implements RawBetService {

    private static final String API_URL = "https://1x88.net/api/internal/v1/betHistory/getBetHistoryList";

    @SneakyThrows
    @Override
    @TryCatchWrap
    public List<GetRawBetResponse.RawBetEntity> getAllBet(String sessionToken, String startDate, String endDate) {
        long startTime = DateTimeUtil.getStartOfDateTimestamp(startDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT) / 1000;
        long endTime = DateTimeUtil.getEndOfDateTimestamp(endDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT) / 1000;
        GetRawBetRequest request = GetRawBetRequest.build(startTime, endTime);
        Request httpRequest = Request.post(API_URL)
                .bodyString(JsonUtil.toJsonString(request), ContentType.APPLICATION_JSON)
                .setHeader("Cookie", String.format("SESSION=%s", sessionToken));

        String rawResponse = httpRequest.execute().returnContent().asString();
        GetRawBetResponse response = JsonUtil.fromJsonString(rawResponse, GetRawBetResponse.class);
        return response.getData().getBets();
    }
}
