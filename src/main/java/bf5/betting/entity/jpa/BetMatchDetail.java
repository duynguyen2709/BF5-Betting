package bf5.betting.entity.jpa;

import bf5.betting.constant.BetResult;
import bf5.betting.util.DateTimeUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author duynguyen
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "BetMatchDetail")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BetMatchDetail {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  @Column
  private long betId;
  @Column
  private long matchId;
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
  private double ratio;
  @Column
  private BetResult result;

  private transient String firstTeamLogoUrl;
  private transient String secondTeamLogoUrl;

  public String getMatchTime() {
    return DateTimeUtil.timestampToReadableString(this.matchTime);
  }

  public void setMatchTime(String timeStr) {
    this.matchTime = DateTimeUtil.stringToTimestamp(timeStr);
  }

  public Timestamp getRawMatchTime() {
    return this.matchTime;
  }

  public void setMatchTimeWithTimestamp(Timestamp time) {
    this.matchTime = time;
  }
}
