package bf5.betting.entity.jpa;

import bf5.betting.constant.BetResult;
import bf5.betting.util.DateTimeUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
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
    private String score;
    @Column
    private long betAmount;
    @Column
    private float ratio;
    @Column
    private long potentialProfit;
    @Column
    private BetResult result;
    @Column
    private Long actualProfit;

    public String getBetTime() {
        return DateTimeUtil.timestampToString(this.matchTime);
    }

    public String getMatchTime() {
        return DateTimeUtil.timestampToString(this.matchTime);
    }
}
