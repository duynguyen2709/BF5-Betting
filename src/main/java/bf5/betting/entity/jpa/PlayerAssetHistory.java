package bf5.betting.entity.jpa;

import bf5.betting.constant.PaymentAction;
import bf5.betting.util.DateTimeUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * @author duynguyen
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "PlayerAssetHistory")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayerAssetHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  @Column
  private String playerId;
  @Column
  private Long betId;
  @Column
  private Timestamp paymentTime;
  @Column
  private PaymentAction action;
  @Column
  private String paymentMethod;
  @Column
  private long amount;
  @Column
  private long assetBefore;
  @Column
  private long assetAfter;
  @Column(insertable = false, updatable = false)
  private Timestamp updatedAt;

  public String getUpdatedAt() {
    return DateTimeUtil.timestampToReadableString(this.updatedAt);
  }

  public String getPaymentTime() {
    return DateTimeUtil.timestampToReadableString(this.paymentTime);
  }

  public Timestamp getRawPaymentTime() {
    return this.paymentTime;
  }
}
