package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.constant.BetResult;
import bf5.betting.constant.RawBetStatus;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.request.GetRawBetRequest;
import bf5.betting.entity.response.GetRawBetResponse;
import bf5.betting.service.BetHistoryService;
import bf5.betting.service.RawBetService;
import bf5.betting.util.BetUtil;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.hc.client5.http.fluent.Request;
import org.apache.hc.core5.http.ContentType;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class RawBetServiceImpl implements RawBetService {

    private static final String API_URL = "https://1x88.net/api/internal/v1/betHistory/getBetHistoryList";

    private final BetHistoryService betHistoryService;

    @SneakyThrows
    @Override
    @TryCatchWrap
    public List<GetRawBetResponse.RawBetEntity> getAllBet(String sessionToken, String startDate, String endDate) {
        long startTime = DateTimeUtil.getStartOfDateTimestamp(startDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT) / 1000;
        long endTime = DateTimeUtil.getEndOfDateTimestamp(endDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT) / 1000;
        GetRawBetRequest request = GetRawBetRequest.build(startTime, endTime);
        Request httpRequest = Request.post(API_URL)
                .bodyString(JsonUtil.toJsonString(request), ContentType.APPLICATION_JSON)
                .setHeader("cookie", String.format("is_rtl=1; lng=en; flaglng=en; typeBetNames=full; tzo=7; _ym_uid=1676720947661580605; " +
                        "_ym_d=1676720947; _ga=GA1.2.1833299673.1676720948; che_g=88625477-5a54-3a01-df02-80dd5369756a; " +
                        "sh.session=c308fd5b-66a9-4459-a57c-dce520bbc59f; pushfree_status=canceled; _gid=GA1.2.1300401392.1678891508; " +
                        "fast_coupon=true; bettingView=1; right_side=right; v3frm=1; auid=Z6x1DGQVLYysdFTZA3DLAg==; completed_user_settings=true; " +
                        "game_cols_count=2; dnb=1; _ym_isad=1; _ym_visorc=b; coefview=0; ggru=188; _grant_1679167615=ml13107; SESSION=%s; ua=39234719; " +
                        "uhash=34ef190e01e2825148c499a80691148f; cur=VND; disallow_sport=; visit=4-4969002a8e5b53d75664aae7b87f4eac; " +
                        "_glhf=1679167708; v3fr=1; _gat_gtag_UA_131019888_1=1", sessionToken))
                .setHeader("authority", "1x88.net")
                .setHeader("origin", "https://1x88.net")
                .setHeader("referer", "https://1x88.net/office/history")
                .setHeader("x-requested-with", "XMLHttpRequest")
                .setHeader("sec-ch-ua", "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"")
                .setHeader("sec-ch-ua-mobile", "?0")
                .setHeader("sec-ch-ua-platform", "macOS")
                .setHeader("sec-fetch-dest", "empty")
                .setHeader("sec-fetch-mode", "cors")
                .setHeader("sec-fetch-site", "same-origin")
                .setHeader("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36");

        String rawResponse = httpRequest.execute().returnContent().asString();
        GetRawBetResponse response = JsonUtil.fromJsonString(rawResponse, GetRawBetResponse.class);
        return response.getData().getBets();
    }

    @SneakyThrows
    @Override
    @TryCatchWrap
    public List<BetHistory> getAllBetWithConvert(String sessionToken, String startDate, String endDate) {
        long startTime = DateTimeUtil.getStartOfDateTimestamp(startDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT) / 1000;
        long endTime = DateTimeUtil.getEndOfDateTimestamp(endDate, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT) / 1000;
        GetRawBetRequest request = GetRawBetRequest.build(startTime, endTime);
        Request httpRequest = Request.post(API_URL)
                .bodyString(JsonUtil.toJsonString(request), ContentType.APPLICATION_JSON)
                .setHeader("cookie", String.format("is_rtl=1; lng=en; flaglng=en; typeBetNames=full; tzo=7; _ym_uid=1676720947661580605; " +
                        "_ym_d=1676720947; _ga=GA1.2.1833299673.1676720948; che_g=88625477-5a54-3a01-df02-80dd5369756a; " +
                        "sh.session=c308fd5b-66a9-4459-a57c-dce520bbc59f; pushfree_status=canceled; _gid=GA1.2.1300401392.1678891508; " +
                        "fast_coupon=true; bettingView=1; right_side=right; v3frm=1; auid=Z6x1DGQVLYysdFTZA3DLAg==; completed_user_settings=true; " +
                        "game_cols_count=2; dnb=1; _ym_isad=1; _ym_visorc=b; coefview=0; ggru=188; _grant_1679167615=ml13107; SESSION=%s; ua=39234719; " +
                        "uhash=34ef190e01e2825148c499a80691148f; cur=VND; disallow_sport=; visit=4-4969002a8e5b53d75664aae7b87f4eac; " +
                        "_glhf=1679167708; v3fr=1; _gat_gtag_UA_131019888_1=1", sessionToken))
                .setHeader("authority", "1x88.net")
                .setHeader("origin", "https://1x88.net")
                .setHeader("referer", "https://1x88.net/office/history")
                .setHeader("x-requested-with", "XMLHttpRequest")
                .setHeader("sec-ch-ua", "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"")
                .setHeader("sec-ch-ua-mobile", "?0")
                .setHeader("sec-ch-ua-platform", "macOS")
                .setHeader("sec-fetch-dest", "empty")
                .setHeader("sec-fetch-mode", "cors")
                .setHeader("sec-fetch-site", "same-origin")
                .setHeader("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36");

        String rawResponse = httpRequest.execute().returnContent().asString();
        GetRawBetResponse response = JsonUtil.fromJsonString(rawResponse, GetRawBetResponse.class);
        List<GetRawBetResponse.RawBetEntity> bets = response.getData().getBets();
        return convertRawBetToEntity(bets);
    }

    private List<BetHistory> convertRawBetToEntity(List<GetRawBetResponse.RawBetEntity> bets) {
        Map<Long, BetHistory> allBetHistories = betHistoryService.getAllBetHistory()
                .stream()
                .collect(Collectors.toMap(BetHistory::getId, Function.identity()));

        return bets.stream()
                .map(bet -> {
                    GetRawBetResponse.RawBetEvent event = bet.getEvents().get(0);
                    boolean isFinished = bet.getStatus() != 1;
                    BetHistory rawBet = new BetHistory();
                    rawBet.setId(bet.getId());
                    rawBet.setBetTimeWithTimestamp(new Timestamp(bet.getDate() * 1000));
                    rawBet.setBetAmount(bet.getSum());
                    rawBet.setRatio(event.getCoef());
                    rawBet.setPotentialProfit((long) (bet.getSum() * event.getCoef()) - bet.getSum());
                    rawBet.setScore(isFinished ? event.getScore() : null);
                    rawBet.setEvent(BetUtil.parseEvent(event.getEventTypeTitle()));
                    rawBet.setMatchTimeWithTimestamp(new Timestamp(event.getGameStartDate() * 1000));
                    rawBet.setTournamentName(event.getChampName());
                    rawBet.setFirstHalfOnly(event.getPeriodName().equals("1 Half") ? true : null);
                    rawBet.setFirstTeam(event.getOpp1Name());
                    rawBet.setFirstTeamLogoUrl(String.format("https://v2l.cdnsfree.com/sfiles/logo_teams/%s", event.getOpp1Images().get(0)));
                    rawBet.setSecondTeam(event.getOpp2Name());
                    rawBet.setSecondTeamLogoUrl(String.format("https://v2l.cdnsfree.com/sfiles/logo_teams/%s", event.getOpp2Images().get(0)));
                    rawBet.setActualProfit(calculateActualProfit(bet));
                    rawBet.setResult(calculateResult(bet));
                    if (allBetHistories.containsKey(bet.getId())) {
                        BetHistory insertedHistory = allBetHistories.get(bet.getId());
                        rawBet.setPlayerId(insertedHistory.getPlayerId());
                        rawBet.setRawStatus(RawBetStatus.INSERTED.name());

                        if (insertedHistory.getActualProfit() != null) {
                            rawBet.setRawStatus(RawBetStatus.SETTLED.name());
                        } else if (event.getIsFinished()) {
                            rawBet.setRawStatus(RawBetStatus.RESULT_READY_TO_BE_UPDATED.name());
                        }
                    } else {
                        rawBet.setRawStatus(RawBetStatus.NEW.name());
                    }
                    return rawBet;
                })
                .collect(Collectors.toList());
    }

    private Long calculateActualProfit(GetRawBetResponse.RawBetEntity bet) {
        boolean isNotFinished = bet.getStatus() == 1;
        if (isNotFinished)
            return null;

        boolean isFullLost = bet.getStatus() == 2;
        if (isFullLost)
            return (-1) * bet.getSum();

        return bet.getWinSum() - bet.getSum();
    }

    private BetResult calculateResult(GetRawBetResponse.RawBetEntity bet) {
        GetRawBetResponse.RawBetEvent event = bet.getEvents().get(0);
        boolean isNotFinished = bet.getStatus() == 1;
        if (isNotFinished)
            return BetResult.NOT_FINISHED;

        boolean isFullLost = bet.getStatus() == 2;
        if (isFullLost)
            return BetResult.LOST;

        boolean isHalfLost = bet.getCoef() == 0.5 || bet.getSum() > bet.getWinSum();
        if (isHalfLost)
            return BetResult.HALF_LOST;

        boolean isDraw = bet.getCoef() == 1 || bet.getSum() == bet.getWinSum();
        if (isDraw)
            return BetResult.DRAW;

        boolean isFullWin = bet.getStatus() == 4 && bet.getCoef() == event.getCoef();
        if (isFullWin)
            return BetResult.WIN;

        boolean isHalfWin = bet.getStatus() == 4 && bet.getCoef() < event.getCoef() && bet.getCoef() > 1;
        if (isHalfWin)
            return BetResult.HALF_WIN;

        return BetResult.NOT_FINISHED;
    }
}
