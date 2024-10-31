package bf5.betting.entity.jpa;

import bf5.betting.constant.BetResult;
import bf5.betting.constant.BetType;
import bf5.betting.util.DateTimeUtil;
import bf5.betting.util.JsonUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

/**
 * @author duynguyen
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "BetHistory")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BetHistory {

  @Id
  private long betId;
  @Column
  private String playerId;
  @Column
  private BetType betType;
  @Column
  private String metadata;
  @Column
  private Timestamp betTime;
  @Column
  private long betAmount;
  @Column
  private double ratio;
  @Column
  private long potentialProfit;
  @Column
  private BetResult result;
  @Column
  private Timestamp resultSettledTime;
  @Column
  private Long actualProfit;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "betId", nullable = false, updatable = false, insertable = false)
  private List<BetMatchDetail> events;

  private transient String rawStatus;

  public String getBetTime() {
    return DateTimeUtil.timestampToReadableString(this.betTime);
  }

  public void setBetTime(String timeStr) {
    this.betTime = DateTimeUtil.stringToTimestamp(timeStr);
  }

  public void setBetTimeWithTimestamp(Timestamp time) {
    this.betTime = time;
  }

  @JsonIgnore
  public long getBetTimeMs() {
    return this.betTime.getTime();
  }

  public void updateResultSettledTime() {
    if (this.getResultSettledTime() != null || this.getResult() == BetResult.NOT_FINISHED) {
      return;
    }
    this.resultSettledTime = new Timestamp(System.currentTimeMillis());
  }

  public Map<String, Object> getMetadata() {
    if (StringUtils.isBlank(this.metadata)) {
      return null;
    }

    return JsonUtil.fromJsonStringToMap(this.metadata, String.class, Object.class);
  }

  public void setMetadata(Map<String, Object> _metadata) {
    if (_metadata != null && !_metadata.isEmpty()) {
      this.metadata = JsonUtil.toJsonString(_metadata);
    }
  }
}
