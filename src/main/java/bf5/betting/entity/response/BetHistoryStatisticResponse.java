package bf5.betting.entity.response;

import bf5.betting.constant.PaymentAction;
import bf5.betting.entity.jpa.BetHistory;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author duynguyen
 **/
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BetHistoryStatisticResponse implements Serializable {

  private String playerId;
  private String startDate;
  private String endDate;
  private List<AssetByDate> assetByDateList;
  private List<BetHistory> betHistoryList;


  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class AssetByDate implements Serializable {

    private String paymentTime;
    private long assetBefore;
    private long assetAfter;
    private PaymentAction action;
  }
}
