package bf5.betting.entity.jpa;

import bf5.betting.constant.BetResult;
import bf5.betting.constant.BetType;
import bf5.betting.util.DateTimeUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

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
}
