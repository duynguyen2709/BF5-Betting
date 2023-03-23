package bf5.betting.entity.jpa;

import bf5.betting.constant.BetResult;
import bf5.betting.util.DateTimeUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.sql.Timestamp;

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
    private long id;
    @Column
    private String playerId;
    @Column
    private Timestamp betTime;
    @Column
    private Timestamp matchTime;
    @Column
    private String firstTeam;
    @Column
    private String secondTeam;
    @Column
    private String tournamentName;
    @Column
    private String event;
    @Column
    private Boolean firstHalfOnly;
    @Column
    private String score;
    @Column
    private long betAmount;
    @Column
    private double ratio;
    @Column
    private long potentialProfit;
    @Column
    private BetResult result;
    @Column
    private Long actualProfit;

    private transient String secondTeamLogoUrl;
    private transient String firstTeamLogoUrl;
    private transient String rawStatus;

    public String getBetTime() {
        return DateTimeUtil.timestampToString(this.betTime);
    }

    public void setBetTime(String timeStr) {
        this.betTime = DateTimeUtil.stringToTimestamp(timeStr);
    }

    public void setBetTimeWithTimestamp(Timestamp time) {
        this.betTime = time;
    }

    public long getBetTimeMs() {
        return this.betTime.getTime();
    }

    public String getMatchTime() {
        return DateTimeUtil.timestampToString(this.matchTime);
    }

    public void setMatchTime(String timeStr) {
        this.matchTime = DateTimeUtil.stringToTimestamp(timeStr);
    }

    public void setMatchTimeWithTimestamp(Timestamp time) {
        this.matchTime = time;
    }
}
