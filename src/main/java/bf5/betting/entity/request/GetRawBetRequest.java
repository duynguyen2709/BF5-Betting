package bf5.betting.entity.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

import static bf5.betting.constant.Constant._1xBet_ACCOUNT_ID;

/**
 * @author duynguyen
 **/
@Data
public class GetRawBetRequest implements Serializable {

  @JsonProperty("timestamp_from")
  private long timestampFrom;
  @JsonProperty("timestamp_to")
  private long timestampTo;
  @JsonProperty("account_id")
  private String accountId;
  @JsonProperty("coef_view")
  private int coefView;
  @JsonProperty("feed_types")
  private int[] feedTypes;
  @JsonProperty("bet_common_statuses")
  private int[] betCommonStatuses;
  @JsonProperty("bet_types")
  private int[] betTypes;
  @JsonProperty("is_calculated_date_type")
  private boolean isCalculatedDateType;
  @JsonProperty("include_terminal_bets")
  private boolean includeTerminalBets;
  @JsonProperty("sort_type")
  private int sortType;

  private GetRawBetRequest() {
    this.accountId = _1xBet_ACCOUNT_ID;
    this.coefView = 0;
    this.feedTypes = new int[]{0, 1};
    this.betCommonStatuses = new int[]{1, 2, 3, 4, 5, 6, 7, 8};
    this.betTypes = new int[]{0, 1, 9, 7, 3, 8, 4, 5, 6, 2};
    this.isCalculatedDateType = false;
    this.includeTerminalBets = false;
    this.sortType = 1;
  }

  public static GetRawBetRequest build(long timestampFrom, long timestampTo) {
    GetRawBetRequest request = new GetRawBetRequest();
    request.setTimestampFrom(timestampFrom);
    request.setTimestampTo(timestampTo);
    return request;
  }
}
